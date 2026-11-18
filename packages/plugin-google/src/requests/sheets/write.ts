import { googleSubClient } from "../utils.js";
import { sheetsRequest } from "./errors.js";
import type {
  DateTimeRenderOption,
  InsertDataOption,
  ValueInputOption,
  ValueRenderOption,
} from "./options.js";
import type {
  AppendValuesResponse,
  BatchClearValuesByDataFilterRequest,
  BatchClearValuesByDataFilterResponse,
  BatchClearValuesRequest,
  BatchClearValuesResponse,
  BatchUpdateSpreadsheetRequest,
  BatchUpdateSpreadsheetResponse,
  BatchUpdateValuesByDataFilterRequest,
  BatchUpdateValuesByDataFilterResponse,
  BatchUpdateValuesRequest,
  BatchUpdateValuesResponse,
  ClearValuesResponse,
  CopySheetToAnotherSpreadsheetRequest,
  SheetProperties,
  Spreadsheet,
  UpdateValuesResponse,
  ValueRange,
} from "./schemas.js";

const spreadsheetPath = (spreadsheetId: string) =>
  `/v4/spreadsheets/${encodeURIComponent(spreadsheetId)}`;

const valuesPath = (spreadsheetId: string, range: string) =>
  `${spreadsheetPath(spreadsheetId)}/values/${encodeURIComponent(range)}`;

/** Query parameters `updateValues` and `appendValues` share. */
export interface WriteValuesParams {
  /** Required by Google: how the input is interpreted. */
  valueInputOption: ValueInputOption;
  includeValuesInResponse?: boolean;
  responseValueRenderOption?: ValueRenderOption;
  responseDateTimeRenderOption?: DateTimeRenderOption;
  fields?: string;
}

export interface AppendValuesParams extends WriteValuesParams {
  insertDataOption?: InsertDataOption;
}

/**
 * Every call here runs on `sheetsWrite`, which core does not retry on a 5xx, a
 * timeout or a dropped connection (docs/google-api.md#writes-are-not-retried).
 */
const write = <T>(
  clientName: string,
  requestName: string,
  method: "POST" | "PUT",
  url: string,
  data: unknown,
  params?: object
): Promise<T> =>
  sheetsRequest<T>({
    clientName: googleSubClient(clientName, "sheetsWrite"),
    requestName: `google.sheets.${requestName}`,
    method,
    url,
    params,
    data,
  });

export const createSpreadsheet = (
  clientName: string,
  body: Spreadsheet,
  params?: { fields?: string }
): Promise<Spreadsheet> =>
  write(
    clientName,
    "createSpreadsheet",
    "POST",
    "/v4/spreadsheets",
    body,
    params
  );

export const batchUpdateSpreadsheet = (
  clientName: string,
  spreadsheetId: string,
  body: BatchUpdateSpreadsheetRequest
): Promise<BatchUpdateSpreadsheetResponse> =>
  write(
    clientName,
    "batchUpdateSpreadsheet",
    "POST",
    `${spreadsheetPath(spreadsheetId)}:batchUpdate`,
    body
  );

export const updateValues = (
  clientName: string,
  spreadsheetId: string,
  range: string,
  body: ValueRange,
  params: WriteValuesParams
): Promise<UpdateValuesResponse> =>
  write(
    clientName,
    "updateValues",
    "PUT",
    valuesPath(spreadsheetId, range),
    body,
    params
  );

export const appendValues = (
  clientName: string,
  spreadsheetId: string,
  range: string,
  body: ValueRange,
  params: AppendValuesParams
): Promise<AppendValuesResponse> =>
  write(
    clientName,
    "appendValues",
    "POST",
    `${valuesPath(spreadsheetId, range)}:append`,
    body,
    params
  );

export const batchUpdateValues = (
  clientName: string,
  spreadsheetId: string,
  body: BatchUpdateValuesRequest
): Promise<BatchUpdateValuesResponse> =>
  write(
    clientName,
    "batchUpdateValues",
    "POST",
    `${spreadsheetPath(spreadsheetId)}/values:batchUpdate`,
    body
  );

export const batchUpdateValuesByDataFilter = (
  clientName: string,
  spreadsheetId: string,
  body: BatchUpdateValuesByDataFilterRequest
): Promise<BatchUpdateValuesByDataFilterResponse> =>
  write(
    clientName,
    "batchUpdateValuesByDataFilter",
    "POST",
    `${spreadsheetPath(spreadsheetId)}/values:batchUpdateByDataFilter`,
    body
  );

export const clearValues = (
  clientName: string,
  spreadsheetId: string,
  range: string
): Promise<ClearValuesResponse> =>
  write(
    clientName,
    "clearValues",
    "POST",
    `${valuesPath(spreadsheetId, range)}:clear`,
    {}
  );

export const batchClearValues = (
  clientName: string,
  spreadsheetId: string,
  body: BatchClearValuesRequest
): Promise<BatchClearValuesResponse> =>
  write(
    clientName,
    "batchClearValues",
    "POST",
    `${spreadsheetPath(spreadsheetId)}/values:batchClear`,
    body
  );

export const batchClearValuesByDataFilter = (
  clientName: string,
  spreadsheetId: string,
  body: BatchClearValuesByDataFilterRequest
): Promise<BatchClearValuesByDataFilterResponse> =>
  write(
    clientName,
    "batchClearValuesByDataFilter",
    "POST",
    `${spreadsheetPath(spreadsheetId)}/values:batchClearByDataFilter`,
    body
  );

export const copySheetTo = (
  clientName: string,
  spreadsheetId: string,
  sheetId: number,
  body: CopySheetToAnotherSpreadsheetRequest
): Promise<SheetProperties> =>
  write(
    clientName,
    "copySheetTo",
    "POST",
    `${spreadsheetPath(spreadsheetId)}/sheets/${encodeURIComponent(String(sheetId))}:copyTo`,
    body
  );
