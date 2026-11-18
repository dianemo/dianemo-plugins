import type { BatchUpdateSpreadsheetRequest } from "../src/requests/sheets/schemas.js";
import { afterEach, describe, expect, expectTypeOf, it, vi } from "vitest";
import { resetBinding } from "@dianemo/plugin-kit/testing";
import { TEST_KEY } from "../../../test/fixtures/key.js";
import { createServer, type Server } from "node:http";
import type { AddressInfo } from "node:net";
import google from "../src/index.js";
import { AxiosError } from "axios";
import RequestHandler, {
  buildClientName,
  memoryBackend,
  RequestError,
} from "@dianemo/core";

afterEach(() => resetBinding());

const CLIENT = "google:_:main";
const SHEETS = `${CLIENT}:sheetsWrite`;

const setup = () => {
  const handler = new RequestHandler({
    key: TEST_KEY,
    backend: memoryBackend(),
  });
  const spy = vi
    .spyOn(handler, "handleRequest")
    .mockResolvedValue({ data: { ok: true } } as never);
  const { google: requests } = handler.use(google);
  return { spy, requests };
};

const first = (spy: ReturnType<typeof setup>["spy"]) => spy.mock.calls[0][0];

const failWith = (status: number, body: unknown) => {
  const { spy, requests } = setup();
  const error = new AxiosError("failed");
  error.response = {
    status,
    statusText: "x",
    headers: {},
    config: {} as never,
    data: body,
  };
  spy.mockRejectedValue(error);
  return requests;
};

describe("Sheets write calls", () => {
  it("createSpreadsheet calls POST /v4/spreadsheets on sheetsWrite", async () => {
    const { spy, requests } = setup();
    const body = { properties: { title: "T" } };
    const res = await requests.createSpreadsheet(CLIENT, body, {
      fields: "spreadsheetId",
    });
    const c = first(spy);
    expect(res).toEqual({ ok: true });
    expect(c.clientName).toBe(SHEETS);
    expect(c.requestName).toBe("google.sheets.createSpreadsheet");
    expect(c.method).toBe("POST");
    expect(c.url).toBe("/v4/spreadsheets");
    expect(c.params).toEqual({ fields: "spreadsheetId" });
    expect(c.data).toEqual(body);
  });

  it("batchUpdateSpreadsheet calls POST /v4/spreadsheets/{id}:batchUpdate", async () => {
    const { spy, requests } = setup();
    const body: BatchUpdateSpreadsheetRequest = {
      requests: [
        { addSheet: { properties: { title: "New" } } },
        {
          repeatCell: {
            range: { sheetId: 0 },
            cell: { userEnteredFormat: { wrapStrategy: "WRAP" } },
            fields: "userEnteredFormat.wrapStrategy",
          },
        },
      ],
    };
    await requests.batchUpdateSpreadsheet(CLIENT, "a/b", body);
    const c = first(spy);
    expect(c.clientName).toBe(SHEETS);
    expect(c.requestName).toBe("google.sheets.batchUpdateSpreadsheet");
    expect(c.method).toBe("POST");
    expect(c.url).toBe("/v4/spreadsheets/a%2Fb:batchUpdate");
    expect(c.data).toEqual(body);
  });

  it("updateValues calls PUT /values/{range} with the params and body", async () => {
    const { spy, requests } = setup();
    const body = { values: [["a", 1]] };
    await requests.updateValues(CLIENT, "abc", "Sheet 1!A1:B1", body, {
      valueInputOption: "USER_ENTERED",
      includeValuesInResponse: true,
      responseValueRenderOption: "FORMULA",
      responseDateTimeRenderOption: "FORMATTED_STRING",
    });
    const c = first(spy);
    expect(c.clientName).toBe(SHEETS);
    expect(c.requestName).toBe("google.sheets.updateValues");
    expect(c.method).toBe("PUT");
    expect(c.url).toBe("/v4/spreadsheets/abc/values/Sheet%201!A1%3AB1");
    expect(c.params).toEqual({
      valueInputOption: "USER_ENTERED",
      includeValuesInResponse: true,
      responseValueRenderOption: "FORMULA",
      responseDateTimeRenderOption: "FORMATTED_STRING",
    });
    expect(c.data).toEqual(body);
  });

  it("appendValues calls POST /values/{range}:append with the params and body", async () => {
    const { spy, requests } = setup();
    const body = { values: [["x"]] };
    await requests.appendValues(CLIENT, "abc", "A1", body, {
      valueInputOption: "RAW",
      insertDataOption: "INSERT_ROWS",
    });
    const c = first(spy);
    expect(c.clientName).toBe(SHEETS);
    expect(c.requestName).toBe("google.sheets.appendValues");
    expect(c.method).toBe("POST");
    expect(c.url).toBe("/v4/spreadsheets/abc/values/A1:append");
    expect(c.params).toEqual({
      valueInputOption: "RAW",
      insertDataOption: "INSERT_ROWS",
    });
    expect(c.data).toEqual(body);
  });

  it("batchUpdateValues calls POST /values:batchUpdate", async () => {
    const { spy, requests } = setup();
    const body = {
      valueInputOption: "RAW" as const,
      data: [{ range: "A1", values: [[1]] }],
    };
    await requests.batchUpdateValues(CLIENT, "abc", body);
    const c = first(spy);
    expect(c.clientName).toBe(SHEETS);
    expect(c.requestName).toBe("google.sheets.batchUpdateValues");
    expect(c.method).toBe("POST");
    expect(c.url).toBe("/v4/spreadsheets/abc/values:batchUpdate");
    expect(c.data).toEqual(body);
  });

  it("batchUpdateValuesByDataFilter calls POST /values:batchUpdateByDataFilter", async () => {
    const { spy, requests } = setup();
    const body = {
      valueInputOption: "RAW" as const,
      data: [{ dataFilter: { a1Range: "A1" }, values: [[1]] }],
    };
    await requests.batchUpdateValuesByDataFilter(CLIENT, "abc", body);
    const c = first(spy);
    expect(c.clientName).toBe(SHEETS);
    expect(c.requestName).toBe("google.sheets.batchUpdateValuesByDataFilter");
    expect(c.method).toBe("POST");
    expect(c.url).toBe("/v4/spreadsheets/abc/values:batchUpdateByDataFilter");
    expect(c.data).toEqual(body);
  });

  it("clearValues calls POST /values/{range}:clear with an empty body", async () => {
    const { spy, requests } = setup();
    await requests.clearValues(CLIENT, "abc", "Sheet1!A:B");
    const c = first(spy);
    expect(c.clientName).toBe(SHEETS);
    expect(c.requestName).toBe("google.sheets.clearValues");
    expect(c.method).toBe("POST");
    expect(c.url).toBe("/v4/spreadsheets/abc/values/Sheet1!A%3AB:clear");
    expect(c.data).toEqual({});
  });

  it("batchClearValues calls POST /values:batchClear", async () => {
    const { spy, requests } = setup();
    const body = { ranges: ["A1", "B2"] };
    await requests.batchClearValues(CLIENT, "abc", body);
    const c = first(spy);
    expect(c.clientName).toBe(SHEETS);
    expect(c.requestName).toBe("google.sheets.batchClearValues");
    expect(c.method).toBe("POST");
    expect(c.url).toBe("/v4/spreadsheets/abc/values:batchClear");
    expect(c.data).toEqual(body);
  });

  it("batchClearValuesByDataFilter calls POST /values:batchClearByDataFilter", async () => {
    const { spy, requests } = setup();
    const body = { dataFilters: [{ a1Range: "A1" }] };
    await requests.batchClearValuesByDataFilter(CLIENT, "abc", body);
    const c = first(spy);
    expect(c.clientName).toBe(SHEETS);
    expect(c.requestName).toBe("google.sheets.batchClearValuesByDataFilter");
    expect(c.method).toBe("POST");
    expect(c.url).toBe("/v4/spreadsheets/abc/values:batchClearByDataFilter");
    expect(c.data).toEqual(body);
  });

  it("copySheetTo calls POST /sheets/{sheetId}:copyTo", async () => {
    const { spy, requests } = setup();
    const body = { destinationSpreadsheetId: "dest" };
    await requests.copySheetTo(CLIENT, "abc", 7, body);
    const c = first(spy);
    expect(c.clientName).toBe(SHEETS);
    expect(c.requestName).toBe("google.sheets.copySheetTo");
    expect(c.method).toBe("POST");
    expect(c.url).toBe("/v4/spreadsheets/abc/sheets/7:copyTo");
    expect(c.data).toEqual(body);
  });
});

describe("write types", () => {
  it("updateValues requires valueInputOption", () => {
    const { requests } = setup();
    // @ts-expect-error valueInputOption is required
    void requests.updateValues(CLIENT, "abc", "A1", {}, {});
    expectTypeOf(requests.updateValues)
      .parameter(4)
      .toHaveProperty("valueInputOption")
      .toEqualTypeOf<"RAW" | "USER_ENTERED">();
    expectTypeOf(requests.appendValues)
      .parameter(4)
      .toHaveProperty("insertDataOption")
      .toEqualTypeOf<"OVERWRITE" | "INSERT_ROWS" | undefined>();
  });
});

describe("Sheets write errors", () => {
  const status = (googleStatus: string) => ({
    error: { code: 0, message: "m", status: googleStatus },
  });
  const cases: [string, number, unknown, string][] = [
    ["no access", 403, status("PERMISSION_DENIED"), "GGL_0009"],
    ["a 403 with no body", 403, undefined, "GGL_0009"],
    ["a 403 with a non-object error", 403, { error: "x" }, "GGL_0009"],
    ["not found", 404, status("NOT_FOUND"), "GGL_0009"],
    ["invalid", 400, status("INVALID_ARGUMENT"), "GGL_0010"],
    ["quota", 429, status("RESOURCE_EXHAUSTED"), "GGL_0011"],
    ["server", 500, status("INTERNAL"), "GGL_0012"],
    [
      "403 rateLimitExceeded (errors[])",
      403,
      {
        error: {
          status: "PERMISSION_DENIED",
          errors: [{ reason: "rateLimitExceeded" }],
        },
      },
      "GGL_0011",
    ],
    [
      "403 userRateLimitExceeded (errors[])",
      403,
      { error: { errors: [{ reason: "userRateLimitExceeded" }] } },
      "GGL_0011",
    ],
    [
      "403 RATE_LIMIT_EXCEEDED (details[])",
      403,
      { error: { details: [{ reason: "RATE_LIMIT_EXCEEDED" }] } },
      "GGL_0011",
    ],
    [
      "403 SERVICE_DISABLED (details[])",
      403,
      {
        error: {
          status: "PERMISSION_DENIED",
          details: [{ "@type": "x", reason: "SERVICE_DISABLED" }],
        },
      },
      "GGL_0012",
    ],
    [
      "403 accessNotConfigured (errors[])",
      403,
      { error: { errors: [{ reason: "accessNotConfigured" }] } },
      "GGL_0012",
    ],
    [
      "a 403 whose details lack a reason",
      403,
      { error: { details: [null, {}, { reason: 5 }] } },
      "GGL_0009",
    ],
  ];

  it.each(cases)("maps %s (HTTP %i) to %s", async (_n, code, body, mapped) => {
    const requests = failWith(code, body);
    const err = (await requests
      .appendValues(CLIENT, "abc", "A1", {}, { valueInputOption: "RAW" })
      .catch((e: unknown) => e)) as RequestError;
    expect(err).toBeInstanceOf(RequestError);
    expect(err.code).toBe(mapped);
    expect(err.statusCode).toBe(code);
    expect(err.metadata?.status).toBe(code);
  });

  it("keeps Google's error.status in metadata", async () => {
    const requests = failWith(403, status("PERMISSION_DENIED"));
    const err = (await requests
      .clearValues(CLIENT, "abc", "A1")
      .catch((e: unknown) => e)) as RequestError;
    expect(err.metadata?.googleStatus).toBe("PERMISSION_DENIED");
  });
});

describe("over the wire", () => {
  let server: Server | undefined;
  let handler: RequestHandler | undefined;

  afterEach(async () => {
    await handler?.stop();
    handler = undefined;
    await new Promise((r) => (server ? server.close(r) : r(undefined)));
    server = undefined;
  });

  const start = async (onRequest: Parameters<typeof createServer>[1]) => {
    server = createServer(onRequest);
    await new Promise<void>((r) => server?.listen(0, "127.0.0.1", r));
    const sheetsBaseUrl = `http://127.0.0.1:${(server?.address() as AddressInfo).port}`;
    handler = new RequestHandler({ key: TEST_KEY, backend: memoryBackend() });
    const { google: requests } = handler.use(google);
    const creds = {
      instanceId: "main",
      baseUrl: sheetsBaseUrl,
      apiKey: "k",
      sheetsBaseUrl,
    };
    await handler.addTemplateClient("google", creds);
    return { requests, client: buildClientName("google", creds) };
  };

  it("sends an append once and does not retry a 500", async () => {
    let hits = 0;
    const { requests, client } = await start((req, res) => {
      hits++;
      res.statusCode = 500;
      res.setHeader("content-type", "application/json");
      res.end(JSON.stringify({ error: { code: 500, status: "INTERNAL" } }));
    });
    const err = (await requests
      .appendValues(
        client,
        "abc",
        "A1",
        { values: [[1]] },
        {
          valueInputOption: "RAW",
        }
      )
      .catch((e: unknown) => e)) as RequestError;
    expect(err.code).toBe("GGL_0012");
    expect(err.statusCode).toBe(500);
    expect(hits).toBe(1);
  });

  it("does not retry a dropped connection", async () => {
    let hits = 0;
    const { requests, client } = await start((req) => {
      hits++;
      req.socket.destroy();
    });
    const err = (await requests
      .clearValues(client, "abc", "A1")
      .catch((e: unknown) => e)) as RequestError;
    expect(err).toBeInstanceOf(RequestError);
    expect(hits).toBe(1);
  });

  it("still retries a read after a 500", async () => {
    let hits = 0;
    const { requests, client } = await start((req, res) => {
      hits++;
      res.setHeader("content-type", "application/json");
      if (hits === 1) {
        res.statusCode = 500;
        res.end("{}");
        return;
      }
      res.end(JSON.stringify({ spreadsheetId: "abc" }));
    });
    const res = await requests.getSpreadsheet(client, "abc");
    expect(res).toEqual({ spreadsheetId: "abc" });
    expect(hits).toBe(2);
  });
});
