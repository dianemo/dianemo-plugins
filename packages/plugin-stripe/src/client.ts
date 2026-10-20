import RequestHandler, { buildClientName } from "@dianemo/core";
import {
  BaseCredentialsData,
  CreateClientData,
} from "@dianemo/core/client/types";

/**
 * One client variant per Stripe account: `instanceId` carries the Stripe account
 * id, so the clientName is `stripe:<orgId|"_">:<stripeAccountId>`.
 *
 * Connect on-behalf-of access is deliberately *not* supported. Stripe's
 * `Stripe-Account` header is the platform's own secret key plus a connected
 * account's Stripe-issued `acct_…` id, whereas an `instanceId` here is a free-form
 * alias paired with that account's own key — synthesising the header from it would
 * route charges by a string Stripe never validated. So no `Stripe-Account` header
 * is sent, and each account's own key must be registered under its own
 * `instanceId`. See docs/stripe-api.md#accounts-not-connect
 */
export interface StripeCredentials extends BaseCredentialsData {
  /** A restricted key works here as well as a full secret key. */
  apiKey: string;
  /**
   * `whsec_…`, issued per webhook endpoint in the Stripe dashboard. The HTTP
   * client never uses it; it rides along in the credential payload so a webhook
   * receiver can find the right secret for the account that sent the event.
   */
  webhookSecret: string;
  /**
   * `pk_…`. Public by design, so it is safe to return to a browser alongside a
   * SetupIntent. Optional only so credentials registered before it existed keep
   * loading.
   */
  publishableKey?: string;
}

declare module "@dianemo/core" {
  interface ClientTemplates {
    stripe: StripeCredentials;
  }
}

/**
 * Pinned, because without the header the wire version is whatever the account's
 * dashboard says and moves under us. `2022-11-15` is the version `requests/types.ts`
 * describes, so bump the two together and never this alone — the current Stripe
 * release is four major versions ahead. See
 * docs/stripe-api.md#the-stripe-version-pin-and-why-it-is-2022-11-15
 */
export const STRIPE_API_VERSION = "2022-11-15";

// Written only by the template builder below, so a webhook receiver or a frontend
// handoff can resolve a secret without a round-trip to the credential source.
const webhookSecretCache = new Map<string, string>();
const publishableKeyCache = new Map<string, string>();

function cacheKey(
  organizationId: string | null | undefined,
  stripeAccountId: string
): string {
  return `${organizationId ?? "_"}:${stripeAccountId}`;
}

export function getStripeWebhookSecret(
  organizationId: string | null,
  stripeAccountId: string
): string | undefined {
  return webhookSecretCache.get(cacheKey(organizationId, stripeAccountId));
}

export function getStripePublishableKey(
  organizationId: string | null,
  stripeAccountId: string
): string | undefined {
  return publishableKeyCache.get(cacheKey(organizationId, stripeAccountId));
}

/**
 * Nothing evicts these caches on its own, so an offboarded account's *revoked*
 * signing secret would keep verifying inbound webhooks for the life of the
 * process. Call this when the account goes away, alongside
 * `handler.removeTemplateClient("stripe", stripeAccountId)` — and on every replica,
 * since each holds its own copy.
 */
export function clearStripeCredentialCache(
  organizationId: string | null,
  stripeAccountId: string
): void {
  const key = cacheKey(organizationId, stripeAccountId);
  webhookSecretCache.delete(key);
  publishableKeyCache.delete(key);
}

export function clearAllStripeCredentialCaches(): void {
  webhookSecretCache.clear();
  publishableKeyCache.clear();
}

export async function registerStripeTemplate(handler: RequestHandler) {
  await handler.registerClientTemplate(
    "stripe",
    (creds): CreateClientData[] => {
      // Side-effecting on purpose: the only hook that sees the decrypted blob.
      webhookSecretCache.set(
        cacheKey(creds.organizationId ?? null, creds.instanceId),
        creds.webhookSecret
      );
      // Rotation re-runs the builder, so a credential that no longer carries a
      // publishable key has to clear the previous one rather than leave it standing.
      if (creds.publishableKey) {
        publishableKeyCache.set(
          cacheKey(creds.organizationId ?? null, creds.instanceId),
          creds.publishableKey
        );
      } else {
        publishableKeyCache.delete(
          cacheKey(creds.organizationId ?? null, creds.instanceId)
        );
      }
      return [
        {
          name: buildClientName("stripe", creds),
          // One bucket, not per-subsystem ones: docs/stripe-api.md#rate-limits
          rateLimit: [
            {
              type: "requestLimit",
              interval: 1000,
              tokensToAdd: 100,
              maxTokens: 100,
            },
          ],
          // A card decline is an expected outcome, not an audit-log line. 404 is
          // deliberately *not* muted — a mis-routed id has to surface.
          httpStatusCodesToMute: [402],
          authentication: {
            type: "token",
            token: creds.apiKey,
            customPrefix: "Bearer",
          },
          requestOptions: {
            defaults: {
              baseURL: creds.baseUrl,
              headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                Accept: "application/json",
                "Stripe-Version": STRIPE_API_VERSION,
              },
            },
          },
        },
      ];
    }
  );
}
