import RequestHandler, { memoryBackend } from "@dianemo/core";
import { afterEach, describe, expect, it, vi } from "vitest";
import { resetBinding } from "@dianemo/plugin-kit/testing";
import { TEST_KEY } from "../../../test/fixtures/key.js";
import ups from "../src/index.js";
import {
  deletePaperlessDocument,
  pushPaperlessDocumentImage,
  uploadPaperlessDocument,
} from "../src/requests/paperlessDocuments/index.js";

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

describe("paperlessDocuments", () => {
  it("uploads with ShipperNumber as a header and the body as data", async () => {
    const handleRequest = spy();
    const body = { UploadRequest: {} } as never;
    await uploadPaperlessDocument(CLIENT, { shipperNumber: "A1B2C3" }, body);
    expect(handleRequest.mock.calls[0][0]).toMatchObject({
      clientName: CLIENT,
      requestName: "ups.paperlessDocuments.uploadPaperlessDocument",
      method: "POST",
      url: "/api/paperlessdocuments/v2/upload",
      headers: { ShipperNumber: "A1B2C3" },
      data: body,
    });
  });

  it("pushes an image with ShipperNumber as a header and the body as data", async () => {
    const handleRequest = spy();
    const body = { PushToImageRepositoryRequest: {} } as never;
    await pushPaperlessDocumentImage(CLIENT, { shipperNumber: "A1B2C3" }, body);
    expect(handleRequest.mock.calls[0][0]).toMatchObject({
      clientName: CLIENT,
      requestName: "ups.paperlessDocuments.pushPaperlessDocumentImage",
      method: "POST",
      url: "/api/paperlessdocuments/v2/image",
      headers: { ShipperNumber: "A1B2C3" },
      data: body,
    });
  });

  it("deletes on the literal DocumentId/ShipperNumber path, values as headers, no body", async () => {
    const handleRequest = spy();
    await deletePaperlessDocument(CLIENT, {
      shipperNumber: "A1B2C3",
      documentId: "2013-12-04-00.15.38.207814",
    });
    const config = handleRequest.mock.calls[0][0];
    expect(config).toMatchObject({
      clientName: CLIENT,
      requestName: "ups.paperlessDocuments.deletePaperlessDocument",
      method: "DELETE",
      url: "/api/paperlessdocuments/v2/DocumentId/ShipperNumber",
      headers: {
        ShipperNumber: "A1B2C3",
        DocumentId: "2013-12-04-00.15.38.207814",
      },
    });
    expect(config.data).toBeUndefined();
  });
});
