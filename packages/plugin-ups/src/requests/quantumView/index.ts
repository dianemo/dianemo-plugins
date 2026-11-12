import { tryHandleRequest } from "@dianemo/plugin-kit";
import {
  UpsQuantumViewRequestWrapper,
  UpsQuantumViewResponseWrapper,
} from "./types.js";

/** A dated version; a stale pin answers silently — see docs/ups-api.md#version-pins */
const QUANTUM_VIEW_VERSION = "v3";

export const getQuantumViewEvents = async (
  clientName: string,
  data: UpsQuantumViewRequestWrapper
): Promise<UpsQuantumViewResponseWrapper> => {
  const res = await tryHandleRequest<UpsQuantumViewResponseWrapper>(
    {
      clientName,
      requestName: "ups.quantumView.getQuantumViewEvents",
      method: "POST",
      url: `/api/quantumview/${QUANTUM_VIEW_VERSION}/events`,
      data,
    },
    "UPS_0061",
    "Failed to get UPS Quantum View events"
  );
  return res.data;
};
