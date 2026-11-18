import { createServer, type IncomingMessage, type Server } from "node:http";
import { generateKeyPairSync } from "node:crypto";
import type { AddressInfo } from "node:net";

export const { privateKey, publicKey } = generateKeyPairSync("rsa", {
  modulusLength: 2048,
});
export const pem = privateKey
  .export({ type: "pkcs8", format: "pem" })
  .toString();

export interface TokenResponse {
  status: number;
  body: unknown;
}

export interface Hit {
  url?: string;
  headers: IncomingMessage["headers"];
  body: string;
}

/**
 * A local server that is both Google's token endpoint (`/token`) and a Sheets
 * host: `token` answers the first, `api` the rest. Every request is recorded.
 */
export async function startServer(opts: {
  token?: () => TokenResponse;
  api?: (hit: Hit) => TokenResponse;
}): Promise<{ server: Server; base: string; hits: Hit[] }> {
  const hits: Hit[] = [];
  const server = createServer((req, res) => {
    const chunks: Buffer[] = [];
    req.on("data", (c) => chunks.push(c));
    req.on("end", () => {
      const hit = {
        url: req.url,
        headers: req.headers,
        body: Buffer.concat(chunks).toString("utf8"),
      };
      hits.push(hit);
      const out =
        req.url === "/token"
          ? (opts.token?.() ?? {
              status: 200,
              body: { access_token: "sa-token", expires_in: 3600 },
            })
          : (opts.api?.(hit) ?? { status: 200, body: { ok: true } });
      res.statusCode = out.status;
      res.setHeader("content-type", "application/json");
      res.end(JSON.stringify(out.body));
    });
  });
  await new Promise<void>((r) => server.listen(0, "127.0.0.1", r));
  return {
    server,
    base: `http://127.0.0.1:${(server.address() as AddressInfo).port}`,
    hits,
  };
}

export const serviceAccountCreds = (base: string, instanceId = "sa") => ({
  instanceId,
  serviceAccountEmail: "sa@project.iam.gserviceaccount.com",
  privateKey: pem,
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  tokenUrl: `${base}/token`,
  baseUrl: base,
  sheetsBaseUrl: base,
});
