import RequestHandler, { memoryBackend } from "@dianemo/core";
import { afterEach, describe, expect, it, vi } from "vitest";
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
  UspsRateExtraServiceSearchQuery,
  UspsRateLetterQuery,
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
});
