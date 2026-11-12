import * as forwarding from "../src/requests/forwarding/index.js";
import RequestHandler, { memoryBackend } from "@dianemo/core";
import { afterEach, describe, expect, it, vi } from "vitest";
import { resetBinding } from "@dianemo/plugin-kit/testing";
import { TEST_KEY } from "../../../test/fixtures/key.js";
import ups from "../src/index.js";

const CLIENT = "ups:_:production";
const FWD = "ups:_:production:forwarding";
const BASE = "/api/forwarding/v1";
const GUID = "0123456789abcdef0123456789abcdef";
const h = { businessGuid: GUID, clientId: "client-1" };
const WIRE_HEADERS = {
  "Content-Type": "application/json",
  "X-BusinessGUID": GUID,
  "X-ClientId": "client-1",
};

afterEach(() => resetBinding());

function spied() {
  const handler = new RequestHandler({
    key: TEST_KEY,
    backend: memoryBackend(),
  });
  const spy = vi
    .spyOn(handler, "handleRequest")
    .mockResolvedValue({ data: { ok: true } } as never);
  handler.use(ups);
  return spy;
}

const body = (extra: object = {}) => ({ ...extra }) as never;

interface Case {
  name: string;
  call: () => Promise<unknown>;
  method: string;
  url: string;
  params?: Record<string, unknown>;
  data?: unknown;
}

const cases: Case[] = [
  {
    name: "getForwardingShipmentRates",
    call: () =>
      forwarding.getForwardingShipmentRates(CLIENT, h, body({ a: 1 })),
    method: "POST",
    url: "/shipments/rates",
    data: { a: 1 },
  },
  {
    name: "createForwardingOrder",
    call: () => forwarding.createForwardingOrder(CLIENT, h, body({ a: 1 })),
    method: "POST",
    url: "/orders",
    data: { a: 1 },
  },
  {
    name: "cancelForwardingOrder",
    call: () =>
      forwarding.cancelForwardingOrder(CLIENT, h, body({ orderNumber: "1" })),
    method: "DELETE",
    url: "/orders",
    data: { orderNumber: "1" },
  },
  {
    name: "setForwardingOrderDate",
    call: () =>
      forwarding.setForwardingOrderDate(
        CLIENT,
        {
          ...h,
          shipperAccountNumber: "123456789",
          orderNumber: "3912088430001",
        },
        [{ op: "replace", path: "/shipDate", value: "2026-12-01" }]
      ),
    method: "PATCH",
    url: "/orders",
    params: {
      shipper_account_number: "123456789",
      order_number: "3912088430001",
      old_date: undefined,
      language: undefined,
    },
    data: [{ op: "replace", path: "/shipDate", value: "2026-12-01" }],
  },
  {
    name: "createForwardingLabel",
    call: () =>
      forwarding.createForwardingLabel(CLIENT, h, body({ format: "PDF" })),
    method: "POST",
    url: "/documents/labels",
    data: { format: "PDF" },
  },
  {
    name: "submitForwardingOrderShipments",
    call: () =>
      forwarding.submitForwardingOrderShipments(
        CLIENT,
        { ...h, shipperAccountNumber: "123456789", manifestFormat: "DATA" },
        [{ op: "replace", path: "/x", value: "y" }]
      ),
    method: "PATCH",
    url: "/shipments",
    params: {
      shipper_account_number: "123456789",
      pickup_date: undefined,
      request_manifest: undefined,
      manifest_format: "DATA",
    },
    data: [{ op: "replace", path: "/x", value: "y" }],
  },
  {
    name: "cancelForwardingShipment",
    call: () => forwarding.cancelForwardingShipment(CLIENT, h, body({ s: 1 })),
    method: "DELETE",
    url: "/shipments",
    data: { s: 1 },
  },
  {
    name: "createForwardingShipment",
    call: () => forwarding.createForwardingShipment(CLIENT, h, body({ s: 1 })),
    method: "POST",
    url: "/shipments",
    data: { s: 1 },
  },
  {
    name: "getForwardingShipmentDetails",
    call: () =>
      forwarding.getForwardingShipmentDetails(CLIENT, {
        ...h,
        requestType: "Air",
        shipmentId: "200025511",
      }),
    method: "GET",
    url: "/shipments",
    params: { request_type: "Air", shipment_id: "200025511" },
  },
  {
    name: "createForwardingManifest",
    call: () => forwarding.createForwardingManifest(CLIENT, h, body({ m: 1 })),
    method: "POST",
    url: "/documents/manifests",
    data: { m: 1 },
  },
  {
    name: "getForwardingCities",
    call: () =>
      forwarding.getForwardingCities(CLIENT, {
        ...h,
        country: "US",
        postal: "30301",
      }),
    method: "GET",
    url: "/info/cities",
    params: {
      shipper_account_number: undefined,
      country: "US",
      city: undefined,
      criteria_operator: undefined,
      postal: "30301",
    },
  },
  {
    name: "getForwardingCurrencies",
    call: () => forwarding.getForwardingCurrencies(CLIENT, h),
    method: "GET",
    url: "/info/currencies",
    params: { shipper_account_number: undefined },
  },
  {
    name: "getForwardingPaymentTypes",
    call: () =>
      forwarding.getForwardingPaymentTypes(CLIENT, {
        ...h,
        shipperAccountNumber: "123456789",
        incotermCode: "FOB",
      }),
    method: "GET",
    url: "/info/payment-types",
    params: {
      shipper_account_number: "123456789",
      code: undefined,
      incoterm_code: "FOB",
      movement_type_code: undefined,
      origin_country_code: undefined,
      destination_country_code: undefined,
      service_line: undefined,
    },
  },
  {
    name: "getForwardingCountries",
    call: () => forwarding.getForwardingCountries(CLIENT, h),
    method: "GET",
    url: "/info/countries",
    params: { shipper_account_number: undefined },
  },
  {
    name: "getForwardingAirports",
    call: () =>
      forwarding.getForwardingAirports(CLIENT, { ...h, countryCode: "US" }),
    method: "GET",
    url: "/info/airports",
    params: { country_code: "US" },
  },
  {
    name: "getForwardingServiceTypes",
    call: () =>
      forwarding.getForwardingServiceTypes(CLIENT, {
        ...h,
        consigneeCountryCode: "GB",
        shipperPostalCode: "30301",
      }),
    method: "GET",
    url: "/info/service-types",
    params: {
      shipper_city: undefined,
      shipper_state_code: undefined,
      shipper_postal_code: "30301",
      shipper_country_code: undefined,
      consignee_city: undefined,
      consignee_state_code: undefined,
      consignee_postal_code: undefined,
      consignee_country_code: "GB",
      shipper_account_number: undefined,
    },
  },
  {
    name: "getForwardingAccessorials",
    call: () => forwarding.getForwardingAccessorials(CLIENT, h, body({ x: 1 })),
    method: "POST",
    url: "/info/accessorials",
    data: { x: 1 },
  },
  {
    name: "createForwardingQuote",
    call: () => forwarding.createForwardingQuote(CLIENT, h, body({ q: 1 })),
    method: "POST",
    url: "/quotes",
    data: { q: 1 },
  },
  {
    name: "searchForwardingQuotes",
    call: () =>
      forwarding.searchForwardingQuotes(CLIENT, {
        ...h,
        requestType: "Ocean",
        quoteId: "AEA10004706",
      }),
    method: "GET",
    url: "/quotes",
    params: { request_type: "Ocean", quote_id: "AEA10004706" },
  },
  {
    name: "bookForwardingQuote",
    call: () => forwarding.bookForwardingQuote(CLIENT, h, body({ b: 1 })),
    method: "PATCH",
    url: "/quotes",
    data: { b: 1 },
  },
  {
    name: "getForwardingShipmentMilestones",
    call: () =>
      forwarding.getForwardingShipmentMilestones(CLIENT, {
        ...h,
        businessId: "B1",
        upsShipmentNumber: "SHIP1",
      }),
    method: "GET",
    url: "/shipments/milestones",
    params: {
      business_id: "B1",
      ups_file_number: undefined,
      ups_office: undefined,
      ups_shipment_number: "SHIP1",
    },
  },
];

describe("ups forwarding: request shape", () => {
  it.each(cases)("$name", async ({ name, call, method, url, params, data }) => {
    const spy = spied();
    await call();
    const config = spy.mock.calls[0][0];
    expect(config.clientName).toBe(FWD);
    expect(config.requestName).toBe(`ups.forwarding.${name}`);
    expect(config.method).toBe(method);
    expect(config.url).toBe(`${BASE}${url}`);
    expect(config.headers).toEqual(WIRE_HEADERS);
    expect(config.params).toEqual(params);
    expect(config.data).toEqual(data);
  });

  it("searchForwardingOrders flattens the deepObject criteria", async () => {
    const spy = spied();
    await forwarding.searchForwardingOrders(CLIENT, {
      ...h,
      criteria: {
        shipperAccountNumber: "123456789",
        criteriaList: [
          {
            criteriaField: "ORDER_STATUS",
            criteriaOperator: "EQ",
            criteriaValue: "5",
          },
          {
            criteriaField: "SHIP_DATE",
            criteriaOperator: "BTWN",
            criteriaValue: "2025-10-06",
            criteriaValue2: "2025-10-07",
          },
        ],
      },
    });
    const config = spy.mock.calls[0][0];
    expect(config.clientName).toBe(FWD);
    expect(config.requestName).toBe("ups.forwarding.searchForwardingOrders");
    expect(config.method).toBe("GET");
    expect(config.url).toBe(`${BASE}/orders`);
    expect(config.data).toBeUndefined();
    expect(config.params).toEqual({
      "criteria[shipperAccountNumber]": "123456789",
      "criteria[criteriaList][0][criteriaField]": "ORDER_STATUS",
      "criteria[criteriaList][0][criteriaOperator]": "EQ",
      "criteria[criteriaList][0][criteriaValue]": "5",
      "criteria[criteriaList][1][criteriaField]": "SHIP_DATE",
      "criteria[criteriaList][1][criteriaOperator]": "BTWN",
      "criteria[criteriaList][1][criteriaValue]": "2025-10-06",
      "criteria[criteriaList][1][criteriaValue2]": "2025-10-07",
    });
  });

  it("getForwardingDocuments asks for bytes", async () => {
    const spy = spied();
    await forwarding.getForwardingDocuments(CLIENT, {
      ...h,
      shipmentNumber: "S1",
      shipmentAccountNumber: "123456789",
      shipmentType: "Air",
      docType: "All",
    });
    const config = spy.mock.calls[0][0];
    expect(config.clientName).toBe(FWD);
    expect(config.requestName).toBe("ups.forwarding.getForwardingDocuments");
    expect(config.method).toBe("GET");
    expect(config.url).toBe(`${BASE}/documents`);
    expect(config.responseType).toBe("arraybuffer");
    expect(config.params).toEqual({
      shipment_number: "S1",
      shipment_account_number: "123456789",
      shipment_type: "Air",
      doc_type: "All",
    });
  });

  it("uploadForwardingDocument posts multipart with no Content-Type of ours", async () => {
    const spy = spied();
    const bytes = new Uint8Array([1, 2, 3]);
    await forwarding.uploadForwardingDocument(CLIENT, {
      ...h,
      accountNumber: "123456789",
      shipmentNumber: "S1",
      documentType: "CommercialInvoice",
      document: bytes,
      fileName: "inv.pdf",
    });
    const config = spy.mock.calls[0][0];
    expect(config.clientName).toBe(FWD);
    expect(config.requestName).toBe("ups.forwarding.uploadForwardingDocument");
    expect(config.method).toBe("POST");
    expect(config.url).toBe(`${BASE}/documents`);
    expect(config.headers).toEqual({
      "X-BusinessGUID": GUID,
      "X-ClientId": "client-1",
    });
    const form = config.data as FormData;
    expect(form).toBeInstanceOf(FormData);
    expect(form.get("AccountNumber")).toBe("123456789");
    expect(form.get("ShipmentNumber")).toBe("S1");
    expect(form.get("DocumentType")).toBe("CommercialInvoice");
    const file = form.get("DocumentToUpload") as File;
    expect(file.name).toBe("inv.pdf");
    expect(file.type).toBe("application/pdf");
    expect(new Uint8Array(await file.arrayBuffer())).toEqual(bytes);
  });
});
