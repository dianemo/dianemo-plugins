import { tryHandleRequest } from "@dianemo/plugin-kit";
import {
  FedExPostalValidatePostalCodeRequest,
  FedExPostalValidatePostalCodeResponse,
} from "./types.js";

export const validatePostalCode = async (
  clientName: string,
  data: FedExPostalValidatePostalCodeRequest
): Promise<FedExPostalValidatePostalCodeResponse> => {
  const url = "/country/v1/postal/validate";
  const res = await tryHandleRequest<FedExPostalValidatePostalCodeResponse>(
    {
      clientName,
      requestName: "fedex.postalCodeValidation.validatePostalCode",
      method: "POST",
      url,
      data,
    },
    "FDX_0074",
    "Failed to validate FedEx postal code"
  );
  return res.data;
};
