/**
 * The sub-client carrying the Trade Documents Upload API, which FedEx serves
 * from its own hosts — see docs/fedex-api.md#trade-documents-upload-host.
 *
 * Each request appends its own segment rather than the caller doing it: the
 * five upload endpoints live on a different host from every other FedEx
 * endpoint here, and a caller who forgot the segment would POST a document to
 * the shipping host.
 */
export const FEDEX_DOCUMENTS_CLIENT = "documents";

export type FedExClientGroup = typeof FEDEX_DOCUMENTS_CLIENT;

export const fedexSubClient = (clientName: string, group: FedExClientGroup) =>
  `${clientName}:${group}`;
