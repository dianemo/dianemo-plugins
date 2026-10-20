import { acquireLock, releaseLock, LOCK_TTL_MS } from "@dianemo/plugin-kit";
import { UspsPaymentAccountType } from "./requests/payments/types.js";
import type { UspsPaymentRole } from "./requests/payments/types.js";
import { authorizePayment } from "./requests/payments/index.js";
import RequestHandler, { buildClientName } from "@dianemo/core";
import { createHash } from "node:crypto";
import {
  getCachedPaymentToken,
  setCachedPaymentToken,
} from "./utils/uspsPaymentTokenCache.js";
import {
  CreateClientData,
  OAuth2Credentials,
} from "@dianemo/core/client/types";

export interface UspsCredentials extends OAuth2Credentials {
  /** Customer Registration Identifier — issued by USPS, identifies the business. */
  crid: string;
  /** Mailer Identifier used in PAYER + LABEL_OWNER roles. */
  mid: string;
  /**
   * Manifest Mailer Identifier used in PAYER + LABEL_OWNER roles. Absent means
   * the field is omitted from both roles, not defaulted to `mid` — see
   * docs/usps-api.md#manifestmid.
   */
  manifestMid?: string;
  /**
   * How this account pays USPS. Defaults to `EPS` (Enterprise Payment System);
   * shippers billing against a permit or meter must say so, or the payment
   * token that gates every label request is minted for the wrong account type.
   */
  paymentAccountType?: UspsPaymentAccountType;
}

declare module "@dianemo/core" {
  interface ClientTemplates {
    usps: UspsCredentials;
  }
}

const DEFAULT_PAYMENT_ACCOUNT_TYPE: UspsPaymentAccountType = "EPS";

function credsFingerprint(creds: UspsCredentials): string {
  // Stable hash of every creds field the interceptor closes over. Lets
  // clientDataEqual detect a rotation even though function identity is
  // intentionally ignored — without this, rotating only `crid`/`mid` (which
  // aren't part of `CreateClientData`) would leave the existing closure
  // bound to stale values.
  //
  // `paymentAccountType` is hashed resolved rather than raw, so that omitting
  // it and passing its default read as one account rather than two.
  return createHash("sha256")
    .update(
      JSON.stringify({
        clientId: creds.clientId,
        clientSecret: creds.clientSecret,
        baseUrl: creds.baseUrl,
        crid: creds.crid,
        mid: creds.mid,
        manifestMid: creds.manifestMid ?? null,
        paymentAccountType:
          creds.paymentAccountType ?? DEFAULT_PAYMENT_ACCOUNT_TYPE,
      })
    )
    .digest("hex");
}

/**
 * One client per account, split into two metered sub-clients because USPS meters
 * per API and publishes a quota for only one group of them — see
 * docs/usps-api.md#rate-limits.
 */
export async function registerUspsTemplate(handler: RequestHandler) {
  await handler.registerClientTemplate("usps", (creds): CreateClientData[] => {
    // Computed once per client rather than per request: the payment-token cache
    // is keyed on it, and it does not change while these creds are the ones the
    // interceptor closes over.
    const fingerprint = credsFingerprint(creds);
    // The account, not a leaf. Requests are dispatched against the sub-clients
    // below; this name is what the payment token is cached against, so both of
    // them share one token per account rather than minting their own.
    const accountClientName = buildClientName("usps", creds);

    return [
      {
        name: accountClientName,
        metadata: { credsFingerprint: fingerprint },
        httpStatusCodesToMute: [503],
        requestOptions: {
          defaults: {
            baseURL: creds.baseUrl,
            headers: { "Content-Type": "application/json" },
          },
        },
        authentication: {
          type: "oauth2",
          clientId: creds.clientId,
          clientSecret: creds.clientSecret,
          refreshConfig: {
            url: `${creds.baseUrl}/oauth2/v3/token`,
            dataLocation: "jsonBody",
            data: {
              grant_type: "client_credentials",
              client_id: "{{clientId}}",
              client_secret: "{{clientSecret}}",
            },
          },
        },
        // Deliberately unmetered, and deliberately not a request target: the
        // parent exists to own the OAuth token both sub-clients draw on. A
        // budget here would be a third bucket nothing spends from.
        subClients: [
          {
            name: "default",
            /**
             * USPS's documented 60/hour, spread to one call a minute rather
             * than a burst of 60 so a cold replica cannot spend the whole hour
             * in a second. Pickups rides here too, on the conservative side of
             * an unpublished quota — see docs/usps-api.md#rate-limits.
             */
            rateLimit: [
              {
                type: "requestLimit",
                interval: 60_000,
                tokensToAdd: 1,
                maxTokens: 1,
              },
            ],
          },
          {
            name: "labels",
            /**
             * A working default, **not** a documented limit: USPS publishes no
             * quota for Labels or Payments at all. Confirm yours and pass
             * `rateLimitOverrides` to `addTemplateClient` rather than editing
             * this number — see docs/usps-api.md#rate-limits.
             */
            rateLimit: [
              {
                type: "requestLimit",
                interval: 1000,
                tokensToAdd: 10,
                maxTokens: 10,
              },
            ],
            requestOptions: {
              // Only on this sub-client: the payment token gates label
              // requests, and only labels and payments are dispatched here.
              requestInterceptor: async (config) => {
                if (!config.requestName.startsWith("usps.labels"))
                  return config;

                const accountNumber = config.metadata?.uspsAccountNumber;
                if (
                  typeof accountNumber !== "string" ||
                  accountNumber.length === 0
                ) {
                  throw new Error(
                    `${config.requestName} requires metadata.uspsAccountNumber to mint X-Payment-Authorization-Token`
                  );
                }

                // The account name, not `config.clientName` — see
                // `getOrMintPaymentToken`.
                const token = await getOrMintPaymentToken(
                  creds,
                  fingerprint,
                  accountClientName,
                  accountNumber
                );
                config.headers = {
                  ...config.headers,
                  "X-Payment-Authorization-Token": token,
                };
                return config;
              },
            },
          },
        ],
      },
    ];
  });
}

// The wait must exceed the lock's own TTL by at least one poll cycle so a stuck
// replica's auto-released lock can be re-acquired before our deadline fires —
// otherwise every other replica throws on a deterministic race the same instant
// the lock expires. The TTL is read from plugin-kit rather than restated here,
// so the two cannot drift.
const MINT_POLL_INTERVAL_MS = 150;
const MINT_WAIT_TIMEOUT_MS = LOCK_TTL_MS + MINT_POLL_INTERVAL_MS * 4;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * `accountClientName` must be the *account* client (`usps:_:main`), never a
 * sub-client, and three separate things break differently if `config.clientName`
 * is passed instead: USPS mints per account and credentials rather than per
 * rate-limit bucket, so a leaf name makes the two sub-clients mint separate
 * tokens for one account; it also stops the mint lock being what serialises a
 * credential rotation; and `authorizePayment` appends `:labels` itself, so a leaf
 * yields `usps:_:main:labels:labels` — not a registered client, and a
 * `ClientNotFoundError` at the worst possible moment.
 */
async function getOrMintPaymentToken(
  creds: UspsCredentials,
  fingerprint: string,
  accountClientName: string,
  accountNumber: string
): Promise<string> {
  const cached = await getCachedPaymentToken(
    accountClientName,
    accountNumber,
    fingerprint
  );
  if (cached) return cached;

  // Not folded into the lock key: a rotation in flight should serialise the two
  // mints rather than run them against each other.
  const lockKey = `paymentToken:mint:${accountClientName}:${accountNumber}`;
  const deadline = Date.now() + MINT_WAIT_TIMEOUT_MS;

  while (Date.now() < deadline) {
    const lockToken = await acquireLock("usps", lockKey);
    if (lockToken) {
      try {
        // Double-checked locking: another replica may have minted between our
        // initial cache check and lock acquisition.
        const recheck = await getCachedPaymentToken(
          accountClientName,
          accountNumber,
          fingerprint
        );
        if (recheck) return recheck;

        return await mintAndCachePaymentToken(
          creds,
          fingerprint,
          accountClientName,
          accountNumber
        );
      } finally {
        await releaseLock("usps", lockKey, lockToken);
      }
    }

    await sleep(MINT_POLL_INTERVAL_MS);
    const fresh = await getCachedPaymentToken(
      accountClientName,
      accountNumber,
      fingerprint
    );
    if (fresh) return fresh;
  }

  throw new Error(
    `Timed out waiting for USPS payment token mint (${accountClientName}, account ${accountNumber})`
  );
}

async function mintAndCachePaymentToken(
  creds: UspsCredentials,
  fingerprint: string,
  accountClientName: string,
  accountNumber: string
): Promise<string> {
  const payerRole: UspsPaymentRole = {
    roleName: "PAYER",
    CRID: creds.crid,
    MID: creds.mid,
    ...(creds.manifestMid ? { manifestMID: creds.manifestMid } : {}),
    accountType: creds.paymentAccountType ?? DEFAULT_PAYMENT_ACCOUNT_TYPE,
    accountNumber,
  };
  const labelOwnerRole: UspsPaymentRole = {
    roleName: "LABEL_OWNER",
    CRID: creds.crid,
    MID: creds.mid,
    ...(creds.manifestMid ? { manifestMID: creds.manifestMid } : {}),
  };

  const { paymentAuthorizationToken } = await authorizePayment(
    accountClientName,
    { roles: [payerRole, labelOwnerRole] }
  );
  if (!paymentAuthorizationToken) {
    throw new Error("USPS payment-authorization response missing token");
  }

  await setCachedPaymentToken(
    accountClientName,
    accountNumber,
    fingerprint,
    paymentAuthorizationToken,
    // A margin under a claimed 8-hour maximum that no USPS page actually
    // states — see docs/usps-api.md#payment-token-ttl
    7 * 60 * 60
  );
  return paymentAuthorizationToken;
}
