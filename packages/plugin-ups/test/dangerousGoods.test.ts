import RequestHandler, { memoryBackend } from "@dianemo/core";
import { afterEach, describe, expect, it, vi } from "vitest";
import { resetBinding } from "@dianemo/plugin-kit/testing";
import { TEST_KEY } from "../../../test/fixtures/key.js";
import ups from "../src/index.js";
import {
  checkDangerousGoodsAcceptanceAudit,
  getDangerousGoodsChemicalReferenceData,
} from "../src/requests/dangerousGoods/index.js";

const CLIENT = "ups:_:production";

const spy = () => {
  const handler = new RequestHandler({
    key: TEST_KEY,
    backend: memoryBackend(),
  });
  const handleRequest = vi
    .spyOn(handler, "handleRequest")
    .mockResolvedValue({ data: { ok: true } } as never);
  handler.use(ups);
  return handleRequest;
};

afterEach(() => resetBinding());

describe("dangerousGoods", () => {
  it("posts chemical reference data to the v2409 path with the body as data", async () => {
    const handleRequest = spy();
    const body = {
      ChemicalReferenceDataRequest: { IDNumber: "UN1088" },
    } as never;
    await getDangerousGoodsChemicalReferenceData(CLIENT, body);
    expect(handleRequest.mock.calls[0][0]).toMatchObject({
      clientName: CLIENT,
      requestName: "ups.dangerousGoods.getDangerousGoodsChemicalReferenceData",
      method: "POST",
      url: "/api/dangerousgoods/v2409/chemicalreferencedata",
      data: body,
    });
  });

  it("posts the acceptance audit pre-check to the v2 path", async () => {
    const handleRequest = spy();
    const body = { AcceptanceAuditPreCheckRequest: {} } as never;
    await checkDangerousGoodsAcceptanceAudit(CLIENT, body);
    expect(handleRequest.mock.calls[0][0]).toMatchObject({
      clientName: CLIENT,
      requestName: "ups.dangerousGoods.checkDangerousGoodsAcceptanceAudit",
      method: "POST",
      url: "/api/dangerousgoods/v2/acceptanceauditprecheck",
      data: body,
    });
  });
});
