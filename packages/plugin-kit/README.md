# @dianemo/plugin-kit

Shared toolkit for dianemo plugins — handler binding and cross-integration value types

Every dianemo plugin depends on this package. You do not normally install it directly — it comes in
with whichever plugins you use.

```bash
npm install @dianemo/plugin-kit
```

## Writing a plugin

```ts
import RequestHandler, { buildClientName, definePlugin } from "@dianemo/core";
import { CreateClientData, TokenCredentials } from "@dianemo/core/client/types";
import { bindTryHandleRequest, tryHandleRequest } from "@dianemo/plugin-kit";

// Adds the credential shape to the handler's template map, so
// addTemplateClient("acme", …) is checked against it.
declare module "@dianemo/core" {
  interface ClientTemplates {
    acme: TokenCredentials;
  }
}

async function registerAcmeTemplate(handler: RequestHandler) {
  await handler.registerClientTemplate("acme", (creds): CreateClientData[] => [
    {
      name: buildClientName("acme", creds),
      rateLimit: [
        {
          type: "requestLimit",
          interval: 60_000,
          tokensToAdd: 600,
          maxTokens: 600,
        },
      ],
      requestOptions: { defaults: { baseURL: creds.baseUrl } },
      authentication: { type: "token", token: creds.token },
    },
  ]);
}

// Requests take the client name first and nothing about the handler: the
// binding below is process-wide, so signatures stay at (clientName, data).
const getWidget = async (clientName: string, id: string) => {
  const res = await tryHandleRequest<{ id: string }>(
    {
      clientName,
      requestName: "acme.widgets.get",
      method: "GET",
      url: `/widgets/${id}`,
    },
    "ACME_0001",
    "Failed to fetch Acme widget"
  );
  return res.data;
};

export default definePlugin({
  name: "acme",
  registerTemplate: registerAcmeTemplate,
  createRequests: (ctx) => {
    bindTryHandleRequest(ctx);
    return { getWidget };
  },
});
```

It provides the handler binding behind `tryHandleRequest`, `backend()` for plugins that cache state
others reuse, a compare-and-delete lock, and the ISO 4217 currency enum shared by several
integrations.

`backend()` returns whatever backend the host handler was built with, so a plugin never has to know
whether its cache is shared across processes. Under a memory backend it is not, which makes a
caching plugin repeat work per process rather than misbehave.

The ISO 4217 list this package exports is the declared type of required fields in five plugins, so
its accuracy moves money. [`docs/currency-codes.md`](docs/currency-codes.md) records what was wrong
before 1.0.0 and how it is kept right.

See [dianemo-plugins](https://github.com/dianemo/dianemo-plugins) for the full plugin catalogue, and
[dianemo](https://github.com/dianemo/dianemo) for the rate-limiting host itself.

## License

Apache-2.0. See [LICENSE](LICENSE) and [NOTICE](NOTICE).
