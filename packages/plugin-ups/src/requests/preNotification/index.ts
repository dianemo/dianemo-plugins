import { tryHandleRequest } from "@dianemo/plugin-kit";
import {
  UpsPreNotificationRequestWrapper,
  UpsPreNotificationResponseWrapper,
} from "./types.js";

/** A dated version; a stale pin answers silently — see docs/ups-api.md#version-pins */
const PRE_NOTIFICATION_VERSION = "v2";

export const sendDangerousGoodsPreNotification = async (
  clientName: string,
  data: UpsPreNotificationRequestWrapper
): Promise<UpsPreNotificationResponseWrapper> => {
  const res = await tryHandleRequest<UpsPreNotificationResponseWrapper>(
    {
      clientName,
      requestName: "ups.preNotification.sendDangerousGoodsPreNotification",
      method: "POST",
      url: `/api/dangerousgoods/${PRE_NOTIFICATION_VERSION}/prenotification`,
      data,
    },
    "UPS_0057",
    "Failed to send UPS dangerous goods pre-notification"
  );
  return res.data;
};
