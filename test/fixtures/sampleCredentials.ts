/**
 * Minimal credentials each plugin's template builder accepts, keyed by package
 * directory. Dummy values: none reach a network. Shared by the catalogue test,
 * which builds a client from them, and by the auth test.
 */
const base = {
  instanceId: "smoke",
  organizationId: null,
  baseUrl: "https://example.invalid",
};
const oauth = { ...base, clientId: "id", clientSecret: "secret" };
const token = { ...base, token: "tok" };

export const sampleCredentials: Record<string, Record<string, unknown>> = {
  "plugin-amazon-spapi": oauth,
  "plugin-channel-advisor": oauth,
  "plugin-ebay": {
    ...oauth,
    scopeList: "https://api.ebay.com/oauth/api_scope",
  },
  "plugin-extensiv": { ...oauth, userLogin: "user" },
  "plugin-fedex": oauth,
  "plugin-google": oauth,
  "plugin-google-vertex-ai": oauth,
  "plugin-helpscout": oauth,
  "plugin-labelary": base,
  "plugin-mainfreight": token,
  "plugin-newegg": { ...token, secretKey: "s", sellerId: "A1" },
  "plugin-open-exchange-rates": token,
  "plugin-printnode": token,
  "plugin-shopify": token,
  "plugin-smarty": { ...base, authId: "id", authToken: "tok" },
  "plugin-stripe": { ...base, apiKey: "sk_test", webhookSecret: "whsec" },
  "plugin-unis": {
    ...base,
    username: "u",
    password: "p",
    companyId: "c",
    customerId: "cu",
  },
  "plugin-ups": oauth,
  "plugin-usps": { ...oauth, crid: "1", mid: "2" },
  "plugin-walmart": { ...oauth, partnerId: "p" },
  "plugin-wayfair": oauth,
};
