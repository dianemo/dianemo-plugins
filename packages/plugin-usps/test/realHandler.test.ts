import type { UspsContainerCreateRequest } from "../src/requests/containers/types.js";
import type { UspsLabelIndiciaRequest } from "../src/requests/labels/types.js";
import * as containers from "../src/requests/containers/index.js";
import RequestHandler, { memoryBackend } from "@dianemo/core";
import * as pickups from "../src/requests/pickups/index.js";
import { resetBinding } from "@dianemo/plugin-kit/testing";
import * as labels from "../src/requests/labels/index.js";
import { afterEach, describe, expect, it } from "vitest";
import { TEST_KEY } from "../../../test/fixtures/key.js";
import type { AddressInfo } from "node:net";
import usps from "../src/index.js";
import {
  createServer,
  type IncomingMessage,
  type Server,
  type ServerResponse,
} from "node:http";

// Everything here goes through a real `RequestHandler`, real axios and a local
// HTTP server, because the behaviours under test happen after the point where
// the other tests stub `handleRequest`: axios decoding a body, core redacting
// an error. See docs/usps-api.md#testing.

const CLIENT = "usps:_:main";
const BOUNDARY = "XkxytuhvSSXDz-aV1q2YverB";

/** Every byte value, with CR, LF, and a boundary-like line inside, as a worst case. */
const PDF = Buffer.concat([
  Buffer.from("%PDF-1.4\r\n"),
  Buffer.from(Array.from({ length: 256 }, (_, i) => i)),
  Buffer.from(`\r\n--${BOUNDARY.slice(0, 8)}\r\n`),
  Buffer.from([0xff, 0xd8, 0x00, 0x0d, 0x0a]),
]);

type Route = (req: IncomingMessage, res: ServerResponse) => void;

interface Seen {
  method?: string;
  url?: string;
  headers: IncomingMessage["headers"];
}

const servers: Server[] = [];
const handlers: RequestHandler[] = [];

afterEach(async () => {
  for (const h of handlers.splice(0)) await h.stop();
  for (const s of servers.splice(0)) s.close();
  resetBinding();
});

const json = (res: ServerResponse, status: number, body: unknown) => {
  res.statusCode = status;
  res.setHeader("content-type", "application/json");
  res.end(JSON.stringify(body));
};

/** A USPS stand-in: OAuth and payment tokens, plus whatever `routes` adds. */
async function start(routes: Record<string, Route>) {
  const seen: Seen[] = [];
  const server = createServer((req, res) => {
    seen.push({ method: req.method, url: req.url, headers: req.headers });
    req.resume();
    req.on("end", () => {
      if (req.url === "/oauth2/v3/token")
        return json(res, 200, { access_token: "tok", expires_in: 3600 });
      if (req.url === "/payments/v3/payment-authorization")
        return json(res, 200, {
          paymentAuthorizationToken: "pay.tok.en",
          roles: [],
        });
      const route = routes[`${req.method} ${req.url}`];
      if (route) return route(req, res);
      json(res, 404, {
        error: { message: `no route ${req.method} ${req.url}` },
      });
    });
  });
  await new Promise<void>((r) => server.listen(0, "127.0.0.1", r));
  servers.push(server);
  const baseUrl = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;

  const handler = new RequestHandler({
    key: TEST_KEY,
    backend: memoryBackend(),
  });
  handlers.push(handler);
  handler.use(usps);
  await handler.addTemplateClient(
    "usps" as never,
    {
      instanceId: "main",
      clientId: "id",
      clientSecret: "secret",
      baseUrl,
      crid: "12345678",
      mid: "123456789",
    } as never
  );
  return { seen };
}

const caught = async (call: Promise<unknown>) => {
  try {
    await call;
  } catch (error) {
    return error as {
      code?: string;
      metadata?: { originalError?: { status?: number; data?: unknown } };
    };
  }
  throw new Error("expected the call to reject");
};

const container: UspsContainerCreateRequest = {
  MID: "123456",
  mailerName: "Acme",
  mailClass: "PARCEL_SELECT",
  sortType: "PALLET",
  processingCategory: "MACHINABLE",
  destinationEntryFacilityType: "DESTINATION_DELIVERY_UNIT",
  destinationZIPCode: "20260",
  originAddress: {
    streetAddress: "1 Main St",
    city: "Memphis",
    state: "TN",
    ZIPCode: "38188",
  },
};

const indicia: UspsLabelIndiciaRequest = {
  indiciaDescription: {
    processingCategory: "LETTERS",
    weight: 1,
    mailingDate: "2026-11-12",
    length: 9,
    height: 4,
    thickness: 0.1,
  },
};

const multipartBody = (...parts: Array<Buffer | string>) =>
  Buffer.concat([
    ...parts.map((p) => (typeof p === "string" ? Buffer.from(p) : p)),
    Buffer.from(`--${BOUNDARY}--\r\n`),
  ]);

const metadataPart = (name: string, value: object) =>
  `--${BOUNDARY}\r\nContent-Type: application/json\r\n` +
  `Content-Disposition: form-data; name="${name}"\r\n\r\n` +
  `${JSON.stringify(value)}\r\n`;

const multipart = (res: ServerResponse, body: Buffer) => {
  res.statusCode = 201;
  res.setHeader("content-type", `multipart/form-data; boundary=${BOUNDARY}`);
  res.end(body);
};

describe("usps binary responses through a real RequestHandler", () => {
  it("createUspsContainerLabel keeps USPS's error message when the call fails", async () => {
    await start({
      "POST /containers/v3/containers": (_req, res) =>
        json(res, 400, {
          apiVersion: "v3",
          error: { code: "400", message: "Invalid sortType for mailClass" },
        }),
    });
    const error = await caught(
      containers.createUspsContainerLabel(CLIENT, container)
    );
    expect(error.code).toBe("USP_0083");
    const original = error.metadata?.originalError;
    expect(original?.status).toBe(400);
    // Without `bytesOnSuccess` this is the string "[Buffer 83 bytes]".
    expect(JSON.stringify(original?.data)).toContain(
      "Invalid sortType for mailClass"
    );
    expect(JSON.stringify(original?.data)).not.toContain("[Buffer");
  });

  it("keeps a non-JSON failure body as text", async () => {
    await start({
      "POST /containers/v3/containers": (_req, res) => {
        res.statusCode = 400;
        res.setHeader("content-type", "text/html");
        res.end("<html>Bad gateway-ish: upstream refused</html>");
      },
    });
    const error = await caught(
      containers.createUspsContainerLabel(CLIENT, container)
    );
    expect(error.metadata?.originalError?.data).toBe(
      "<html>Bad gateway-ish: upstream refused</html>"
    );
  });

  it("createUspsContainerLabel returns the PDF byte for byte and asks for multipart", async () => {
    const { seen } = await start({
      "POST /containers/v3/containers": (_req, res) =>
        multipart(
          res,
          multipartBody(
            metadataPart("containerMetadata", { containerID: "99M1" }),
            `--${BOUNDARY}\r\nContent-Type: application/pdf\r\n` +
              `Content-Disposition: form-data; filename="labelImage.pdf"; name="labelImage"\r\n\r\n`,
            PDF,
            "\r\n"
          )
        ),
    });
    const result = await containers.createUspsContainerLabel(CLIENT, container);
    expect(result.metadata.containerID).toBe("99M1");
    expect(result.labelImage?.bytes.equals(PDF)).toBe(true);
    const request = seen.find((r) => r.url === "/containers/v3/containers");
    expect(request?.headers.accept).toBe("multipart/form-data");
  });

  it("reads an image part that has a filename and no name", async () => {
    await start({
      "POST /containers/v3/containers": (_req, res) =>
        multipart(
          res,
          multipartBody(
            metadataPart("containerMetadata", { containerID: "99M1" }),
            `--${BOUNDARY}\r\nContent-Disposition: attachment; filename="label-image.pdf"\r\n\r\n`,
            PDF,
            "\r\n"
          )
        ),
    });
    const result = await containers.createUspsContainerLabel(CLIENT, container);
    expect(result.labelImage?.filename).toBe("label-image.pdf");
    expect(result.labelImage?.bytes.equals(PDF)).toBe(true);
  });

  it("fails USP_0159 when a container label arrives with no image, unless NONE was requested", async () => {
    await start({
      "POST /containers/v3/containers": (_req, res) =>
        multipart(
          res,
          multipartBody(
            metadataPart("containerMetadata", { containerID: "99M1" })
          )
        ),
    });
    const error = await caught(
      containers.createUspsContainerLabel(CLIENT, container)
    );
    expect(error.code).toBe("USP_0159");
    const none = await containers.createUspsContainerLabel(CLIENT, {
      ...container,
      imageInfo: { imageType: "NONE" },
    });
    expect(none.labelImage).toBeUndefined();
  });

  it("createLabelIndicia keeps USPS's error message when the call fails", async () => {
    await start({
      "POST /labels/v3/indicia": (_req, res) =>
        json(res, 400, { error: { message: "weight exceeds letter limit" } }),
    });
    const error = await caught(
      labels.createLabelIndicia(CLIENT, indicia, { accountNumber: "1000" })
    );
    expect(error.code).toBe("USP_0023");
    expect(JSON.stringify(error.metadata?.originalError?.data)).toContain(
      "weight exceeds letter limit"
    );
  });

  it("createLabelIndicia assigns unnamed image parts by file name, then by order", async () => {
    const receipt = Buffer.from("%PDF-1.4 receipt ÿ\u0000", "latin1");
    const mark = Buffer.from("%PDF-1.4 indicia þ\u0001", "latin1");
    await start({
      "POST /labels/v3/indicia": (_req, res) =>
        multipart(
          res,
          multipartBody(
            metadataPart("indiciaMetadata", { SKU: "S1" }),
            // Receipt first, as in USPS's README, but neither part has a name.
            `--${BOUNDARY}\r\nContent-Disposition: attachment; filename="receipt-image.pdf"\r\n\r\n`,
            receipt,
            `\r\n--${BOUNDARY}\r\nContent-Disposition: attachment; filename="indicia-image.pdf"\r\n\r\n`,
            mark,
            "\r\n"
          )
        ),
    });
    const result = await labels.createLabelIndicia(CLIENT, indicia, {
      accountNumber: "1000",
    });
    expect(result.receiptImage).toBe(receipt.toString("base64"));
    expect(result.indiciaImage).toBe(mark.toString("base64"));
  });

  it("createLabelIndicia fails USP_0160 when no image part arrives", async () => {
    await start({
      "POST /labels/v3/indicia": (_req, res) =>
        multipart(
          res,
          multipartBody(metadataPart("indiciaMetadata", { SKU: "S1" }))
        ),
    });
    const error = await caught(
      labels.createLabelIndicia(CLIENT, indicia, { accountNumber: "1000" })
    );
    expect(error.code).toBe("USP_0160");
  });
});

describe("usps getPickup with If-None-Match through a real RequestHandler", () => {
  const PICKUP = "/pickup/v3/carrier-pickup/WTC1";

  it("resolves a 304 to a not-modified result", async () => {
    const { seen } = await start({
      [`GET ${PICKUP}`]: (_req, res) => {
        res.statusCode = 304;
        res.setHeader("etag", '"v1"');
        res.end();
      },
    });
    const result = await pickups.getPickup(CLIENT, "WTC1", {
      ifNoneMatch: '"v1"',
    });
    expect(result).toEqual({ notModified: true, etag: '"v1"' });
    expect(seen.find((r) => r.url === PICKUP)?.headers["if-none-match"]).toBe(
      '"v1"'
    );
  });

  it("still returns the pickup and its ETag on a 200", async () => {
    await start({
      [`GET ${PICKUP}`]: (_req, res) => {
        res.setHeader("etag", '"v2"');
        json(res, 200, { confirmationNumber: "WTC1" });
      },
    });
    const result = await pickups.getPickup(CLIENT, "WTC1", {
      ifNoneMatch: '"v1"',
    });
    expect(result).toEqual({
      pickup: { confirmationNumber: "WTC1" },
      etag: '"v2"',
    });
  });

  it("does not admit a 304 without If-None-Match, and still rejects other failures", async () => {
    await start({
      [`GET ${PICKUP}`]: (_req, res) => {
        res.statusCode = 304;
        res.end();
      },
    });
    const error = await caught(pickups.getPickup(CLIENT, "WTC1"));
    expect(error.code).toBe("USP_0011");
  });
});
