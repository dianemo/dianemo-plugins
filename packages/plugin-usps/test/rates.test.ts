import { afterEach, describe, expect, expectTypeOf, it, vi } from "vitest";
import RequestHandler, { memoryBackend } from "@dianemo/core";
import { resetBinding } from "@dianemo/plugin-kit/testing";
import { TEST_KEY } from "../../../test/fixtures/key.js";
import usps from "../src/index.js";
import {
  getBaseRatesList,
  getTotalRates,
  searchBaseRates,
  searchExtraServiceRates,
  searchLetterRates,
} from "../src/requests/rates/index.js";
import type {
  UspsBaseRatesListQuery,
  UspsRateBaseRatesQuery,
  UspsRateExtraServiceQuery,
  UspsRateExtraServiceResult,
  UspsRateExtraServiceSearchQuery,
  UspsRateExtraServiceSingleQuery,
  UspsRateExtraServiceSingleResult,
  UspsRateLetterQuery,
  UspsRateLetterResult,
  UspsTotalRatesQuery,
} from "../src/requests/rates/types.js";

afterEach(() => resetBinding());

const CLIENT = "usps:_:main";
const GROUP = "usps:_:main:default";

const setup = () => {
  const handler = new RequestHandler({
    key: TEST_KEY,
    backend: memoryBackend(),
  });
  const spy = vi
    .spyOn(handler, "handleRequest")
    .mockResolvedValue({ data: { ok: true } } as never);
  handler.use(usps);
  return spy;
};

const listQuery: UspsBaseRatesListQuery = {
  originZIPCode: "50314",
  destinationZIPCode: "10001",
  weight: 2,
  length: 10,
  width: 8,
  height: 4,
};
const totalQuery: UspsTotalRatesQuery = {
  ...listQuery,
  priceType: "RETAIL",
  extraServices: [920],
  itemValue: 50,
};
const baseQuery: UspsRateBaseRatesQuery = {
  ...listQuery,
  mailClass: "PRIORITY_MAIL",
  processingCategory: "MACHINABLE",
  rateIndicator: "SP",
  destinationEntryFacilityType: "NONE",
  priceType: "RETAIL",
};
const extraQuery: UspsRateExtraServiceSearchQuery = {
  mailClass: "PRIORITY_MAIL",
  priceType: "RETAIL",
  extraServices: [920, 930],
  itemValue: 100,
};
const letterQuery: UspsRateLetterQuery = {
  weight: 1,
  length: 9,
  height: 4,
  thickness: 0.01,
  processingCategory: "LETTERS",
  extraServices: [910],
};

describe("usps rates", () => {
  it.each([
    [
      "getTotalRates",
      getTotalRates,
      totalQuery,
      "usps.rates.totalSearch",
      "/prices/v3/total-rates/search",
    ],
    [
      "getBaseRatesList",
      getBaseRatesList,
      listQuery,
      "usps.rates.baseListSearch",
      "/prices/v3/base-rates-list/search",
    ],
    [
      "searchBaseRates",
      searchBaseRates,
      baseQuery,
      "usps.rates.searchBaseRates",
      "/prices/v3/base-rates/search",
    ],
    [
      "searchExtraServiceRates",
      searchExtraServiceRates,
      extraQuery,
      "usps.rates.searchExtraServiceRates",
      "/prices/v3/extra-service-rates/search",
    ],
    [
      "searchLetterRates",
      searchLetterRates,
      letterQuery,
      "usps.rates.searchLetterRates",
      "/prices/v3/letter-rates/search",
    ],
  ] as const)(
    "%s posts its body to the default group",
    async (_name, fn, body, requestName, url) => {
      const spy = setup();
      await (fn as (c: string, d: typeof body) => Promise<unknown>)(
        CLIENT,
        body
      );
      const req = spy.mock.calls[0][0];
      expect(req.clientName).toBe(GROUP);
      expect(req.requestName).toBe(requestName);
      expect(req.method).toBe("POST");
      expect(req.url).toBe(url);
      expect(req.data).toEqual(body);
      expect(req.params).toBeUndefined();
      expect(req.metadata?.uspsAccountNumber).toBeUndefined();
    }
  );
  it("searchExtraServiceRates takes the README's singular extraService and returns its single object", async () => {
    const handler = new RequestHandler({
      key: TEST_KEY,
      backend: memoryBackend(),
    });
    // USPS's README example response: one object, lower-case `sku`.
    const example: UspsRateExtraServiceSingleResult = {
      extraService: "415",
      name: "Label Delivery",
      sku: "DXQX0XXXXCX0000",
      priceType: "RETAIL",
      price: 1.25,
      warnings: [],
    };
    const spy = vi
      .spyOn(handler, "handleRequest")
      .mockResolvedValue({ data: example } as never);
    handler.use(usps);
    const single: UspsRateExtraServiceSingleQuery = {
      extraService: 415,
      mailClass: "PARCEL_SELECT",
      priceType: "RETAIL",
      itemValue: 0,
      weight: 5,
      mailingDate: "2023-05-25",
      accountType: "EPS",
      accountNumber: "XXXXXXXXXX",
    };
    const res = await searchExtraServiceRates(CLIENT, single);
    expect(res).toEqual(example);
    expect(spy.mock.calls[0][0].data).toEqual(single);
    // The array query keeps the spec's array type.
    const arrayRes = await searchExtraServiceRates(
      CLIENT,
      extraQuery as UspsRateExtraServiceQuery
    );
    expectTypeOf(arrayRes).toEqualTypeOf<UspsRateExtraServiceResult>();
  });

  it("types USPS's letter-rates example, which has null zone and dimWeight", () => {
    const example: UspsRateLetterResult = {
      totalBasePrice: 1.75,
      rates: [
        {
          SKU: "DFLL0XXXXR00035",
          description: "First Class Letter Metered",
          priceType: "RETAIL",
          price: 1.35,
          weight: 3.5,
          dimWeight: null,
          fees: [{ name: "Nonmachinable letter fee", SKU: "N/A", price: 0.4 }],
          startDate: "2023-07-09",
          endDate: "",
          warnings: [],
          mailClass: "USPS_GROUND_ADVANTAGE",
          zone: null,
        },
      ],
    };
    expect(example.rates?.[0].zone).toBeNull();
  });
});
