import { googleSubClient } from "../utils.js";
import { sheetsRequest } from "./errors.js";
import type {
  BatchGetValuesByDataFilterRequest,
  BatchGetValuesByDataFilterResponse,
  BatchGetValuesResponse,
  DeveloperMetadata,
  GetSpreadsheetByDataFilterRequest,
  SearchDeveloperMetadataRequest,
  SearchDeveloperMetadataResponse,
  Spreadsheet,
  ValueRange,
} from "./schemas.js";

/**
 * Axios writes an array as `ranges[]=A&ranges[]=B`; Sheets wants the name
 * repeated (`ranges=A&ranges=B`), which this produces. A param left undefined
 * is dropped.
 */
const repeatArrays = (params: Record<string, unknown>): string => {
  const out = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined) continue;
    for (const item of Array.isArray(value) ? value : [value]) {
      out.append(key, String(item));
    }
  }
  return out.toString();
};

const spreadsheetPath = (spreadsheetId: string) =>
  `/v4/spreadsheets/${encodeURIComponent(spreadsheetId)}`;

export type MajorDimension = "ROWS" | "COLUMNS";
export type ValueRenderOption =
  "FORMATTED_VALUE" | "UNFORMATTED_VALUE" | "FORMULA";
export type DateTimeRenderOption = "SERIAL_NUMBER" | "FORMATTED_STRING";

export interface GetSpreadsheetParams {
  /** A1 or R1C1 ranges, sent as repeated `ranges` params. */
  ranges?: string[];
  includeGridData?: boolean;
  excludeTablesInBandedRanges?: boolean;
  /** Google's partial-response field mask. */
  fields?: string;
}

export interface GetValuesParams {
  majorDimension?: MajorDimension;
  valueRenderOption?: ValueRenderOption;
  dateTimeRenderOption?: DateTimeRenderOption;
  fields?: string;
}

export interface BatchGetValuesParams extends GetValuesParams {
  ranges: string[];
}

export const getSpreadsheet = (
  clientName: string,
  spreadsheetId: string,
  params?: GetSpreadsheetParams
): Promise<Spreadsheet> =>
  sheetsRequest<Spreadsheet>({
    clientName: googleSubClient(clientName, "sheetsRead"),
    requestName: "google.sheets.getSpreadsheet",
    method: "GET",
    url: spreadsheetPath(spreadsheetId),
    params,
    paramsSerializer: repeatArrays,
  });

export const getSpreadsheetByDataFilter = (
  clientName: string,
  spreadsheetId: string,
  body: GetSpreadsheetByDataFilterRequest,
  params?: { fields?: string }
): Promise<Spreadsheet> =>
  sheetsRequest<Spreadsheet>({
    clientName: googleSubClient(clientName, "sheetsRead"),
    requestName: "google.sheets.getSpreadsheetByDataFilter",
    method: "POST",
    url: `${spreadsheetPath(spreadsheetId)}:getByDataFilter`,
    params,
    data: body,
  });

export const getValues = (
  clientName: string,
  spreadsheetId: string,
  range: string,
  params?: GetValuesParams
): Promise<ValueRange> =>
  sheetsRequest<ValueRange>({
    clientName: googleSubClient(clientName, "sheetsRead"),
    requestName: "google.sheets.getValues",
    method: "GET",
    url: `${spreadsheetPath(spreadsheetId)}/values/${encodeURIComponent(range)}`,
    params,
  });

export const batchGetValues = (
  clientName: string,
  spreadsheetId: string,
  params: BatchGetValuesParams
): Promise<BatchGetValuesResponse> =>
  sheetsRequest<BatchGetValuesResponse>({
    clientName: googleSubClient(clientName, "sheetsRead"),
    requestName: "google.sheets.batchGetValues",
    method: "GET",
    url: `${spreadsheetPath(spreadsheetId)}/values:batchGet`,
    params,
    paramsSerializer: repeatArrays,
  });

export const batchGetValuesByDataFilter = (
  clientName: string,
  spreadsheetId: string,
  body: BatchGetValuesByDataFilterRequest
): Promise<BatchGetValuesByDataFilterResponse> =>
  sheetsRequest<BatchGetValuesByDataFilterResponse>({
    clientName: googleSubClient(clientName, "sheetsRead"),
    requestName: "google.sheets.batchGetValuesByDataFilter",
    method: "POST",
    url: `${spreadsheetPath(spreadsheetId)}/values:batchGetByDataFilter`,
    data: body,
  });

export const getDeveloperMetadata = (
  clientName: string,
  spreadsheetId: string,
  metadataId: number
): Promise<DeveloperMetadata> =>
  sheetsRequest<DeveloperMetadata>({
    clientName: googleSubClient(clientName, "sheetsRead"),
    requestName: "google.sheets.getDeveloperMetadata",
    method: "GET",
    url: `${spreadsheetPath(spreadsheetId)}/developerMetadata/${encodeURIComponent(String(metadataId))}`,
  });

export const searchDeveloperMetadata = (
  clientName: string,
  spreadsheetId: string,
  body: SearchDeveloperMetadataRequest
): Promise<SearchDeveloperMetadataResponse> =>
  sheetsRequest<SearchDeveloperMetadataResponse>({
    clientName: googleSubClient(clientName, "sheetsRead"),
    requestName: "google.sheets.searchDeveloperMetadata",
    method: "POST",
    url: `${spreadsheetPath(spreadsheetId)}/developerMetadata:search`,
    data: body,
  });
