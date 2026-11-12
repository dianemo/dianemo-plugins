import { GetCompaniesResponse, GetCompanyResponse } from "./types.js";
import { OBJECT_COST, connectionCost } from "../utils/queryCost.js";
import handleGraphQLRequest from "../handleGraphQLRequest.js";
import { GetManyBasicOptions } from "../types.js";
import { RequestError } from "@dianemo/core";
import {
  basicListArgumentTypes,
  buildListArguments,
  listPageSize,
} from "../utils/listArguments.js";

export interface CompanyFieldPages {
  contacts: number;
  locations: number;
  catalogs: number;
}

/**
 * Reading one company. `catalogs` nests inside `locations`, so its depth
 * multiplies through and a value too large here made `getOne` fail on every shop
 * with `MAX_COST_EXCEEDED` — see docs/shopify-api.md#company-node-cost.
 */
const COMPANY_DETAIL_PAGES: CompanyFieldPages = {
  contacts: 25,
  locations: 10,
  catalogs: 10,
};

const COMPANY_LIST_PAGES: CompanyFieldPages = {
  contacts: 10,
  locations: 5,
  catalogs: 10,
};

/**
 * One `contacts` node: the contact, its `customer`, and the customer's
 * `companyContactProfiles` list.
 */
const CONTACT_COST = 3 * OBJECT_COST;

/**
 * One `locations` node: the location, `billingAddress`, `taxSettings`,
 * `buyerExperienceConfiguration` and its `paymentTermsTemplate`, plus the
 * `catalogs` connection.
 */
const locationCost = (catalogs: number) =>
  5 * OBJECT_COST + connectionCost(catalogs, OBJECT_COST);

const companyCost = (pages: CompanyFieldPages) =>
  // The company itself, plus its `customerInvoiceEmail` metafield object.
  2 * OBJECT_COST +
  connectionCost(pages.contacts, CONTACT_COST) +
  connectionCost(pages.locations, locationCost(pages.catalogs));

const companyFields = (pages: CompanyFieldPages) => `{
  id
  name
  customerInvoiceEmail: metafield(namespace: "custom", key: "customer_invoice_email") {
    id
    jsonValue
  }
  contacts (first: ${pages.contacts}) {
    edges {
      node {
        customer {
          id
          firstName
          lastName
          companyContactProfiles {
            id
          }
        }
      }
    }
  }
  locations (first: ${pages.locations}) {
    edges {
      node {
        billingAddress {
          id
          companyName
          recipient
          firstName
          lastName
          address1
          address2
          city
          province
          zip
          zoneCode
          country
          countryCode
          phone
          createdAt
          updatedAt
        }
        phone
        taxSettings {
          taxExempt
          taxExemptions
          taxRegistrationId
        }
        buyerExperienceConfiguration {
          paymentTermsTemplate {
            description
            dueInDays
            name
            paymentTermsType
          }
        }
        catalogs (first: ${pages.catalogs}) {
          edges {
            node {
              title
            }
          }
        }
      }
    }
  }
}`;

export const getMany = async (
  clientName: string,
  options?: GetManyBasicOptions
) => {
  const defaultOptions = { first: 5 };
  const mergedOptions = { ...defaultOptions, ...options };
  const args = buildListArguments(
    mergedOptions,
    basicListArgumentTypes("CompanySortKeys")
  );
  const query = `query companies${args.declarations} {
    companies${args.arguments} {
      edges {
        node ${companyFields(COMPANY_LIST_PAGES)}
      }
      pageInfo {
        hasPreviousPage
        hasNextPage
        startCursor
        endCursor
      }
    }
  }`;
  return await handleGraphQLRequest<GetCompaniesResponse>(
    clientName,
    "SHO_0020",
    "Failed to fetch Shopify companies",
    connectionCost(
      listPageSize(mergedOptions),
      companyCost(COMPANY_LIST_PAGES)
    ),
    "shopify.companies.list",
    query,
    args.variables
  );
};

/**
 * `pages` raises the nested sizes for a store whose cost allowance can carry
 * them — a wholesale company with more contacts than the default page returns
 * would otherwise lose the rest silently. See
 * docs/shopify-api.md#nested-page-sizes-are-a-cost-decision
 */
export const getOne = async (
  clientName: string,
  id: string,
  pages?: Partial<CompanyFieldPages>
) => {
  const detailPages: CompanyFieldPages = { ...COMPANY_DETAIL_PAGES, ...pages };
  const query = `query company($id: ID!) {
    company(id: $id) ${companyFields(detailPages)}
  }`;
  const res = await handleGraphQLRequest<GetCompanyResponse>(
    clientName,
    "SHO_0021",
    "Failed to fetch Shopify company",
    companyCost(detailPages),
    "shopify.companies.get",
    query,
    { id }
  );
  if (res.data.company) return res.data.company;
  throw new RequestError("SHO_0025", "Shopify company not found", {
    metadata: { context: id },
  });
};
