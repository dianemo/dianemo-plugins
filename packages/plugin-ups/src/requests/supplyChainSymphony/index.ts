import { tryHandleRequest } from "@dianemo/plugin-kit";
import {
  UpsScsIngestInventoryRequest,
  UpsScsIngestInventorySuccessResponse,
  UpsScsLogisticsDataRequest,
  UpsScsLogisticsSC360ResponseListServiceResponse,
  UpsScsTransportationSC360InterfaceSC360IngestRequest,
  UpsScsTransportationSC360ResponseListServiceResponse,
} from "./types.js";

// The three ingest specs each fix their own version in the server URL, and none
// is a dated release like the rest of UPS — see docs/ups-api.md#supply-chain-symphony

/** Not under `/api`, unlike every other UPS family */
const INVENTORY_URL = "/inventory/v1/inventory";

/** Not under `/api`, unlike every other UPS family */
const LOGISTICS_URL = "/logistics/v1/logistics-data";

const TRANSPORTATION_URL = "/api/transaction-visibility-dashboard/v1/Ingest";

/** Push a warehouse inventory snapshot into Supply Chain Symphony. */
export const ingestScsInventory = async (
  clientName: string,
  data: UpsScsIngestInventoryRequest
): Promise<UpsScsIngestInventorySuccessResponse> => {
  const res = await tryHandleRequest<UpsScsIngestInventorySuccessResponse>(
    {
      clientName,
      requestName: "ups.supplyChainSymphony.ingestScsInventory",
      method: "POST",
      url: INVENTORY_URL,
      headers: { "Content-Type": "application/json" },
      data,
    },
    "UPS_0096",
    "Failed to ingest UPS SCS inventory"
  );
  return res.data;
};

/**
 * Push WMS order and shipment updates into Supply Chain Symphony. A 207 means some
 * shipments were rejected; check `result[].isCompleted` rather than the HTTP status.
 */
export const ingestScsLogistics = async (
  clientName: string,
  data: UpsScsLogisticsDataRequest
): Promise<UpsScsLogisticsSC360ResponseListServiceResponse> => {
  const res =
    await tryHandleRequest<UpsScsLogisticsSC360ResponseListServiceResponse>(
      {
        clientName,
        requestName: "ups.supplyChainSymphony.ingestScsLogistics",
        method: "POST",
        url: LOGISTICS_URL,
        headers: { "Content-Type": "application/json" },
        data,
      },
      "UPS_0097",
      "Failed to ingest UPS SCS logistics data"
    );
  return res.data;
};

/**
 * Push partner transportation orders and status updates into Supply Chain Symphony.
 * A 207 means some shipments were rejected, as with `ingestScsLogistics`.
 */
export const ingestScsTransportation = async (
  clientName: string,
  data: UpsScsTransportationSC360InterfaceSC360IngestRequest
): Promise<UpsScsTransportationSC360ResponseListServiceResponse> => {
  const res =
    await tryHandleRequest<UpsScsTransportationSC360ResponseListServiceResponse>(
      {
        clientName,
        requestName: "ups.supplyChainSymphony.ingestScsTransportation",
        method: "POST",
        url: TRANSPORTATION_URL,
        headers: { "Content-Type": "application/json" },
        data,
      },
      "UPS_0098",
      "Failed to ingest UPS SCS transportation data"
    );
  return res.data;
};
