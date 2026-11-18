import { serviceAccountCreds } from "./support/serviceAccountServer.js";
import { afterEach, describe, expect, it, vi } from "vitest";
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
const SHEETS = `${CLIENT}:sheetsRead`;

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

const failWith = (status: number, googleStatus: string) => {
  const { spy, requests } = setup();
  const error = new AxiosError("failed");
  error.response = {
    status,
    statusText: "x",
    headers: {},
    config: {} as never,
    data: { error: { code: status, message: "m", status: googleStatus } },
  };
  spy.mockRejectedValue(error);
  return requests;
};

const first = (spy: ReturnType<typeof setup>["spy"]) => spy.mock.calls[0][0];

describe("getSpreadsheet", () => {
  it("calls GET /v4/spreadsheets/{id} on sheetsRead with the params", async () => {
    const { spy, requests } = setup();
    const res = await requests.getSpreadsheet(CLIENT, "abc", {
      includeGridData: true,
      excludeTablesInBandedRanges: false,
      fields: "sheets.properties",
    });
    const c = first(spy);
    expect(res).toEqual({ ok: true });
    expect(c.clientName).toBe(SHEETS);
    expect(c.requestName).toBe("google.sheets.getSpreadsheet");
    expect(c.method).toBe("GET");
    expect(c.url).toBe("/v4/spreadsheets/abc");
    expect(c.params).toEqual({
      includeGridData: true,
      excludeTablesInBandedRanges: false,
      fields: "sheets.properties",
    });
  });

  it("sends ranges as a repeated param", async () => {
    const { spy, requests } = setup();
    await requests.getSpreadsheet(CLIENT, "abc", { ranges: ["A1:B2", "C3"] });
    const c = first(spy);
    expect(c.params).toEqual({ ranges: ["A1:B2", "C3"] });
    expect(c.paramsSerializer).toBeDefined();
    const serialized = (c.paramsSerializer as (p: unknown) => string)(c.params);
    expect(serialized).toBe("ranges=A1%3AB2&ranges=C3");
  });

  it("encodes the spreadsheet id into the path", async () => {
    const { spy, requests } = setup();
    await requests.getSpreadsheet(CLIENT, "a/b c");
    expect(first(spy).url).toBe("/v4/spreadsheets/a%2Fb%20c");
  });
});

describe("getSpreadsheetByDataFilter", () => {
  it("calls POST /v4/spreadsheets/{id}:getByDataFilter on sheetsRead with the body", async () => {
    const { spy, requests } = setup();
    const body = { dataFilters: [{ a1Range: "Sheet1!A1:B2" }] };
    await requests.getSpreadsheetByDataFilter(CLIENT, "abc", body, {
      fields: "sheets",
    });
    const c = first(spy);
    expect(c.clientName).toBe(SHEETS);
    expect(c.requestName).toBe("google.sheets.getSpreadsheetByDataFilter");
    expect(c.method).toBe("POST");
    expect(c.url).toBe("/v4/spreadsheets/abc:getByDataFilter");
    expect(c.params).toEqual({ fields: "sheets" });
    expect(c.data).toEqual(body);
  });
});

describe("getValues", () => {
  it("calls GET /v4/spreadsheets/{id}/values/{range} on sheetsRead with the params", async () => {
    const { spy, requests } = setup();
    await requests.getValues(CLIENT, "abc", "Sheet1!A1:C10", {
      majorDimension: "COLUMNS",
      valueRenderOption: "UNFORMATTED_VALUE",
      dateTimeRenderOption: "SERIAL_NUMBER",
      fields: "values",
    });
    const c = first(spy);
    expect(c.clientName).toBe(SHEETS);
    expect(c.requestName).toBe("google.sheets.getValues");
    expect(c.method).toBe("GET");
    expect(c.url).toBe("/v4/spreadsheets/abc/values/Sheet1!A1%3AC10");
    expect(c.params).toEqual({
      majorDimension: "COLUMNS",
      valueRenderOption: "UNFORMATTED_VALUE",
      dateTimeRenderOption: "SERIAL_NUMBER",
      fields: "values",
    });
  });

  it("encodes ids and A1 ranges ('Q1 Budget'!A1:C10) into the path", async () => {
    const { spy, requests } = setup();
    await requests.getValues(CLIENT, "id/1", "'Q1 Budget'!A1:C10");
    expect(first(spy).url).toBe(
      "/v4/spreadsheets/id%2F1/values/'Q1%20Budget'!A1%3AC10"
    );
  });
});

describe("batchGetValues", () => {
  it("calls GET /v4/spreadsheets/{id}/values:batchGet on sheetsRead with ranges repeated", async () => {
    const { spy, requests } = setup();
    await requests.batchGetValues(CLIENT, "abc", {
      ranges: ["A1:B2", "'Q1 Budget'!C1"],
      majorDimension: "ROWS",
      fields: "valueRanges",
    });
    const c = first(spy);
    expect(c.clientName).toBe(SHEETS);
    expect(c.requestName).toBe("google.sheets.batchGetValues");
    expect(c.method).toBe("GET");
    expect(c.url).toBe("/v4/spreadsheets/abc/values:batchGet");
    expect(c.params).toEqual({
      ranges: ["A1:B2", "'Q1 Budget'!C1"],
      majorDimension: "ROWS",
      fields: "valueRanges",
    });
    expect((c.paramsSerializer as (p: unknown) => string)(c.params)).toBe(
      "ranges=A1%3AB2&ranges=%27Q1+Budget%27%21C1&majorDimension=ROWS&fields=valueRanges"
    );
  });
});

describe("batchGetValuesByDataFilter", () => {
  it("calls POST /v4/spreadsheets/{id}/values:batchGetByDataFilter on sheetsRead with the body", async () => {
    const { spy, requests } = setup();
    const body = { dataFilters: [{ a1Range: "A1" }] };
    await requests.batchGetValuesByDataFilter(CLIENT, "abc", body);
    const c = first(spy);
    expect(c.clientName).toBe(SHEETS);
    expect(c.requestName).toBe("google.sheets.batchGetValuesByDataFilter");
    expect(c.method).toBe("POST");
    expect(c.url).toBe("/v4/spreadsheets/abc/values:batchGetByDataFilter");
    expect(c.data).toEqual(body);
  });
});

describe("getDeveloperMetadata", () => {
  it("calls GET /v4/spreadsheets/{id}/developerMetadata/{metadataId} on sheetsRead", async () => {
    const { spy, requests } = setup();
    await requests.getDeveloperMetadata(CLIENT, "abc", 42);
    const c = first(spy);
    expect(c.clientName).toBe(SHEETS);
    expect(c.requestName).toBe("google.sheets.getDeveloperMetadata");
    expect(c.method).toBe("GET");
    expect(c.url).toBe("/v4/spreadsheets/abc/developerMetadata/42");
  });
});

describe("searchDeveloperMetadata", () => {
  it("calls POST /v4/spreadsheets/{id}/developerMetadata:search on sheetsRead with the body", async () => {
    const { spy, requests } = setup();
    const body = { dataFilters: [{ developerMetadataLookup: {} }] };
    await requests.searchDeveloperMetadata(CLIENT, "abc", body);
    const c = first(spy);
    expect(c.clientName).toBe(SHEETS);
    expect(c.requestName).toBe("google.sheets.searchDeveloperMetadata");
    expect(c.method).toBe("POST");
    expect(c.url).toBe("/v4/spreadsheets/abc/developerMetadata:search");
    expect(c.data).toEqual(body);
  });
});

describe("Sheets errors", () => {
  const cases: [number, string, string][] = [
    [403, "PERMISSION_DENIED", "GGL_0009"],
    [404, "NOT_FOUND", "GGL_0009"],
    [400, "INVALID_ARGUMENT", "GGL_0010"],
    [429, "RESOURCE_EXHAUSTED", "GGL_0011"],
    [500, "INTERNAL", "GGL_0012"],
  ];
  it.each(cases)(
    "maps HTTP %i (%s) to %s, keeping both",
    async (status, googleStatus, code) => {
      const requests = failWith(status, googleStatus);
      const err = (await requests
        .getSpreadsheet(CLIENT, "abc")
        .catch((e: unknown) => e)) as RequestError;
      expect(err).toBeInstanceOf(RequestError);
      expect(err.code).toBe(code);
      expect(err.statusCode).toBe(status);
      expect(err.metadata?.googleStatus).toBe(googleStatus);
      expect(err.metadata?.status).toBe(status);
    }
  );

  it("maps a failure with no response (network) to GGL_0012", async () => {
    const { spy, requests } = setup();
    spy.mockRejectedValue(new Error("socket hang up"));
    const err = (await requests
      .getValues(CLIENT, "abc", "A1")
      .catch((e: unknown) => e)) as RequestError;
    expect(err.code).toBe("GGL_0012");
    expect(err.metadata?.status).toBeUndefined();
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

  it("repeats ranges in the query string and maps a real 404 to GGL_0009", async () => {
    const seen: string[] = [];
    server = createServer((req, res) => {
      if (req.url === "/token") {
        res.setHeader("content-type", "application/json");
        res.end(JSON.stringify({ access_token: "sa-token", expires_in: 3600 }));
        return;
      }
      seen.push(req.url ?? "");
      res.setHeader("content-type", "application/json");
      if (req.url?.startsWith("/v4/spreadsheets/missing")) {
        res.statusCode = 404;
        res.end(JSON.stringify({ error: { code: 404, status: "NOT_FOUND" } }));
        return;
      }
      res.end(JSON.stringify({ spreadsheetId: "abc" }));
    });
    await new Promise<void>((r) => server?.listen(0, "127.0.0.1", r));
    const sheetsBaseUrl = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
    handler = new RequestHandler({ key: TEST_KEY, backend: memoryBackend() });
    const { google: requests } = handler.use(google);
    const creds = {
      ...serviceAccountCreds(sheetsBaseUrl, "main"),
    };
    await handler.addTemplateClient("google", creds);
    const client = buildClientName("google", creds);

    await requests.getSpreadsheet(client, "abc", {
      ranges: ["A1:B2", "'Q1 Budget'!C1"],
      includeGridData: true,
    });
    expect(seen[0]).toBe(
      "/v4/spreadsheets/abc?ranges=A1%3AB2&ranges=%27Q1+Budget%27%21C1&includeGridData=true"
    );

    const err = (await requests
      .getSpreadsheet(client, "missing")
      .catch((e: unknown) => e)) as RequestError;
    expect(err.code).toBe("GGL_0009");
    expect(err.statusCode).toBe(404);
    expect(err.metadata?.googleStatus).toBe("NOT_FOUND");
  });
});
