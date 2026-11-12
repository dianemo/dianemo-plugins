import type { UpsPreNotificationRequestWrapper } from "../src/requests/preNotification/types.js";
import type { UpsAddressClassification } from "../src/requests/addressValidation/types.js";
import type { UpsQuantumViewRequestWrapper } from "../src/requests/quantumView/types.js";
import type { UpsLocatorRequestWrapper } from "../src/requests/locator/types.js";
import type { Indicator } from "../src/requests/types.js";
import { describe, expect, it } from "vitest";
import type {
  UpsPaperlessPushToImageRepositoryRequestWrapper,
  UpsPaperlessUploadRequestWrapper,
} from "../src/requests/paperlessDocuments/types.js";
import type {
  UpsDangerousGoodsAcceptanceAuditPreCheckRequestWrapper,
  UpsDangerousGoodsChemicalReferenceDataRequestWrapper,
} from "../src/requests/dangerousGoods/types.js";
import type {
  UpsTimeInTransitCandidateAddress,
  UpsTimeInTransitRequest,
  UpsTimeInTransitService,
} from "../src/requests/timeInTransit/types.js";
import type {
  UpsShippingLabelRecoveryResponse,
  UpsShippingShipRequest,
  UpsShippingTransactionReference,
  UpsShippingRecoverLabelRequest,
} from "../src/requests/shipping/types.js";
import type {
  COD,
  GetPackageRating,
  Service,
} from "../src/requests/rating/types.js";
import type {
  UpsPickupCreationRequest,
  UpsPickupGetServiceCenterFacilitiesRequest,
  UpsPickupRateRequest,
} from "../src/requests/pickup/types.js";

/**
 * Every assignment here is the test: `tsc` over the repo (`npm run check` and
 * the root tsconfig, which includes this folder) fails if a shape UPS's own
 * spec examples or Java samples send stops being accepted. The runtime
 * `expect`s only keep vitest from reporting an empty file.
 *
 * Source of each shape: an example embedded in UPS's OpenAPI spec, or UPS's
 * published Java sample run at API version v1 — docs/ups-api.md.
 */
type Accepts<Field, Value> = [Value] extends [Field] ? true : never;

describe("plugin-ups request and response shapes follow UPS's own examples", () => {
  it("Indicator admits the empty tag the spec describes", () => {
    const presence: Indicator[] = ["", "X", "Y", "true"];
    expect(presence).toHaveLength(4);
  });

  it("Rating accepts a service code and COD funds code outside the domestic list", () => {
    // The spec's International_Rate example sends "072"; the appendix is the list.
    const service: Service = { Code: "072" };
    const cod: COD["CODFundsCode"] = "1";
    expect([service.Code, cod]).toEqual(["072", "1"]);
  });

  it("Address Validation accepts a classification description outside the four known", () => {
    const description: UpsAddressClassification["Description"] = "Mixed";
    expect(description).toBe("Mixed");
  });

  it("Shipping and Rating requests take one object where they used to need an array", () => {
    type Shipment = UpsShippingShipRequest["ShipmentRequest"]["Shipment"];
    type Package = Shipment["Package"];
    type Charge = NonNullable<Shipment["PaymentInformation"]>["ShipmentCharge"];
    type Rated = GetPackageRating["RateRequest"]["Shipment"]["Package"];
    type One<T> = T extends readonly (infer U)[] ? U : never;
    const ok: [
      Accepts<Package, One<Package>>,
      Accepts<Charge, One<Charge>>,
      Accepts<Rated, One<Rated>>,
    ] = [true, true, true];
    expect(ok).toEqual([true, true, true]);
  });

  it("Shipping and Label Recovery requests may omit LabelStockSize and ReferenceNumber", () => {
    type Spec = NonNullable<
      UpsShippingShipRequest["ShipmentRequest"]["LabelSpecification"]
    >;
    const spec: Spec = { LabelImageFormat: { Code: "GIF" } };
    const recovery: UpsShippingRecoverLabelRequest = {
      LabelRecoveryRequest: {
        Request: {},
        TrackingNumbers: { TrackingNumber: ["1R12345678912345"] },
        ReferenceValues: { ShipperNumber: "XXXXXX" },
      },
    };
    expect(spec.LabelImageFormat.Code).toBe("GIF");
    expect(recovery.LabelRecoveryRequest.ReferenceValues?.ShipperNumber).toBe(
      "XXXXXX"
    );
  });

  it("recoverLabel's response may carry single objects, as UPS's v1 sample does", () => {
    const one: UpsShippingLabelRecoveryResponse = {
      Response: { ResponseStatus: { Code: "1", Description: "Success" } },
      ShipmentIdentificationNumber: "1Z2866YYYZ29803881",
      LabelResults: {
        TrackingNumber: "1Z2866YYYZ29803881",
        LabelImage: { LabelImageFormat: { Code: "zpl" }, GraphicImage: "" },
      },
    } as UpsShippingLabelRecoveryResponse;
    const many: UpsShippingLabelRecoveryResponse["LabelResults"] = [];
    expect(Array.isArray(one.LabelResults)).toBe(false);
    expect(many).toEqual([]);
  });

  it("Label Recovery accepts the spelling the spec's example uses", () => {
    const delivery: NonNullable<
      UpsShippingRecoverLabelRequest["LabelRecoveryRequest"]["LabelDelivery"]
    > = { ResendEmailIndicator: "" };
    expect(delivery.ResendEmailIndicator).toBe("");
  });

  it("responses carry TransactionIdentifier, as UPS's samples return it", () => {
    const ref: UpsShippingTransactionReference = {
      CustomerContext: "",
      TransactionIdentifier: "UPS123",
    };
    expect(ref.TransactionIdentifier).toBe("UPS123");
  });

  it("Pickup Rate, Service Center Locations and Creation omit Request as the examples do", () => {
    const rate = {
      PickupRateRequest: {
        PickupAddress: {},
        AlternateAddressIndicator: "N",
        ServiceDateOption: "01",
      },
    } as unknown as UpsPickupRateRequest;
    type RateBody = UpsPickupRateRequest["PickupRateRequest"]["Request"];
    type FacilitiesBody =
      UpsPickupGetServiceCenterFacilitiesRequest["PickupGetServiceCenterFacilitiesRequest"]["Request"];
    type CreateBody =
      UpsPickupCreationRequest["PickupCreationRequest"]["Request"];
    const ok: [
      Accepts<RateBody, undefined>,
      Accepts<FacilitiesBody, undefined>,
      Accepts<CreateBody, undefined>,
    ] = [true, true, true];
    expect([ok, rate]).toBeDefined();
  });

  it("Paperless bodies may leave ShipperNumber to the header", () => {
    type Upload = UpsPaperlessUploadRequestWrapper["UploadRequest"];
    type Push =
      UpsPaperlessPushToImageRepositoryRequestWrapper["PushToImageRepositoryRequest"];
    const ok: [
      Accepts<Upload["ShipperNumber"], undefined>,
      Accepts<Push["ShipperNumber"], undefined>,
    ] = [true, true];
    expect(ok).toEqual([true, true]);
  });

  it("Quantum View accepts Bookmark on the subscription request and on the request", () => {
    type Req = UpsQuantumViewRequestWrapper["QuantumViewRequest"];
    type Sub = Exclude<
      NonNullable<Req["SubscriptionRequest"]>,
      readonly unknown[]
    >;
    const sub: Sub = {
      Name: "Id",
      FileName: "190722_101010001",
      Bookmark: "b",
    };
    const asArray: Req["SubscriptionRequest"] = [sub];
    expect([sub.Bookmark, asArray]).toBeDefined();
  });

  it("PreNotification, Locator and Dangerous Goods take single objects", () => {
    type PreShipment =
      UpsPreNotificationRequestWrapper["PreNotificationRequest"]["Shipment"];
    type LocatorOption = NonNullable<
      UpsLocatorRequestWrapper["LocatorRequest"]["LocationSearchCriteria"]
    >["SearchOption"];
    type DgShipment =
      UpsDangerousGoodsAcceptanceAuditPreCheckRequestWrapper["AcceptanceAuditPreCheckRequest"]["Shipment"];
    type DgRef =
      UpsDangerousGoodsChemicalReferenceDataRequestWrapper["ChemicalReferenceDataRequest"]["Request"];
    type One<T> = T extends readonly (infer U)[] ? U : never;
    const ok: [
      Accepts<PreShipment["Package"], One<PreShipment["Package"]>>,
      Accepts<DgShipment["Package"], One<DgShipment["Package"]>>,
      Accepts<DgRef, undefined>,
    ] = [true, true, true];
    const option: LocatorOption | undefined = undefined;
    expect([ok, option]).toBeDefined();
  });

  it("Time In Transit requests take the strings and empty value UPS's sample sends", () => {
    const request: UpsTimeInTransitRequest = {
      originCountryCode: "DE",
      weight: "10.5",
      shipmentContentsValue: "10.5",
      numberOfPackages: "1",
      residentialIndicator: "",
    };
    expect(request.residentialIndicator).toBe("");
  });

  it("Time In Transit responses may omit what the spec never defines", () => {
    const candidate: UpsTimeInTransitCandidateAddress = { countryName: "US" };
    type Service = UpsTimeInTransitService["saturdayDeliveryIndicator"];
    const ok: Accepts<Service, undefined> = true;
    expect([candidate, ok]).toBeDefined();
  });
});
