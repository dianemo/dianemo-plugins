import { WayfairGraphQLData, WayfairGraphQLResponse } from "./types.js";
import { tryHandleRequest } from "@dianemo/plugin-kit";
import { RequestError } from "@dianemo/core";

/**
 * Sends one GraphQL operation and refuses a response carrying `errors`, or a
 * missing `data` with no `errors` — neither is a result, and Wayfair returns
 * both under HTTP 200, so nothing in the transport layer sees the failure. See
 * docs/wayfair-api.md#a-rejected-query-comes-back-as-http-200.
 *
 * When `variables` is absent the member is left out of the body rather than
 * sent as null, so an operation that declares none puts exactly the same bytes
 * on the wire as before variables were supported.
 */
const handleGraphQLRequest = async <T>(
  clientName: string,
  requestName: string,
  code: string,
  message: string,
  query: string,
  variables?: Record<string, unknown>
): Promise<WayfairGraphQLData<T>> => {
  const res = await tryHandleRequest<WayfairGraphQLResponse<T>>(
    {
      clientName,
      requestName,
      method: "POST",
      data: variables ? { query, variables } : { query },
    },
    code,
    message
  );
  const { data, errors } = res.data;
  if (errors?.length || !data) {
    throw new RequestError(code, message, {
      metadata: {
        context:
          errors?.map((e) => e.message).join("; ") ||
          "Wayfair returned neither data nor errors",
        errors,
      },
    });
  }
  return { ...res.data, data };
};

export default handleGraphQLRequest;
