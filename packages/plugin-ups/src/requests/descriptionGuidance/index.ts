import { tryHandleRequest } from "@dianemo/plugin-kit";
import {
  UpsDescriptionGuidanceFeedback,
  UpsDescriptionGuidanceInteractiveResponse,
  UpsDescriptionGuidanceIterateRequest,
  UpsDescriptionGuidanceSessionOptions,
  UpsDescriptionGuidanceStartRequest,
} from "./types.js";

/** `v1` is the only value the spec's server variable allows — see docs/ups-api.md#version-pins */
const DESCRIPTION_GUIDANCE_VERSION = "v1";
const BASE_PATH = `/api/export-assure/${DESCRIPTION_GUIDANCE_VERSION}/interactive`;

/** Open an interactive session that refines a commodity description. */
export const startDescriptionGuidanceSession = async (
  clientName: string,
  data: UpsDescriptionGuidanceStartRequest
): Promise<UpsDescriptionGuidanceInteractiveResponse> => {
  const res = await tryHandleRequest<UpsDescriptionGuidanceInteractiveResponse>(
    {
      clientName,
      requestName: "ups.descriptionGuidance.startDescriptionGuidanceSession",
      method: "POST",
      url: BASE_PATH,
      data,
    },
    "UPS_0068",
    "Failed to start UPS description guidance session"
  );
  return res.data;
};

/** Answer the questions from the previous step; repeat until `noMoreQuestions`. */
export const continueDescriptionGuidanceSession = async (
  clientName: string,
  { sessionId }: UpsDescriptionGuidanceSessionOptions,
  data: UpsDescriptionGuidanceIterateRequest
): Promise<UpsDescriptionGuidanceInteractiveResponse> => {
  const res = await tryHandleRequest<UpsDescriptionGuidanceInteractiveResponse>(
    {
      clientName,
      requestName: "ups.descriptionGuidance.continueDescriptionGuidanceSession",
      method: "POST",
      url: `${BASE_PATH}/${encodeURIComponent(sessionId)}`,
      data,
    },
    "UPS_0069",
    "Failed to continue UPS description guidance session"
  );
  return res.data;
};

/** Rate a session's outcome. UPS answers 204, so nothing is returned. */
export const submitDescriptionGuidanceFeedback = async (
  clientName: string,
  { sessionId }: UpsDescriptionGuidanceSessionOptions,
  data: UpsDescriptionGuidanceFeedback
): Promise<void> => {
  await tryHandleRequest<void>(
    {
      clientName,
      requestName: "ups.descriptionGuidance.submitDescriptionGuidanceFeedback",
      method: "POST",
      url: `${BASE_PATH}/feedback/${encodeURIComponent(sessionId)}`,
      data,
    },
    "UPS_0070",
    "Failed to submit UPS description guidance feedback"
  );
};
