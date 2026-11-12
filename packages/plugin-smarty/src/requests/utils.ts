export type SmartySubClient =
  | "us"
  | "intl"
  | "usZipcode"
  | "usAutocomplete"
  | "usExtract"
  | "usReverseGeo"
  | "intlAutocomplete";

export const smartySubClient = (clientName: string, group: SmartySubClient) =>
  `${clientName}:${group}`;

/** Axios emits an undefined value as a bare query key, so unset inputs are dropped. */
export const smartyQueryParams = (params: object): Record<string, string> => {
  const cleaned: Record<string, string> = {};
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null && v !== "") cleaned[k] = String(v);
  }
  return cleaned;
};
