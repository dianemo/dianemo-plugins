// Generated shape of the UPS "Paperless Document" OpenAPI spec; see docs/ups-api.md.

export interface UpsPaperlessDeleteResponseWrapper {
  DeleteResponse: UpsPaperlessDeleteResponse;
}

export interface UpsPaperlessDeleteResponse {
  Response: UpsPaperlessDeleteResponseResponse;
}

export interface UpsPaperlessDeleteResponseResponse {
  ResponseStatus: UpsPaperlessResponseResponseStatus;
  /** Alert Container. There can be zero to many alert containers with code and description. */
  Alert?: UpsPaperlessResponseAlert[];
  TransactionReference?: UpsPaperlessResponseTransactionReference;
}

export interface UpsPaperlessResponseResponseStatus {
  /** Identifies the success or failure of the transaction. Valid values are 0 = Failed and 1 = Successful. */
  Code: string;
  /** Describes Response Status Code. Returns text of "Success" or "Failure". */
  Description: string;
}

/** Alert Container. There can be zero to many alert containers with code and description. */
export interface UpsPaperlessResponseAlert {
  /** Warning code returned by the system. */
  Code: string;
  Description: string;
}

export interface UpsPaperlessResponseTransactionReference {
  /** The CustomerContext Information which will be echoed during response. */
  CustomerContext?: string;
}

export interface UpsPaperlessPushToImageRepositoryRequestWrapper {
  PushToImageRepositoryRequest: UpsPaperlessPushToImageRepositoryRequest;
}

export interface UpsPaperlessPushToImageRepositoryResponseWrapper {
  PushToImageRepositoryResponse: UpsPaperlessPushToImageRepositoryResponse;
}

export interface UpsPaperlessPushToImageRepositoryRequest {
  Request: UpsPaperlessPushToImageRepositoryRequestRequest;
  ShipperNumber: string;
  FormsHistoryDocumentID: UpsPaperlessPushToImageRepositoryRequestFormsHistoryDocumentID;
  FormsGroupID?: string;
  ShipmentIdentifier: string;
  /** The date and time of the processed shipment. Required only for small package shipments. The valid format is yyyy-MM-dd-HH.mm.ss */
  ShipmentDateAndTime?: string;
  /** Valid values are: 1 = small package, 2 = freight. */
  ShipmentType: string;
  PRQConfirmationNumber?: string;
  TrackingNumber?: string[];
}

export interface UpsPaperlessPushToImageRepositoryRequestRequest {
  RequestOption?: string;
  /** Not Used. */
  SubVersion?: string;
  TransactionReference?: UpsPaperlessRequestTransactionReference;
}

export interface UpsPaperlessRequestTransactionReference {
  /** The client uses CustomerContext to synchronize request/response pairs. The client establishes CustomerContext, which can contain any information you want; it is echoed back by the server. */
  CustomerContext?: string;
}

export interface UpsPaperlessPushToImageRepositoryRequestFormsHistoryDocumentID {
  DocumentID: string[];
}

export interface UpsPaperlessPushToImageRepositoryResponse {
  Response: UpsPaperlessPushToImageRepositoryResponseResponse;
  FormsGroupID?: string;
}

export interface UpsPaperlessPushToImageRepositoryResponseResponse {
  ResponseStatus: UpsPaperlessResponseResponseStatus;
  /** Alert Container. There can be zero to many alert containers with code and description. */
  Alert?: UpsPaperlessResponseAlert[];
  TransactionReference?: UpsPaperlessResponseTransactionReference;
}

export interface UpsPaperlessUploadRequestWrapper {
  UploadRequest: UpsPaperlessUploadRequest;
}

export interface UpsPaperlessUploadResponseWrapper {
  UploadResponse: UpsPaperlessUploadResponse;
}

export interface UpsPaperlessUploadRequest {
  Request: UpsPaperlessUploadRequestRequest;
  ShipperNumber: string;
  UserCreatedForm: UpsPaperlessUploadRequestUserCreatedForm[];
}

export interface UpsPaperlessUploadRequestRequest {
  RequestOption?: string;
  /** Not Used. */
  SubVersion?: string;
  TransactionReference?: UpsPaperlessRequestTransactionReference;
}

export interface UpsPaperlessUploadRequestUserCreatedForm {
  UserCreatedFormFileName: string;
  /** The user created form file. The maximum allowable size of each file is restricted to 10 MB. Should be a base64 encoded string. Note: The maximum allowable size of each file is restriced to 1MB in CIE (Customer Integration Environment). */
  UserCreatedFormFile: string;
  /** The UserCreatedForm file format. The allowed file formats are bmp, doc, gif, jpg, pdf, png, rtf, tif, txt and xls. The only exceptions for having file format of length 4 character are docx and xlsx. All other file formats needs to be of length 3. */
  UserCreatedFormFileFormat: string;
  UserCreatedFormDocumentType: string;
}

export interface UpsPaperlessUploadResponse {
  Response: UpsPaperlessUploadResponseResponse;
  FormsHistoryDocumentID?: UpsPaperlessUploadResponseFormsHistoryDocumentID;
}

export interface UpsPaperlessUploadResponseResponse {
  ResponseStatus: UpsPaperlessResponseResponseStatus;
  /** Alert Container. There can be zero to many alert containers with code and description. */
  Alert?: UpsPaperlessResponseAlert[];
  TransactionReference?: UpsPaperlessResponseTransactionReference;
}

export interface UpsPaperlessUploadResponseFormsHistoryDocumentID {
  DocumentID: string[];
}

/** Sent as the `ShipperNumber` header. */
export interface UpsPaperlessDocumentParams {
  shipperNumber: string;
}

export interface UpsPaperlessDeleteParams extends UpsPaperlessDocumentParams {
  /** Sent as the `DocumentId` header; UPS accepts exactly one per delete. */
  documentId: string;
}
