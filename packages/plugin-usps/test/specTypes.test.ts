import { describe, expect, it } from "vitest";
import type {
  UspsContainerResponse,
  UspsInternationalLabelInternationalCustomsForm,
  UspsInternationalLabelInternationalPackageDescription,
  UspsInternationalLabelInternationalPackageOptions,
  UspsInternationalLabelMetadata,
  UspsInternationalLabelRequestDomesticLabelAddress,
  UspsInternationalLabelRequestLabelAddress,
  UspsLabelLink,
  UspsServiceStandardFileLink,
} from "../src/index.js";

// These are compile-time checks (`npm run check` type-checks the tests): a
// `@ts-expect-error` line that stops erroring fails the build.

describe("international label request types keep the spec's required fields", () => {
  it("requires what the allOf-composed schemas require", () => {
    // @ts-expect-error countryISOAlpha2Code, country and city are required
    const noCountry: UspsInternationalLabelRequestLabelAddress = {
      streetAddress: "1 Rue",
    };
    // @ts-expect-error ZIPCode is required
    const noZip: UspsInternationalLabelRequestDomesticLabelAddress = {
      streetAddress: "1 Main",
      city: "Boston",
      state: "MA",
    };
    // @ts-expect-error weight, length, width and height are required
    const noDimensions: UspsInternationalLabelInternationalPackageDescription =
      {
        mailClass: "PRIORITY_MAIL_INTERNATIONAL",
        processingCategory: "MACHINABLE",
        destinationEntryFacilityType: "NONE",
        mailingDate: "2026-11-20",
      };
    // @ts-expect-error AESITN is required
    const noAesitn: UspsInternationalLabelInternationalCustomsForm = {
      customsContentType: "GIFT",
      contents: [],
    };
    const noRedirectZip: UspsInternationalLabelInternationalPackageOptions = {
      // @ts-expect-error a redirect address needs ZIPCode, state, city and street
      redirectAddress: { streetAddress: "1 Main" },
    };
    expect([
      noCountry,
      noZip,
      noDimensions,
      noAesitn,
      noRedirectZip,
    ]).toHaveLength(5);
  });

  it("leaves the response's labelAddress lenient", () => {
    const metadata: UspsInternationalLabelMetadata = {
      labelAddress: { streetAddress: "1 Rue" },
    };
    expect(metadata.labelAddress?.streetAddress).toBe("1 Rue");
  });
});

describe("fields the spec has and the types lacked", () => {
  it("accepts link titles, a file description, and the container address abbreviations", () => {
    const link: UspsLabelLink = { rel: ["self"], href: "h", title: "Track" };
    const file: UspsServiceStandardFileLink = {
      rel: ["self"],
      href: "h",
      title: "Complete Service Standard Data",
      description: "zip",
    };
    const container: Pick<UspsContainerResponse, "originAddress"> = {
      originAddress: {
        streetAddress: "1 Main",
        city: "Memphis",
        state: "TN",
        ZIPCode: "38188",
        streetAddressAbbreviation: "1 MAIN ST",
        cityAbbreviation: "MEMPHIS",
      },
    };
    expect([link.title, file.title, container.originAddress]).toBeDefined();
  });
});
