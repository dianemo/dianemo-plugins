import { getProtectedDeliveryEpraCode } from "../src/requests/protectedDeliveryToken/index.js";
import { getDeliveryDefenseAddressScore } from "../src/requests/deliveryDefense/index.js";
import { createGuaranteedQuote } from "../src/requests/guaranteedQuote/index.js";
import { createServer, type IncomingHttpHeaders, type Server } from "node:http";
import { getForwardingDocuments } from "../src/requests/forwarding/index.js";
import { resetBinding } from "@dianemo/plugin-kit/testing";
import { TEST_KEY } from "../../../test/fixtures/key.js";
import { afterEach, describe, expect, it } from "vitest";
import { tryHandleRequest } from "@dianemo/plugin-kit";
import type { AddressInfo } from "node:net";
import ups from "../src/index.js";
import RequestHandler, {
  RequestError,
  getOriginalResponseData,
  getOriginalStatus,
  memoryBackend,
} from "@dianemo/core";

/**
 * The other UPS tests mock `handleRequest`, so they cannot see what core or axios
 * do before or after it. These run the request functions through a real
 * `RequestHandler` and a local server — see docs/ups-api.md#what-the-tests-can-see
 */

const CLIENT = "ups:_:wire";
const h = { businessGuid: "0123456789abcdef0123456789abcdef", clientId: "c1" };
const docParams = {
  ...h,
  shipmentNumber: "S1",
  shipmentAccountNumber: "123456789",
  shipmentType: "Air" as const,
  docType: "All" as const,
};

interface Reply {
  status?: number;
  type?: string;
  body?: Buffer | string;
}

interface Seen {
  url?: string;
  headers: IncomingHttpHeaders;
}

let server: Server | undefined;
let handler: RequestHandler | undefined;

afterEach(async () => {
  resetBinding();
  await handler?.stop();
  handler = undefined;
  await new Promise((r) => (server ? server.close(r) : r(undefined)));
  server = undefined;
});

/** Serves the token endpoint itself and `reply` for everything else. */
async function boot(reply: (req: Seen) => Reply) {
  const seen: Seen[] = [];
  server = createServer((req, res) => {
    req.resume();
    req.on("end", () => {
      let out: Reply;
      if (req.url === "/security/v1/oauth/token") {
        out = {
          type: "application/json",
          body: JSON.stringify({ access_token: "tok", expires_in: 3600 }),
        };
      } else {
        const entry = { url: req.url, headers: req.headers };
        seen.push(entry);
        out = reply(entry);
      }
      res.statusCode = out.status ?? 200;
      if (out.type) res.setHeader("content-type", out.type);
      res.end(out.body);
    });
  });
  await new Promise<void>((r) => server?.listen(0, "127.0.0.1", r));
  const baseUrl = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
  handler = new RequestHandler({ key: TEST_KEY, backend: memoryBackend() });
  handler.use(ups);
  await handler.addTemplateClient("ups", {
    instanceId: "wire",
    clientId: "id",
    clientSecret: "secret",
    baseUrl,
  });
  return seen;
}

// Bytes that are not valid UTF-8, so a text round trip would change them.
const PDF = Buffer.concat([
  Buffer.from("%PDF-1.4\n"),
  Buffer.from([0xff, 0xfe, 0x00, 0x80, 0xc3, 0x28]),
]);

describe("ups forwarding documents over the wire", () => {
  it("returns a raw application/pdf body byte for byte", async () => {
    const seen = await boot(() => ({ type: "application/pdf", body: PDF }));
    const out = await getForwardingDocuments(CLIENT, docParams);
    expect(Buffer.isBuffer(out)).toBe(true);
    expect(out.equals(PDF)).toBe(true);
    expect(seen[0].url).toContain("/api/forwarding/v1/documents?");
    expect(seen[0].headers.authorization).toBe("Bearer tok");
    // The spec marks Content-Type required on a GET, and an explicit one survives
    expect(seen[0].headers["content-type"]).toBe("application/json");
  });

  it("decodes the example's JSON wrapper to the same bytes", async () => {
    await boot(() => ({
      type: "application/json",
      body: JSON.stringify({
        response: {
          fileName: "labels.pdf",
          pdfFile: PDF.toString("base64"),
          code: "0",
          isValid: true,
        },
      }),
    }));
    const out = await getForwardingDocuments(CLIENT, docParams);
    expect(out.equals(PDF)).toBe(true);
  });

  it("fails with UPS_0130 when the body is neither", async () => {
    await boot(() => ({
      type: "application/json",
      body: JSON.stringify({ response: { fileName: "x.pdf" } }),
    }));
    const err = await getForwardingDocuments(CLIENT, docParams).catch(
      (e: unknown) => e
    );
    expect(err).toBeInstanceOf(RequestError);
    expect((err as RequestError).code).toBe("UPS_0130");
  });

  it("carries UPS's JSON error out of a 400 instead of a Buffer placeholder", async () => {
    await boot(() => ({
      status: 400,
      type: "application/json",
      body: JSON.stringify({
        response: {
          errors: [{ code: "120001", message: "Shipment number is not valid" }],
        },
      }),
    }));
    const err = await getForwardingDocuments(CLIENT, docParams).catch(
      (e: unknown) => e
    );
    expect(err).toBeInstanceOf(RequestError);
    expect((err as RequestError).code).toBe("UPS_0122");
    expect(getOriginalStatus(err)).toBe(400);
    const data = getOriginalResponseData(err) as {
      response: { errors: { message: string }[] };
    };
    expect(data.response.errors[0].message).toBe(
      "Shipment number is not valid"
    );
  });

  it("keeps a non-JSON error body as text", async () => {
    await boot(() => ({ status: 404, type: "text/plain", body: "not found" }));
    const err = await getForwardingDocuments(CLIENT, docParams).catch(
      (e: unknown) => e
    );
    expect(getOriginalResponseData(err)).toBe("not found");
  });
});

describe("ups EPRA authorization over the wire", () => {
  it("sends the client's bearer token, with no Authorization of the caller's to lose", async () => {
    const seen = await boot(() => ({
      type: "application/json",
      body: JSON.stringify({}),
    }));
    await getProtectedDeliveryEpraCode(CLIENT, {
      trackingNumber: "1Z999AA10123456784",
      epra: "E1",
    });
    expect(seen[0].headers.authorization).toBe("Bearer tok");
    expect(seen[0].headers.trackingnumber).toBe("1Z999AA10123456784");
    expect(seen[0].headers.epra).toBe("E1");
    // A body-less GET with no Content-Type of its own goes out without one
    expect(seen[0].headers["content-type"]).toBeUndefined();
  });

  it("discards an Authorization header set on the request itself", async () => {
    const seen = await boot(() => ({
      type: "application/json",
      body: JSON.stringify({}),
    }));
    await tryHandleRequest(
      {
        clientName: CLIENT,
        requestName: "ups.test.overwrite",
        method: "GET",
        url: "/anything",
        headers: { Authorization: "Bearer the-callers" },
      },
      "UPS_9999",
      "unused"
    );
    expect(seen[0].headers.authorization).toBe("Bearer tok");
  });
});

describe("ups other behaviours over the wire", () => {
  it("returns undefined for the Delivery Defense 204", async () => {
    await boot(() => ({ status: 204 }));
    const out = await getDeliveryDefenseAddressScore(CLIENT, {
      addressLine1: "1 Main St",
      city: "Atlanta",
      state: "GA",
      zipCode: "30068",
    } as never);
    expect(out).toBeUndefined();
  });

  it("sends exactly Accept: application/json on the guaranteed quote", async () => {
    const seen = await boot(() => ({
      type: "application/json",
      body: JSON.stringify({}),
    }));
    await createGuaranteedQuote(CLIENT, {} as never);
    expect(seen[0].headers.accept).toBe("application/json");
  });
});
