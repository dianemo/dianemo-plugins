import { tryHandleRequest } from "@dianemo/plugin-kit";
import { uspsSubClient } from "../utils.js";
import type {
  UspsAppointment,
  UspsAppointmentAvailabilityRequest,
  UspsAppointmentAvailabilityResponse,
  UspsAppointmentCancellationRequest,
  UspsAppointmentCancellationResponse,
} from "./types.js";

export const createUspsAppointment = async (
  clientName: string,
  data: UspsAppointment
): Promise<UspsAppointment> => {
  const res = await tryHandleRequest<UspsAppointment>(
    {
      clientName: uspsSubClient(clientName, "default"),
      requestName: "usps.appointments.createUspsAppointment",
      method: "POST",
      url: `/fast-appointments/v3/fast-appointments/appointment`,
      data,
    },
    "USP_0155",
    "Failed to create USPS appointment"
  );
  return res.data;
};

export const updateUspsAppointment = async (
  clientName: string,
  data: UspsAppointment
): Promise<UspsAppointment> => {
  const res = await tryHandleRequest<UspsAppointment>(
    {
      clientName: uspsSubClient(clientName, "default"),
      requestName: "usps.appointments.updateUspsAppointment",
      method: "PUT",
      url: `/fast-appointments/v3/fast-appointments/appointment`,
      data,
    },
    "USP_0156",
    "Failed to update USPS appointment"
  );
  return res.data;
};

export const cancelUspsAppointment = async (
  clientName: string,
  data: UspsAppointmentCancellationRequest
): Promise<UspsAppointmentCancellationResponse> => {
  const res = await tryHandleRequest<UspsAppointmentCancellationResponse>(
    {
      clientName: uspsSubClient(clientName, "default"),
      requestName: "usps.appointments.cancelUspsAppointment",
      method: "DELETE",
      url: `/fast-appointments/v3/fast-appointments/appointment`,
      data,
    },
    "USP_0157",
    "Failed to cancel USPS appointment"
  );
  return res.data;
};

export const findUspsAppointmentAvailability = async (
  clientName: string,
  data: UspsAppointmentAvailabilityRequest
): Promise<UspsAppointmentAvailabilityResponse> => {
  const res = await tryHandleRequest<UspsAppointmentAvailabilityResponse>(
    {
      clientName: uspsSubClient(clientName, "default"),
      requestName: "usps.appointments.findUspsAppointmentAvailability",
      method: "POST",
      url: `/fast-appointments/v3/appointment-availability`,
      data,
    },
    "USP_0158",
    "Failed to find USPS appointment availability"
  );
  return res.data;
};
