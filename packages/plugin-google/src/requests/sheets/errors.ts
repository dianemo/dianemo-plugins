import { tryHandleRequest } from "@dianemo/plugin-kit";
import type { RequestConfig } from "@dianemo/core";
import {
  RequestError,
  getOriginalResponseData,
  getOriginalStatus,
} from "@dianemo/core";

/**
 * One code per distinct failure, shared by every Sheets call
 * (docs/google-api.md#google-sheets-api-v4-errors):
 *
 * - `GGL_0009` not found or no access (404, and 403 that is neither of the two
 *   below). Google answers a sheet the caller cannot see the same way as one
 *   that does not exist, so neither can this plugin tell them apart.
 * - `GGL_0010` invalid request (400).
 * - `GGL_0011` quota exceeded (429, and a 403 whose reason is a rate limit),
 *   raised after core's own retries.
 * - `GGL_0012` any other failure, including one with no HTTP status and a 403
 *   because the Sheets API is not enabled for the project.
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

const RATE_LIMIT_REASONS = new Set([
  "ratelimitexceeded",
  "userratelimitexceeded",
  "rate_limit_exceeded",
]);
const API_DISABLED_REASONS = new Set([
  "service_disabled",
  "accessnotconfigured",
]);

/**
 * Every machine-readable reason in Google's error body, lower-cased: the new
 * style `error.details[].reason` and the older `error.errors[].reason`. Any of
 * it may be missing, so nothing here throws.
 */
function reasonsOf(err: unknown): Set<string> {
  const reasons = new Set<string>();
  const body = getOriginalResponseData(err);
  if (!body || typeof body !== "object") return reasons;
  const error = (body as { error?: unknown }).error;
  if (!error || typeof error !== "object") return reasons;
  const { details, errors } = error as { details?: unknown; errors?: unknown };
  for (const list of [details, errors]) {
    if (!Array.isArray(list)) continue;
    for (const item of list) {
      const reason = (item as { reason?: unknown } | null)?.reason;
      if (typeof reason === "string") reasons.add(reason.toLowerCase());
    }
  }
  return reasons;
}

/** A 403 is three different failures; the body says which. */
function codeFor(status: number | undefined, err: unknown): string {
  if (status === 403) {
    const reasons = reasonsOf(err);
    if ([...reasons].some((r) => RATE_LIMIT_REASONS.has(r))) return "GGL_0011";
    if ([...reasons].some((r) => API_DISABLED_REASONS.has(r))) {
      return "GGL_0012";
    }
  }
  return (status && CODE_BY_STATUS[status]) || "GGL_0012";
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
    const code = codeFor(status, err);
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
