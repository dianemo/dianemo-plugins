import RequestHandler, { memoryBackend } from "@dianemo/core";
import { afterEach, describe, expect, it, vi } from "vitest";
import * as api from "../src/requests/appointments/index.js";
import { resetBinding } from "@dianemo/plugin-kit/testing";
import { TEST_KEY } from "../../../test/fixtures/key.js";
import usps from "../src/index.js";

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

const APPT = "/fast-appointments/v3/fast-appointments/appointment";
const appointment = {
  destinationEntry: "YES" as const,
  detailInfo: {},
  consigneeFacility: { facilityNumber: "1" },
  shipperAppointmentRequestID: "req-1",
  CRID: "123",
};
const cancellation = {
  consigneeAppointmentID: "a1",
  shipperAppointmentRequestID: "req-1",
  CRID: "123",
  destinationEntry: "NO" as const,
  cancelReasonCode: "A" as const,
  cancelComments: "no longer needed",
};

describe("usps appointments", () => {
  it("createUspsAppointment posts to the repeated /fast-appointments segment", async () => {
    const spy = setup();
    await api.createUspsAppointment(CLIENT, appointment);
    expect(spy.mock.calls[0][0]).toMatchObject({
      clientName: GROUP,
      requestName: "usps.appointments.createUspsAppointment",
      method: "POST",
      url: APPT,
      data: appointment,
    });
  });

  it("updateUspsAppointment PUTs the appointment", async () => {
    const spy = setup();
    await api.updateUspsAppointment(CLIENT, appointment);
    expect(spy.mock.calls[0][0]).toMatchObject({
      clientName: GROUP,
      requestName: "usps.appointments.updateUspsAppointment",
      method: "PUT",
      url: APPT,
      data: appointment,
    });
  });

  it("cancelUspsAppointment DELETEs with the cancellation as a body", async () => {
    const spy = setup();
    await api.cancelUspsAppointment(CLIENT, cancellation);
    expect(spy.mock.calls[0][0]).toMatchObject({
      clientName: GROUP,
      requestName: "usps.appointments.cancelUspsAppointment",
      method: "DELETE",
      url: APPT,
      data: cancellation,
    });
  });

  it("findUspsAppointmentAvailability posts to /appointment-availability", async () => {
    const spy = setup();
    const data = { mailClass: "FIRST_CLASS" as const, dropshipKey: "k" };
    await api.findUspsAppointmentAvailability(CLIENT, data as never);
    expect(spy.mock.calls[0][0]).toMatchObject({
      clientName: GROUP,
      requestName: "usps.appointments.findUspsAppointmentAvailability",
      method: "POST",
      url: "/fast-appointments/v3/appointment-availability",
      data,
    });
  });
});
