export interface UpsDescriptionGuidanceSessionOptions {
  sessionId: string;
}

export interface UpsDescriptionGuidanceAnswer {
  id: string;
  selected: number;
}

export type UpsDescriptionGuidanceCountries =
  | "US"
  | "CA"
  | "CN"
  | "UK"
  | "DE"
  | "HK"
  | "NL"
  | "IT"
  | "ES"
  | "FR"
  | "GB"
  | "IE";

export interface UpsDescriptionGuidanceCustomErrorResponse {
  response: UpsDescriptionGuidanceErrorObjList;
}

export interface UpsDescriptionGuidanceErrorObj {
  code: string;
  message: string;
}

export interface UpsDescriptionGuidanceErrorObjList {
  errors: UpsDescriptionGuidanceErrorObj[];
}

export interface UpsDescriptionGuidanceFeedback {
  id: string;
  sentiment: boolean;
  feedback?: string;
}

export interface UpsDescriptionGuidanceHistory {
  id: string;
  selected: number;
  assumed: boolean;
}

export interface UpsDescriptionGuidanceInteractiveResponse {
  newProductDescription: string;
  actualHts?: string;
  suggestedHts?: string;
  confidence?: number;
  noMoreQuestions?: boolean;
  questions?: UpsDescriptionGuidanceQuestion[];
  session: UpsDescriptionGuidanceSession;
}

export interface UpsDescriptionGuidanceIterateRequest {
  questions: UpsDescriptionGuidanceAnswer[];
}

export type UpsDescriptionGuidanceLanguages = "EN";

export type UpsDescriptionGuidanceQuestionType = "multiple_choice";

export interface UpsDescriptionGuidanceQuestion {
  id: string;
  type?: UpsDescriptionGuidanceQuestionType;
  question: string;
  options: string[];
  other?: string[];
  selected?: number;
  assumed?: boolean;
}

export interface UpsDescriptionGuidanceSession {
  id: string;
  historyDesc?: UpsDescriptionGuidanceHistory[];
}

export interface UpsDescriptionGuidanceStartRequest {
  importCountryCode: UpsDescriptionGuidanceCountries;
  exportCountryCode?: string;
  commodityValue?: string;
  commodityCurrencyCode?: string;
  commodityQuantity?: string;
  commodityUnitOfMeasure?: string;
  commodityDescription: string;
  commodityHtsCode?: string;
  commodityCountryOfOrigin?: string;
  shipperName?: string;
  shipperAccountNumber?: string;
  locale?: UpsDescriptionGuidanceLanguages;
}
