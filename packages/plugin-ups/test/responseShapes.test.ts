import { describe, expect, it } from "vitest";
import type {
  UpsCustomsDetailError,
  UpsCustomsDetailField,
  UpsDeliveryInterceptChargesResponseV2,
  UpsDeliveryInterceptEligibilityOptionsResponseV2,
  UpsExportAssurePowerOfAttorneyResponse,
  UpsForwardingAirShipResponseV1,
  UpsForwardingAirShipmentDataResponseV1,
  UpsForwardingCountryCodeResponseV1,
  UpsForwardingPaymentTypeResponseV1,
  UpsForwardingQuoteDataResponseV1,
  UpsLandedCostResponse,
  UpsSmartPickupRequestV1,
} from "../src/index.js";

/**
 * Each literal is the shape of an example embedded in UPS's OpenAPI spec, so the
 * assertion is the type check `vitest --typecheck` runs over this file: a type
 * that stops admitting the example fails here — docs/ups-api.md#forwarding-response-nesting
 */
describe("response types admit the spec's own examples", () => {
  it("Forwarding POST /shipments nests its fields in `response`", () => {
    const res: UpsForwardingAirShipResponseV1 = {
      response: {
        shipmentNumber: "9400178326",
        prqNumber: "174190020",
        rates: [
          {
            serviceType: "EC",
            totalCharge: { amount: 5399.04, currencyCode: "GBP" },
            charges: [{ code: "FAS", amount: 3088.59, includedInd: "N" }],
          },
        ],
        airWaybillDocument: null,
        label: { format: "PDF", layout: null, image: null },
      },
    };
    expect(res.response.rates?.[0].serviceType).toBe("EC");
  });

  it("Forwarding lookups are wrapped, and payment types list `paymentTypes`", () => {
    const countries: UpsForwardingCountryCodeResponseV1 = {
      response: { countries: [{ countryCode: "US" }], message: "ok" },
    };
    const payments: UpsForwardingPaymentTypeResponseV1 = {
      response: { paymentTypes: [{ code: "PPD", type: "SHPR" }] },
    };
    expect(countries.response?.countries?.[0].countryCode).toBe("US");
    expect(payments.response?.paymentTypes?.[0].code).toBe("PPD");
  });

  it("Forwarding PATCH /shipments allows a null `response` and a null warning", () => {
    const res: UpsForwardingAirShipmentDataResponseV1 = {
      response: null,
      account: "0009XXXXX",
      manifestPDF: "JVBERi0x",
      message: "Shipments submitted successfully.",
    };
    const warned: UpsForwardingAirShipmentDataResponseV1 = {
      response: { warnings: [null], code: "5275", message: "m" },
    };
    expect(res.response).toBeNull();
    expect(warned.response?.code).toBe("5275");
  });

  it("Forwarding GET /quotes allows nulls and an open paymentTerm", () => {
    const res: UpsForwardingQuoteDataResponseV1 = {
      response: {
        quoteSummary: {
          portOfLoad: null,
          originPort: null,
          pricingDetail: null,
          paymentTerm: { type: "COL", code: "CONS" },
          chargeDetails: [
            { charges: [{ chargeType: "x", originalChargeAmount: null }] },
          ],
          shipmentDetails: {
            commodityName: null,
            fclCargoItems: null,
            airCargoItems: null,
            location: null,
            lclCargoItems: [
              {
                quantity: 100,
                weightDetail: { weight: 30, unitOfMeasurement: "KG" },
              },
            ],
          },
        },
      },
    };
    expect(res.response.quoteSummary.paymentTerm?.type).toBe("COL");
  });

  it("Landed Cost types both spellings and a request without alversion", () => {
    const res: UpsLandedCostResponse = {
      shipment: {
        currencyCode: "GBP",
        importCountryCode: "GB",
        id: "1",
        brokerageFeeItems: [],
        totalBrokerageFees: 1,
        totalDuties: 1,
        totalCommodityLevelTaxesAndFees: 0,
        totalShipmentLevelTaxesAndFees: 0,
        totalVAT: 1,
        totalDutyandTax: 762,
        grandTotal: 1,
        shipmentItems: [
          {
            commodityId: "1",
            hsCode: "4009320090",
            commodityDuty: 60,
            totalCommodityTaxesAndFees: 0,
            commodityVAT: 612,
            totalCommodityDutyandTax: 672,
            commodityCurrencyCode: "GBP",
            isCalculable: true,
          },
        ],
      },
    };
    expect(res.shipment.totalDutyandTax).toBe(762);
  });

  it("Delivery Intercept admits a null eligibility map and the charge totals", () => {
    const eligibility: UpsDeliveryInterceptEligibilityOptionsResponseV2 = {
      response: {
        transactionId: "t",
        statusCode: "500",
        statusMsg: "ERROR",
        success: false,
        commonEligibilityMap: null,
      },
    };
    const charges: Partial<UpsDeliveryInterceptChargesResponseV2["response"]> =
      { addrToken: "2", grandTotalCharge: "", preTaxGrandTotal: "" };
    expect(eligibility.response.commonEligibilityMap).toBeNull();
    expect(charges.addrToken).toBe("2");
  });

  it("Export Assure admits boolean POA indicators", () => {
    const poa: UpsExportAssurePowerOfAttorneyResponse = {
      importerPoaRequiredFlag: true,
      importerPoaOnFileIndicator: false,
      exporterPoaRequiredFlag: true,
      exporterPoaOnFileIndicator: true,
      exporterOnlineFormFlag: false,
    };
    expect(poa.exporterPoaOnFileIndicator).toBe(true);
  });

  it("Smart Pickup accepts the schema's typo and the examples' spelling", () => {
    const typo: UpsSmartPickupRequestV1 = {
      SmartPickupRequest: {
        Action: "I",
        AccountInfo: { AccountNmber: "3308FF" },
      },
    };
    const spelled: UpsSmartPickupRequestV1 = {
      SmartPickupRequest: {
        Action: "I",
        AccountInfo: { AccountNumber: "3308FF" },
      },
    };
    expect(typo.SmartPickupRequest.AccountInfo.AccountNmber).toBe("3308FF");
    expect(spelled.SmartPickupRequest.AccountInfo.AccountNumber).toBe("3308FF");
  });

  it("Customs Detail admits a null tooltip and an error description", () => {
    const tooltip: Pick<UpsCustomsDetailField, "tooltip"> = { tooltip: null };
    const err: UpsCustomsDetailError = {
      code: "105.004",
      message: "Field value is required",
      description: "VALUE_REQUIRED",
    };
    expect(tooltip.tooltip).toBeNull();
    expect(err.description).toBe("VALUE_REQUIRED");
  });
});
