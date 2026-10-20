import RequestHandler, { buildClientName } from "@dianemo/core";
import {
  BaseCredentialsData,
  CreateClientData,
} from "@dianemo/core/client/types";

declare module "@dianemo/core" {
  interface ClientTemplates {
    labelary: BaseCredentialsData;
  }
}

export async function registerLabelaryTemplate(handler: RequestHandler) {
  await handler.registerClientTemplate(
    "labelary",
    (creds): CreateClientData[] => [
      {
        name: buildClientName("labelary", creds),
        rateLimit: [
          {
            // Metered on Labelary's per-second limit, not its daily one: 5,000/day
            // sustained is 0.06/s, too slow to be a usable ceiling. Figures here are
            // the free tier — see docs/labelary-api.md#rate-limits-are-published-per-plan-per-second-and-per-day
            type: "requestLimit",
            interval: 1000,
            tokensToAdd: 3,
            maxTokens: 3,
          },
        ],
        requestOptions: { defaults: { baseURL: creds.baseUrl } },
      },
    ]
  );
}
