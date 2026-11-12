import type { UspsNcoaChangeOfAddressSearchRequest } from "../src/requests/ncoaDataServices/types.js";
import * as ncoa from "../src/requests/ncoaDataServices/index.js";
import RequestHandler, { memoryBackend } from "@dianemo/core";
import { afterEach, describe, expect, it, vi } from "vitest";
import { resetBinding } from "@dianemo/plugin-kit/testing";
import { TEST_KEY } from "../../../test/fixtures/key.js";
import usps from "../src/index.js";

afterEach(() => resetBinding());

describe("usps ncoaDataServices", () => {
  it("searchUspsChangeOfAddress posts the search on the default group", async () => {
    const handler = new RequestHandler({
      key: TEST_KEY,
      backend: memoryBackend(),
    });
    const spy = vi
      .spyOn(handler, "handleRequest")
      .mockResolvedValue({ data: { recordCount: 1, records: [] } } as never);
    handler.use(usps);

    const data: UspsNcoaChangeOfAddressSearchRequest = {
      CRID: "123456789",
      IPAgreementID: "4440000",
      requestType: "Search",
      nameAddresses: [
        { fullName: "JOHNNY APPLESEED", lastLine: "Anytown PA 22222" },
      ],
      numberOfMonths: 6,
    };
    const res = await ncoa.searchUspsChangeOfAddress("usps:_:main", data);
    expect(res).toEqual({ recordCount: 1, records: [] });
    expect(spy.mock.calls[0][0]).toMatchObject({
      clientName: "usps:_:main:default",
      requestName: "usps.ncoaDataServices.searchUspsChangeOfAddress",
      method: "POST",
      url: "/ncoa-data-services/v3/search",
      data,
    });
    expect(spy.mock.calls[0][0].metadata).toBeUndefined();
  });
});
