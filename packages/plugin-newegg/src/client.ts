import { CreateClientData, TokenCredentials } from "@dianemo/core/client/types";
import RequestHandler, { buildClientName } from "@dianemo/core";

interface NeweggCredentials extends TokenCredentials {
  secretKey: string;
  sellerId: string;
}

declare module "@dianemo/core" {
  interface ClientTemplates {
    newegg: NeweggCredentials;
    neweggBusiness: NeweggCredentials;
  }
}

const tenThousandPerHourEndpoints = [
  "getItemInventory",
  "updateItemInventory",
  "getItemPricing",
  "updateItemPricing",
  "getFeedStatus",
];

const oneThousandPerHourEndpoints = [
  "getOrders",
  "markOrderDownloaded",
  "shipOrder",
  "getRmaInfo",
];

const tenPerMinuteEndpoints = ["submitFeed"];

/**
 * **Every figure below is this repo's own ceiling, not Newegg's.** Newegg
 * documents that non-datafeed functions are metered per minute and datafeed
 * functions per hour, but publishes no numbers for either — and returns the real
 * per-function limit in `X-RateLimit-Limit` on every response, which is how they
 * could be replaced with vendor-stated ones. The hourly buckets here are also
 * drip-fed rather than burstable, which is safe against a per-minute limit but is
 * not the shape of the limit: docs/newegg-api.md#rate-limits-the-mechanism-is-documented-the-numbers-are-not
 */
const getSubClients = (): CreateClientData[] => {
  const subClients: CreateClientData[] = [];
  for (const endpoint of tenThousandPerHourEndpoints) {
    subClients.push({
      name: endpoint,
      rateLimit: [
        {
          type: "requestLimit",
          interval: 360,
          tokensToAdd: 1,
          maxTokens: 10000,
        },
      ],
    });
  }
  for (const endpoint of oneThousandPerHourEndpoints) {
    subClients.push({
      name: endpoint,
      rateLimit: [
        {
          type: "requestLimit",
          interval: 3600,
          tokensToAdd: 1,
          maxTokens: 1000,
        },
      ],
    });
  }
  for (const endpoint of tenPerMinuteEndpoints) {
    subClients.push({
      name: endpoint,
      rateLimit: [
        {
          type: "requestLimit",
          interval: 6000,
          tokensToAdd: 1,
          maxTokens: 10,
        },
      ],
    });
  }
  return subClients;
};

const buildNeweggClient = (
  name: string,
  creds: NeweggCredentials
): CreateClientData => ({
  name,
  authentication: {
    type: "token",
    excludePrefix: true,
    token: creds.token,
  },
  requestOptions: {
    defaults: {
      baseURL: creds.baseUrl,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        SecretKey: creds.secretKey,
      },
      params: { sellerid: creds.sellerId },
    },
  },
  subClients: getSubClients(),
});

export async function registerNeweggTemplate(handler: RequestHandler) {
  await handler.registerClientTemplate(
    "newegg",
    (creds): CreateClientData[] => [
      buildNeweggClient(buildClientName("newegg", creds), creds),
    ]
  );
}

export async function registerNeweggBusinessTemplate(handler: RequestHandler) {
  await handler.registerClientTemplate(
    "neweggBusiness",
    (creds): CreateClientData[] => [
      buildNeweggClient(buildClientName("neweggBusiness", creds), creds),
    ]
  );
}
