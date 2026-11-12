import RequestHandler, { memoryBackend } from "@dianemo/core";
import { afterEach, describe, expect, it, vi } from "vitest";
import { resetBinding } from "@dianemo/plugin-kit/testing";
import { TEST_KEY } from "../../../test/fixtures/key.js";
import usps from "../src/index.js";
import {
  generateServiceStandardsFileSignedUrl,
  getServiceStandards,
  getServiceStandardsDirectory,
  getServiceStandardsDirectoryZip5Codes,
  getServiceStandardsEstimates,
  listServiceStandardsFiles,
} from "../src/requests/serviceStandards/index.js";
import type {
  UspsServiceStandardDirectoryRequest,
  UspsServiceStandardEstimatesParams,
  UspsServiceStandardsParams,
} from "../src/requests/serviceStandards/types.js";

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
    .mockResolvedValue({ data: [] } as never);
  handler.use(usps);
  return spy;
};

describe("usps serviceStandards", () => {
  it("getServiceStandardsEstimates sends every query parameter", async () => {
    const spy = setup();
    const params: UspsServiceStandardEstimatesParams = {
      originZIPCode: "503",
      destinationZIPCode: "10001",
      acceptanceDate: "2026-11-20",
      acceptanceTime: "0900",
      mailClass: "PRIORITY_MAIL",
      weight: 2,
      weightUOM: "lb",
      length: 10,
      width: 8,
      height: 4,
      dimensionsUOM: "in",
      presort: false,
    };
    await getServiceStandardsEstimates(CLIENT, params);
    const req = spy.mock.calls[0][0];
    expect(req.clientName).toBe(GROUP);
    expect(req.requestName).toBe(
      "usps.serviceStandards.getServiceStandardsEstimates"
    );
    expect(req.method).toBe("GET");
    expect(req.url).toBe("/service-standards/v3/estimates");
    expect(req.params).toEqual(params);
  });

  it("getServiceStandards sends the query to /standards", async () => {
    const spy = setup();
    const params: UspsServiceStandardsParams = {
      originZIPCode: "50314",
      destinationZIPCode: "10001",
      destinationType: "PO_BOX",
    };
    await getServiceStandards(CLIENT, params);
    const req = spy.mock.calls[0][0];
    expect(req.clientName).toBe(GROUP);
    expect(req.requestName).toBe("usps.serviceStandards.getServiceStandards");
    expect(req.method).toBe("GET");
    expect(req.url).toBe("/service-standards/v3/standards");
    expect(req.params).toEqual(params);
  });

  it("getServiceStandardsDirectoryZip5Codes takes no parameters", async () => {
    const spy = setup();
    await getServiceStandardsDirectoryZip5Codes(CLIENT);
    const req = spy.mock.calls[0][0];
    expect(req.clientName).toBe(GROUP);
    expect(req.requestName).toBe(
      "usps.serviceStandards.getServiceStandardsDirectoryZip5Codes"
    );
    expect(req.method).toBe("GET");
    expect(req.url).toBe("/service-standards-directory/v3/zip5Codes");
    expect(req.params).toBeUndefined();
    expect(req.data).toBeUndefined();
  });

  it("getServiceStandardsDirectory posts the body to /reporter", async () => {
    const spy = setup();
    const body: UspsServiceStandardDirectoryRequest = {
      originZIPCode: "230-245",
      destinationZIPCode: "123,124",
      responseFormat: "3D_BASE",
      mailClass: "PERIODICALS",
      offset: 0,
      limit: 100,
      returnUnsupportedZIPCodes: true,
    };
    await getServiceStandardsDirectory(CLIENT, body);
    const req = spy.mock.calls[0][0];
    expect(req.clientName).toBe(GROUP);
    expect(req.requestName).toBe(
      "usps.serviceStandards.getServiceStandardsDirectory"
    );
    expect(req.method).toBe("POST");
    expect(req.url).toBe("/service-standards-directory/v3/reporter");
    expect(req.data).toEqual(body);
    expect(req.params).toBeUndefined();
  });

  it("listServiceStandardsFiles lists under the files prefix", async () => {
    const spy = setup();
    await listServiceStandardsFiles(CLIENT);
    const req = spy.mock.calls[0][0];
    expect(req.clientName).toBe(GROUP);
    expect(req.requestName).toBe(
      "usps.serviceStandards.listServiceStandardsFiles"
    );
    expect(req.method).toBe("GET");
    expect(req.url).toBe("/service-standards-files/v3/files");
  });

  it("generateServiceStandardsFileSignedUrl encodes the file id into the path", async () => {
    const spy = setup();
    await generateServiceStandardsFileSignedUrl(CLIENT, { fileID: "a b/c" });
    const req = spy.mock.calls[0][0];
    expect(req.clientName).toBe(GROUP);
    expect(req.requestName).toBe(
      "usps.serviceStandards.generateServiceStandardsFileSignedUrl"
    );
    expect(req.method).toBe("GET");
    expect(req.url).toBe(
      "/service-standards-files/v3/files/a%20b%2Fc/generate-signed-url"
    );
  });
});
