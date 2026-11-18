import { RequestError, getOriginalResponseData } from "@dianemo/core";
import { tryHandleRequest } from "@dianemo/plugin-kit";
import type { RequestConfig } from "@dianemo/core";
import { getOriginalStatus } from "@dianemo/core";

/**
 * One code per distinct failure, shared by every Sheets call
 * (docs/google-api.md#google-sheets-api-v4-errors):
 *
 * - `GGL_0009` not found or no access (403 and 404). Google answers a sheet the
 *   caller cannot see the same way as one that does not exist, so neither can
 *   this plugin tell them apart.
 * - `GGL_0010` invalid request (400).
 * - `GGL_0011` quota exceeded (429), raised after core's own retries.
 * - `GGL_0012` any other failure, including one with no HTTP status.
 */
const CODE_BY_STATUS: Record<number, string> = {
  400: "GGL_0010",
  403: "GGL_0009",
  404: "GGL_0009",
  429: "GGL_0011",
};

const MESSAGES: Record<string, string> = {
  GGL_0009:
    "Google Sheets spreadsheet not found, or not shared with this account",
  GGL_0010: "Google Sheets rejected the request as invalid",
  GGL_0011: "Google Sheets quota exceeded",
  GGL_0012: "Google Sheets request failed",
};

/** The `error.status` string of Google's error body, e.g. `PERMISSION_DENIED`. */
function googleStatusOf(err: unknown): string | undefined {
  const body = getOriginalResponseData(err);
  if (!body || typeof body !== "object") return undefined;
  const status = (body as { error?: { status?: unknown } }).error?.status;
  return typeof status === "string" ? status : undefined;
}

/**
 * Runs a Sheets request and re-raises its failure under the code its HTTP
 * status maps to, keeping that status as `statusCode` and under
 * `metadata.status`, and Google's own `error.status` under
 * `metadata.googleStatus`.
 *
 * Core logs the failure once, when `tryHandleRequest` first wraps it, so that
 * log line always carries `GGL_0012`; the error the caller receives carries the
 * mapped code.
 */
export async function sheetsRequest<T>(config: RequestConfig): Promise<T> {
  try {
    const res = await tryHandleRequest<T>(
      config,
      "GGL_0012",
      MESSAGES.GGL_0012
    );
    return res.data;
  } catch (err) {
    if (!(err instanceof RequestError)) throw err;
    const status = getOriginalStatus(err);
    const code = (status && CODE_BY_STATUS[status]) || "GGL_0012";
    throw new RequestError(code, MESSAGES[code], {
      statusCode: status ?? err.statusCode,
      metadata: {
        ...err.metadata,
        status,
        googleStatus: googleStatusOf(err),
      },
      cause: err.cause instanceof Error ? err.cause : undefined,
      errorId: err.errorId,
    });
  }
}
