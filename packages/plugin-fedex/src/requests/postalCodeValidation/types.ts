export interface FedExPostalValidatePostalCodeRequest {
  carrierCode: "FDXE" | "FDXG" | "FXSP" | "FDXC" | "FXCC";
  countryCode: string;
  /** This is the state or province code. Format and presence of this field will vary, depending on country. */
  stateOrProvinceCode: string;
  /** Identification code of a region (usally small) for easier and accurate mail/package delivery. The format and presence of this field may vary depending on the country. */
  postalCode: string;
  /** Specify the date on which the package is to be shipped. The specified date should not be the current date or any date, 10 days after the current date. The date format must be YYYY-MM-DD. */
  shipDate: string;
  /** Specify the routing code for the shipment. Routing code is the information that identifies the route the package or shipment may take. */
  routingCode?: string;
  checkForMismatch?: boolean;
  /** Name of the city associated with the postal code. Required when `countryCode` is `AU` (Australia). */
  city?: string;
  version?: FedExPostalVersion;
}

export interface FedExPostalValidatePostalCodeResponse {
  transactionId?: string;
  customerTransactionId?: string;
  output?: FedExPostalValidatePostalOutputVO;
}

export interface FedExPostalVersion {
  major?: number;
  minor?: number;
  patch?: number;
}

export interface FedExPostalValidatePostalOutputVO {
  countryCode?: string;
  cityFirstInitials?: string;
  /** This is the state or province code. Format and presence of this element will vary, depending on country. Max length is 2. */
  stateOrProvinceCode?: string;
  alerts?: FedExPostalAlert[];
  locationDescriptions?: FedExPostalLocationDescription[];
  cleanedPostalCode?: string;
}

export interface FedExPostalAlert {
  code?: string;
  alertType?: "NOTE" | "WARNING";
  parameterList?: FedExPostalParameter[];
  message?: string;
}

export interface FedExPostalLocationDescription {
  locationId: string;
  locationNumber: number;
  serviceArea: string;
  airportId: string;
}

export interface FedExPostalParameter {
  value?: string;
  key?: string;
}
