import { tryHandleRequest } from "@dianemo/plugin-kit";
import { uspsSubClient } from "../utils.js";
import type {
  UspsShipEnrollmentRequest,
  UspsShipEnrollmentStatuses,
} from "./types.js";

export const getShipEnrollmentStatus = async (
  clientName: string,
  data: UspsShipEnrollmentRequest
): Promise<UspsShipEnrollmentStatuses> => {
  const res = await tryHandleRequest<UspsShipEnrollmentStatuses>(
    {
      clientName: uspsSubClient(clientName, "default"),
      requestName: "usps.shipEnrollment.getShipEnrollmentStatus",
      method: "POST",
      url: "/ship-enrollment/v3/enrollment",
      data,
    },
    "USP_0089",
    "Failed to get USPS Ship enrollment status"
  );
  return res.data;
};
