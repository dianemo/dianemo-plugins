import type { FedExLetterheadImageDocument } from "../src/requests/tradeDocuments/types.js";
import type { FedExTrackDocumentsRequest } from "../src/requests/packageTracking/types.js";
import { describe, expect, it } from "vitest";
import type {
  CheckPickupAvailabilityData,
  CreatePickupData,
} from "../src/requests/pickupRequest/types.js";

// The spec types each of these as a plain string and names a few values in
// prose, so a value outside the named ones must compile. Compile errors fail.
describe("fedex request fields the spec leaves as plain strings", () => {
  it("accepts a value outside the prose-named ones, and the named ones", () => {
    const image: FedExLetterheadImageDocument[] = [
      {
        referenceId: "1",
        name: "a.jpg",
        contentType: "image/jpeg",
        meta: { imageType: "SIGNATURE", imageIndex: "IMAGE_1" },
      },
      {
        referenceId: "1",
        name: "a.png",
        contentType: "image/png",
        meta: { imageType: "SIGNATURE", imageIndex: "IMAGE_1" },
      },
    ];
    const tracking: Pick<FedExTrackDocumentsRequest, "trackDocumentDetail">[] =
      [
        {
          trackDocumentDetail: { documentType: "SIGNATURE_PROOF_OF_DELIVERY" },
        },
        {
          trackDocumentDetail: {
            documentType: "NEW_TYPE",
            documentFormat: "TIFF",
          },
        },
      ];
    const pickupTypes: Pick<CreatePickupData, "pickupType">[] = [
      { pickupType: "ON_CALL" },
      { pickupType: "SOME_NEW_VALUE" },
    ];
    const availability: Pick<
      CheckPickupAvailabilityData,
      "pickupType" | "shipmentAttributes"
    >[] = [
      { pickupType: "TAG", shipmentAttributes: { packagingType: "FEDEX_BOX" } },
      {
        pickupType: "NEW",
        shipmentAttributes: { packagingType: "PALLET_NEW" },
      },
    ];
    expect(
      [image, tracking, pickupTypes, availability].map((a) => a.length)
    ).toEqual([2, 2, 2, 2]);
  });
});
