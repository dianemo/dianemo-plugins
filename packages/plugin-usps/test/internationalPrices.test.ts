import * as prices from "../src/requests/internationalPrices/index.js";
import RequestHandler, { memoryBackend } from "@dianemo/core";
import { afterEach, describe, expect, it, vi } from "vitest";
import { resetBinding } from "@dianemo/plugin-kit/testing";
import { TEST_KEY } from "../../../test/fixtures/key.js";
import usps from "../src/index.js";

afterEach(() => resetBinding());

const CLIENT = "usps:_:main";

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

const list = {
  originZIPCode: "02110",
  destinationCountryCode: "FR",
  weight: 2,
  length: 5,
  width: 5,
  height: 5,
};

const CASES = [
  [
    "searchInternationalBaseRates",
    "base-rates",
    {
      ...list,
      mailClass: "PRIORITY_MAIL_INTERNATIONAL",
      processingCategory: "MACHINABLE",
      rateIndicator: "SP",
      destinationEntryFacilityType: "NONE",
      priceType: "RETAIL",
    },
  ],
  [
    "searchInternationalExtraServiceRates",
    "extra-service-rates",
    {
      mailClass: "PRIORITY_MAIL_INTERNATIONAL",
      priceType: "RETAIL",
      weight: 2,
      rateIndicator: "SP",
      destinationCountryCode: "FR",
    },
  ],
  ["searchInternationalBaseRatesList", "base-rates-list", list],
  ["searchInternationalTotalRates", "total-rates", { ...list, itemValue: 40 }],
  [
    "searchInternationalLetterRates",
    "letter-rates",
    {
      weight: 1,
      length: 9,
      height: 4,
      thickness: 0.1,
      processingCategory: "LETTERS",
      destinationCountryCode: "FR",
    },
  ],
] as const;

describe("usps internationalPrices", () => {
  it.each(CASES)(
    "%s posts the query to the default group",
    async (name, path, body) => {
      const spy = setup();
      const fn = prices[name] as (c: string, d: never) => Promise<unknown>;
      await fn(CLIENT, body as never);
      expect(spy.mock.calls[0][0]).toMatchObject({
        clientName: "usps:_:main:default",
        requestName: `usps.internationalPrices.${name}`,
        method: "POST",
        url: `/international-prices/v3/${path}/search`,
        data: body,
      });
      expect(spy.mock.calls[0][0].metadata).toBeUndefined();
    }
  );
});
