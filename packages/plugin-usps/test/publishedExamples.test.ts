import type { UspsInternationalPriceExtraServiceRateDetails } from "../src/requests/internationalPrices/types.js";
import type { UspsInternationalLabelRequest } from "../src/requests/internationalLabels/types.js";
import type { UspsContainerResponse } from "../src/requests/containers/types.js";
import type { UspsAddressResponse } from "../src/requests/addresses/types.js";
import type { UspsLabelMetadata } from "../src/requests/labels/types.js";
import { describe, expect, it } from "vitest";
import type {
  UspsServiceStandardEstimate,
  UspsServiceStandardResult,
} from "../src/requests/serviceStandards/types.js";
import type {
  UspsLocationDropShipmentLocation,
  UspsLocationPostOfficeResponse,
} from "../src/requests/locations/types.js";
import type {
  UspsScanFormRequest,
  UspsScanFormResponse,
} from "../src/requests/scanForms/types.js";
import type {
  UspsTrackingDetails,
  UspsTrackingSummary,
} from "../src/requests/tracking/types.js";

// Fixtures abbreviated from USPS's own examples (github.com/USPS/api-examples,
// checked 2026-11-12). Their job is to fail the type-check if a response type
// stops admitting what USPS's examples show; the runtime assertions are
// incidental. Placeholders in the source are kept as they are.

describe("types admit USPS's published examples", () => {
  it("Tracking v3 detail: display-text mailClass, string flags, nulls", () => {
    const detail: UspsTrackingDetails = {
      destinationCity: "CEDAR RAPIDS",
      emailEnabled: "true",
      kahalaIndicator: "false",
      mailClass: "Priority Mail<SUP>&reg;</SUP>",
      mailType: "DM",
      proofOfDeliveryEnabled: "false",
      restoreEnabled: "false",
      RRAMEnabled: "false",
      RREEnabled: "false",
      services: "USPS Tracking<SUP>&#174;</SUP>",
      serviceTypeCode: "14",
      trackingEvents: [
        {
          eventType: "USPS in possession of item",
          eventTimestamp: "2023-08-02T07:31:00Z",
          eventCountry: null,
          firm: null,
          name: null,
          authorizedAgent: "false",
          eventCode: "03",
          additionalProp: null,
        },
      ],
      trackingNumber: "XXXXXXXXXXXXXXXXXXXX",
    };
    expect(detail.mailClass).toContain("Priority Mail");
    // The enum values still autocomplete and still type-check.
    const constant: UspsTrackingDetails = { mailClass: "PRIORITY_MAIL" };
    expect(constant.mailClass).toBe("PRIORITY_MAIL");
    const list: UspsTrackingDetails = { services: ["a", "b"] };
    expect(list.services).toHaveLength(2);
  });

  it("Tracking v3 summary: the legacy TrackResults envelope", () => {
    const summary: UspsTrackingSummary = {
      TrackResults: {
        RequestSeqNumber: null,
        TrackInfo: { "@ID": "XXXX", TrackSummary: "USPS is now in possession" },
      },
    };
    expect(summary.TrackResults?.TrackInfo?.TrackSummary).toContain("USPS");
  });

  it("Addresses: every inapplicable field is an explicit null", () => {
    const res: UspsAddressResponse = {
      firm: null,
      address: {
        streetAddress: "3120 M ST NW",
        streetAddressAbbreviation: null,
        secondaryAddress: null,
        city: "WASHINGTON",
        cityAbbreviation: null,
        state: "DC",
        postalCode: null,
        province: null,
        ZIPCode: "20007",
        ZIPPlus4: "3704",
        urbanization: null,
        country: null,
        countryISOCode: null,
      },
      additionalInfo: { DPVConfirmation: "Y", business: "Y", vacant: "N" },
      corrections: [{ code: "", text: "" }],
      matches: [{ code: "31", text: "Single Response - exact match" }],
    };
    expect(res.address?.country).toBeNull();
  });

  it("Containers: add-packages response with a null secondaryAddress", () => {
    const res: UspsContainerResponse = {
      containerID: "99M900066875EMA000051",
      sortType: "SACK",
      destinationEntryFacilityType: "DESTINATION_DELIVERY_UNIT",
      destinationZIPCode: "06701",
      mailClass: "PARCEL_SELECT",
      originAddress: {
        streetAddress: "900 BRENTWOOD RD NE",
        secondaryAddress: null,
        city: "Washington",
        state: "DC",
        urbanization: "",
        ZIPCode: "20018",
        ZIPPlus4: "0000",
      },
      mailerName: "John Smith AC.",
      processingCategory: "MACHINABLE",
      containerTopology: "NESTED",
      warnings: [],
      MID: "XXXXXXXXX",
    };
    expect(res.originAddress.secondaryAddress).toBeNull();
  });

  it("Labels: the create and edit metadata carry parcelLockerNumber", () => {
    const metadata: UspsLabelMetadata = {
      routingInformation: "420631182628",
      postage: 7.99,
      zone: "01",
      weightUOM: "LB",
      dimensionalWeight: 0.0,
      fees: [],
      bannerText: "USPS TRACKING # USPS Ship",
      retailDistributionCode: "03",
      serviceTypeCode: "055",
      constructCode: "C01",
      parcelLockerNumber: "",
      labelBrokerID: "",
    };
    expect(metadata.parcelLockerNumber).toBe("");
  });

  it("International Prices: the extra-service response is one bare row with a string code", () => {
    const row: UspsInternationalPriceExtraServiceRateDetails = {
      SKU: "IXIP0XXXXCX0500",
      priceType: "COMMERCIAL",
      price: 19.55,
      extraService: "930",
      name: "Insurance <= $500",
      warnings: [],
    };
    const wrapped: UspsInternationalPriceExtraServiceRateDetails = {
      extraServices: [row],
    };
    expect(wrapped.extraServices?.[0].extraService).toBe("930");
  });

  it("International Labels: imageInfo carries packageNumber and totalPackages", () => {
    const imageInfo: NonNullable<UspsInternationalLabelRequest["imageInfo"]> = {
      imageType: "PDF",
      labelType: "4X6LABEL",
      packageNumber: 5,
      totalPackages: 50,
      holdForManifest: true,
    };
    expect(imageInfo.totalPackages).toBe(50);
  });

  it("Service Standards: numeric ZIPs, serviceStandard and cutOffTime, closeTimes", () => {
    const estimate: UspsServiceStandardEstimate = {
      mailClass: "PRIORITY_MAIL",
      destinationType: "HOLD_FOR_PICKUP",
      cutOffTime: 1700,
      serviceStandard: 2,
      serviceStandardMessage: "2-Day",
      acceptanceLocations: {
        facilityType: "POST OFFICE",
        streetAddress: "223 W 38TH ST",
        ZIPCode: 10018,
        ZIPPlus4: 9998,
      },
      delivery: {
        scheduledDeliveryDateTime: "2023-05-30",
        holdForPickupLocation: {
          facilityName: "PARKWAY",
          ZIPCode: 95823,
          closeTimes: {
            Monday: 1700,
            Saturday: 1500,
            Sunday: "0000",
            holidays: "0000",
          },
        },
      },
    };
    const standard: UspsServiceStandardResult = {
      mailClass: "PRIORITY_MAIL",
      originZIPCode: 10018,
      destinationZIPCode: 95823,
      days: 2,
    };
    expect(estimate.cutOffTime).toBe(1700);
    expect(standard.originZIPCode).toBe(10018);
  });

  it("Locations: the drop-off and post-office example files", () => {
    const dropoff: UspsLocationDropShipmentLocation = {
      dropShipmentKey: "K020303",
      facilityName: "ATLANTA GA RPDC",
      facilityAddress: {
        streetAddress: "600 PALMETTO LOGISTICS PKWY",
        city: "PALMETTO",
        state: "GA",
        ZIPCode: "30268",
        ZIPPlus4: "9991",
      },
      destinationZIPCode: "303",
      destinationEntryFacilityType: "DESTINATION_NETWORK_DISTRIBUTION_CENTER",
      timeZone: "US/Eastern",
      dstObserved: true,
      dropShipAcceptanceTimes: [
        {
          dayOfWeek: "MONDAY",
          times: [{ openTime: "08:30", closeTime: "16:30" }],
        },
      ],
    };
    const postOffice: UspsLocationPostOfficeResponse = {
      locations: [
        {
          facilityName: "KINGSBRIDGE",
          facilityId: "1369089",
          postOfficeType: "POST_OFFICE",
          distance: 0.2,
          DSTObserved: false,
          services: [
            {
              service: "PO_BOX_DELIVERY_TIME",
              hours: [
                { dayOfWeek: "MONDAY", times: [{ closeTime: "10:00:00" }] },
              ],
            },
          ],
        },
      ],
    };
    expect(dropoff.facilityAddress?.city).toBe("PALMETTO");
    expect(postOffice.locations?.[0].facilityId).toBe("1369089");
  });

  it("SCAN Forms: the request nests the address, the response lower-cases ZIP keys", () => {
    const request: UspsScanFormRequest = {
      imageInfo: { imageType: "PDF", labelType: "8.5X11LABEL" },
      mailingDate: "2023-04-19",
      entryFacilityZIPCode: "45011",
      entryFacilityZIPPlus4: "",
      destinationEntryFacilityType: "NONE",
      overwriteMailingDate: false,
      shipment: { trackingNumbers: ["XXXXXXXXXXXXXXXXXXXXXX"] },
      fromAddress: {
        firstName: "Leroy",
        lastName: "Brown",
        firm: "USPS",
        address: {
          streetAddress: "4261 Port Union Road",
          city: "West Chester",
          state: "OH",
          ZIPCode: "45011",
          countryISOCode: 840,
        },
      },
    };
    const response: UspsScanFormResponse = {
      manifestNumber: "XXXXXXXXXXXXXXXXXXXXXXXXXX",
      trackingNumbers: ["XXXXXXXXXXXXXXXXXXXXXX"],
      fromAddress: {
        firstName: "Leroy",
        address: { zipCode: "45011", zipPlus4: "", countryISOCode: "840" },
      },
    };
    expect(request.entryFacilityZIPPlus4).toBe("");
    expect(response.manifestNumber).toBeDefined();
  });
});
