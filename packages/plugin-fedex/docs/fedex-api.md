# FedEx API behaviour

Findings behind `@dianemo/plugin-fedex`.

## Rate limit: 1,400 transactions per 10 seconds, per project

**Vendor documentation**, checked 2026-08-25:

> Each project has a transaction rate limit of 1,400 transactions in the span of
> 10 seconds. Throttling restrictions are applied if transactions exceed this
> limit during each 10-second timeframe.

The template declares exactly this — `interval: 10_000`, `tokensToAdd: 1400` — so
the figure is FedEx's own and not a smoothed or derived one.

### The quota is per project, and a client is not a project

This is the part a reader cannot see from the calibration. The budget is scoped to
the **FedEx project**, whereas a token bucket here is scoped to one registered set
of credentials. Two clients whose credentials belong to the same project each
meter to 1,400 per 10 s and overrun the project together at 2,800, while each one
looks individually compliant.

If several accounts here share a FedEx project, lower each client's budget with
the `rateLimitOverrides` argument to `addTemplateClient` so the sum stays under
1,400 — rather than editing the template, which would mis-state the vendor
figure for everyone.

`plugin-google-vertex-ai` and `plugin-google`'s Address Validation client have the
same shape of problem, recorded in their own docs.

## Where the endpoint findings come from

Every section below this one rests on the FedEx Developer Portal OpenAPI specs downloaded
2026-11-12, one per API. That is **vendor documentation**. None of it is an observed
response: no call here has been made against a FedEx account, so where a spec's schema, its
examples and its prose disagree, the types follow the schema and the disagreement is
recorded. Each section ends with the questions only a real account can settle.

None of the specs states a rate limit for an individual endpoint. The only figure FedEx
publishes is the per-project one above.

## Authorization (`/oauth/token`)

Source: FedEx Developer Portal OpenAPI spec, API Authorization v1.0, downloaded 2026-11-12.
Vendor documentation, not an observed response.

Audit of the `client.ts` auth block against it: **no change needed.**

| Item            | Spec                                                                                          | `client.ts`                                                                                 |
| --------------- | --------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| URL             | `POST /oauth/token` on `apis.fedex.com` / `apis-sandbox.fedex.com`                            | `<baseUrl without trailing slashes>/oauth/token`                                            |
| Body encoding   | `application/x-www-form-urlencoded`                                                           | `dataLocation: "urlEncodedForm"`                                                            |
| Required fields | `grant_type`, `client_id`, `client_secret`                                                    | all three, via `{{clientId}}` / `{{clientSecret}}`                                          |
| Response        | `access_token`, `token_type` ("bearer"), `expires_in` (integer seconds), `scope` (e.g. `CXS`) | core reads `access_token` and `expires_in`                                                  |
| Lifetime        | "standard token expiration time is one hour" (`expires_in: 3600`)                             | none declared; core's own default when a provider omits it is also 3600 s, so the two agree |
| Errors          | 401 `NOT.AUTHORIZED.ERROR`, 500, 503                                                          | n/a                                                                                         |

The spec's `Content-Type` header parameter is `required: true`; axios sets it for a urlencoded body.
The spec states no rate limit for `/oauth/token`; the plugin does not meter token calls separately.

**Trailing slash on `baseUrl`.** The token URL was built as `${baseUrl}/oauth/token`, which is `//oauth/token` for a base URL ending in `/`. Trailing slashes are now stripped once and the result used for the token URL only; the client's `baseURL` default and `documentsBaseUrl` are unchanged (axios joins a slash-terminated `baseURL` correctly for the request functions). A test sends a real token request through a `RequestHandler` to a local server and asserts the path. Why it matters is inference: a proxy or mock may route `//oauth/token` differently from FedEx's own host, which was not tried.

### Grants the spec describes that the plugin does not support (open question)

`grant_type` is documented as one of three values:

- `client_credentials`: "customers, Integrators, and brand new Compatible Provider customers who are yet to onboard child accounts". **Supported; this is what the plugin sends.**
- `csp_credentials`: Integrators and Compatible Provider customers with existing child accounts. Adds form fields `child_Key` and `child_secret` (the spec's property names; note the capital K in `child_Key`).
- `client_pc_credentials`: Proprietary Parent Child customers. Same two extra fields.

Not supported. `OAuth2Credentials` has no child-key/secret fields, and core substitutes only `{{clientId}}`, `{{clientSecret}}` and `{{refreshToken}}`, so a child credential could only be expressed as a literal baked into the template at build time, which needs a new credentials type and a template change rather than just a new `grant_type`. Not attempted: no FedEx account of these kinds is available to confirm the behaviour. What would settle it: a Compatible Provider or Parent Child account, to confirm that `child_Key` / `child_secret` are the only difference and what the resulting token's `scope` is.

Spec oddity: the 401/500/503 examples and every `x-code-samples` block (24 of them) point at `https://apis-base.test.cloud.fedex.com/oauth/token`, a host that appears nowhere else. Treated as a documentation artefact; the `servers` block is authoritative.

## Trade documents upload host

Source: Trade Documents Upload API v1.0.2, downloaded 2026-11-12. Vendor documentation.

**The spec contradicts itself on host, and the per-operation `servers` block wins.** The document-level `servers` lists `apis-sandbox.fedex.com` and `apis.fedex.com`. Every one of the five operations carries its own `servers` override, which OpenAPI 3 says takes precedence for that operation:

| Environment | Host                                             | Spec label              |
| ----------- | ------------------------------------------------ | ----------------------- |
| Sandbox     | `https://documentapitest.prod.fedex.com/sandbox` | "EDU Sandbox Server"    |
| Production  | `https://documentapi.prod.fedex.com`             | "EDU Production Server" |

Each host string appears exactly five times (once per operation): **all five endpoints are served from the document host and none from `apis.fedex.com`.** Note the sandbox host carries a `/sandbox` path prefix; production does not.

The plugin therefore declares a `documents` sub-client under the existing client. `fedex:<org>:<instance>` (the leaf every other function uses) is unchanged: it keeps its own `baseURL`, rate limit and auth, and core allows a parent that is both usable and has `subClients`. The upload functions append `:documents` themselves; a caller passes the same bare client name as for every other function.

Mapping, derived from `creds.baseUrl` by exact host match (`documentsBaseUrl` in `src/client.ts`):

| `creds.baseUrl` host        | document host                                    |
| --------------------------- | ------------------------------------------------ |
| `apis.fedex.com`            | `https://documentapi.prod.fedex.com`             |
| `apis-sandbox.fedex.com`    | `https://documentapitest.prod.fedex.com/sandbox` |
| anything else (proxy, mock) | passed through unchanged                         |

The pass-through is a design choice, not a vendor statement: guessing a FedEx host for a base URL the caller pointed elsewhere would send documents somewhere they never configured.

**Token on the document host is an inference.** The spec says only that `Authorization` is a required header (`Bearer ****`, "JWE token"). The sub-client reuses the parent's OAuth token (core stores credentials under the parent via `authOwnerName`). Nothing in the spec says the document gateway accepts a token minted at `apis.fedex.com/oauth/token`, though nothing suggests a second token endpoint either. A real account settles it.

**Rate limit on the document host: the spec does not say.** No quota, no 429 behaviour, no throttling language anywhere in `upload-documents.json`. The 1,400 per 10 s per-project figure is documented (see "Rate limit" above) for the platform; whether `documentapi.prod.fedex.com` is inside it is unknown. The sub-client is declared `sharedLimit` on the parent, so uploads draw on the same 1,400 / 10 s bucket (and on any `rateLimitOverrides` applied to the parent). That is this plugin's conservative choice, not FedEx's figure: sharing can under-use a separate quota but cannot overrun a shared one. A `rateLimitOverrides` entry for path `documents` must itself be `sharedLimit` (core skips an override whose type differs from the template's), so giving the document host a separate `requestLimit` bucket means editing the template, which should wait for evidence of a separate quota.

## Trade documents upload: multipart body

All three multipart operations (`etds/upload`, `lhsimages/upload`, `etds/multiupload`) are built with Node's global `FormData` / `Blob`; no dependency. Callers pass bytes plus the JSON metadata and never build a form. The function sets no `Content-Type`: axios derives `multipart/form-data; boundary=...` from the `FormData`, verified by a test that sends a real request to a local HTTP server through core and reads the header and body back.

Inferences (the spec gives field names and examples only, never a part content-type):

- JSON parts (`document`, and `documentInformation` for the multi upload) are sent as plain text fields holding the JSON string, not `application/json` blobs. The spec's examples render them as `document: {"workflowName": ...}`. For `uploadImage` the one `document` part holds `{ document, rules }` (see the contradictions below).
- The file part is named `attachment` (single ETD and image) or `fileAttachments` (repeated, max 5). Its filename comes from `document.name` or, for multi, `metaData[i].fileName` by position; the spec does not say how files are matched to `metaData` entries. Position is an assumption.
- The part's own content-type is set from `contentType` when given.

## Trade documents upload: spec contradictions

Where they contradict, the schema's properties were followed.

- **`lhsimages/upload` (multipart):** the schema `FullSchema-ImageUploadServiceInputVO` lists `document`, `rules` and `attachment` as siblings, but the spec's only example for the operation (`requestBody.content['multipart/form-data'].examples['Full-Schema']`) has two parts: `document: {"document": {...}, "rules": {...}}` and `attachment`. FedEx's docs page (developer.fedex.com/api/en-us/catalog/upload-documents/v1/docs.html, fetched 2026-11-12 by an audit agent) says the endpoint "takes two parts in the request body". Two sources against one, so the function sends ONE `document` part whose JSON is `{ document, rules }`, plus `attachment`; the caller-facing input type is unchanged. This rests on the spec example and the docs page, **not on a call to FedEx**; if a real account rejects it, the three-sibling layout is the fallback. `lhsimages/encodedupload` was checked against its own example (`FullSchema-ImageUploadServiceBase64Request`): it is a single JSON body `{ document: { referenceId, contentType, meta } }` with no `rules`, which is what the type already models.
- **`lhsimages/encodedupload`:** `Document_1.required` lists `rules` and `workflowName`, neither of which is a defined property, and the example omits both. Typed without them.
- **Response `imageIndex` type:** `object` in the encoded-upload response schema, `string` in the multipart one (and a string enum in both requests). Typed `string | object` on the encoded response.
- **Content types:** `contentType` is an enum of 17 MIME types for the single and multipart ETD requests but a free string for `encodedmultiupload`. Kept as the spec has it. The image `contentType` is a bare string in the multipart schema but the description limits it to `image/png` / `image/gif`; typed as that union.
- **`shipDocumentType`:** `USMCA_CERTIFICATION_OF_ORIGIN` in the request enum vs `USMCA_CERTIFICATE_OF_ORIGIN` in the response description's code table. Request enum used.
- **`folderId`:** declared `type: string` with `items: {type: string}`. Typed `string`.
- **Single ETD response** has no `transactionId` (the others do); `FedExResponse<T>` was therefore not used.
- Multipart `etds_multiupload_body` / `etds_base64multiupload_body` are `oneOf` of the full schema and two empty "MinimumSamplePayload" schemas (`{}`); only the full schema carries information.
- The spec says `Content-Type` is required for `etds/upload`, `etds/multiupload`, `encodedupload` and `encodedmultiupload`, and omits it for `lhsimages/upload`. Not modelled: the body type fixes it.
- Max 5 files for the multi endpoints (`maxItems: 5` on both `metaData` and `fileAttachments`). Documented, not enforced by the plugin.

## Trade documents upload: functions

| Function                            | Method | URL                                     | Body      | Code     |
| ----------------------------------- | ------ | --------------------------------------- | --------- | -------- |
| `uploadEtdDocument`                 | POST   | `/documents/v1/etds/upload`             | multipart | FDX_0090 |
| `uploadImage`                       | POST   | `/documents/v1/lhsimages/upload`        | multipart | FDX_0091 |
| `uploadEncodedImage`                | POST   | `/documents/v1/lhsimages/encodedupload` | JSON      | FDX_0092 |
| `uploadMultipleEtdDocuments`        | POST   | `/documents/v1/etds/multiupload`        | multipart | FDX_0093 |
| `uploadMultipleEncodedEtdDocuments` | POST   | `/documents/v1/etds/encodedmultiupload` | JSON      | FDX_0094 |

All dispatch against `<clientName>:documents`; `requestName` is `fedex.tradeDocuments.<function>`.

## Trade documents upload: changes to the client

| Change                                                                 | Breaking?                                                                                                                                                                                                                          |
| ---------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `registerFedexTemplate` adds a `documents` sub-client under the parent | Non-breaking: the parent name, `baseURL`, rate limit and auth block are unchanged (asserted by `test/plugin.test.ts`, `test/auth.test.ts`, `test/requestClientNames.test.ts`). New client name `fedex:<org>:<instance>:documents`. |
| Auth block                                                             | No change.                                                                                                                                                                                                                         |

Existing exported types and functions: untouched.

## Response envelope

`FedExResponse<T>` (shared, `src/requests/types.ts`) used to require `transactionId` and
`output`, and `code`, `message` and `alertType` on each alert. None of the specs does: every
response schema in them lacks a `required` array (vendor documentation, checked per family
in the sections below). All of those fields are now optional, so a caller reading
`res.output.x` gets a compile-time prompt to handle absence. This is a breaking change at the
type level for any caller that read `res.output` without a guard; nothing in this package did.

`output` is `Omit<{ alerts?: FedExAlert[] }, keyof T> & T`, so when a family's output type
declares its own `alerts` (consolidation does, with `FedExConsolidationAlert`) that type owns
it, rather than the two array types being intersected into `FedExAlert[] & FedExConsolidationAlert[]`.
The two alert shapes are field-for-field identical, so before this change the intersection
was harmless but unreadable in editor hovers; the compiler now reports
`FedExConsolidationAlert[] | undefined` for a consolidation response.

## Audit follow-up: findings recorded, no code change

These came from a read-only audit of the families added on this branch. Each rests on the
vendor's spec (schema, examples), not on a call.

- **The spec's sample payloads do not type-check against its own schemas.** FedEx's request
  examples quote numbers as strings (`"weight": {"value": "20"}`, `"amount": "100"`), send
  postal codes and account numbers as numbers (`"accountNumber": {"value": 123456789}`), and
  in places send an array for a single value. About 80 sample paths across the families fail
  to compile against the schema-derived types. The plugin sends whatever the caller passes,
  so there is no runtime effect; the types follow the schemas, except where the sections
  above widened them to accept a sample (arrays in consolidation, strings for regulatory
  codes). A caller copying a FedEx sample verbatim will meet type errors on the numeric
  fields; the fix is on their side (convert), or a cast.
- **`checkPickupAvailability` samples disagree with each other** on whether
  `shipmentAttributes` is an object (as the schema and the type say) or an array. Typed as
  an object. Open question: which the server accepts.
- **Per-property examples show `null`** for several response fields (for example
  `responsibleParty` in nine rate samples). The response types do not allow `null`, since the
  schemas do not say a field is nullable; a real response may carry them.
- **Only 2 of 52 operations carry a real response example**, so almost every response type
  rests on the schema alone. Nothing here was checked against a real response body.
- **Every operation returns `application/json`**, documents included: label and document
  bytes arrive as base64 strings inside the JSON, so no request function handles a binary
  response and none sets a `responseType`.
- **`FedExSubPackagingType` is a TypeScript enum**, not a string union, so a literal copied
  from a FedEx sample (`"OTHER"`, `"PALLET"`) does not assign to it without importing the
  enum. Left as is: converting an exported enum to a union would break callers that import
  its members.
- **The tests mock at `handleRequest`**, so they see the config a function hands to core and
  nothing core or axios does afterwards (URL joining, headers, multipart encoding, token
  refresh). Two defects of that kind were found by audit and are now covered by tests that
  run through a real `RequestHandler` against a local HTTP server: the multipart layout of
  `uploadImage` and the token URL's double slash. The existing ETD upload test already did this.

## Request fields the spec types as plain strings

Widened to the known values plus any string (`"A" | "B" | (string & {})`, which keeps
editor autocomplete): `uploadImage`'s `document.contentType` (the base64 variant has a real
enum and stays narrow), tracking-documents `documentType` and `documentFormat`, pickup
`pickupType` (create and availability) and the availability `shipmentAttributes.packagingType`.
In each case the spec's schema is `type: string` and the named values come from its prose or
examples, so a narrow union would reject a value the server may accept. `serviceType` and
`packagingType` on ship and rate stay narrow, deliberately (see "`serviceType` and
`packagingType` are narrower than the spec").

## Ship API

Source: FedEx Developer Portal OpenAPI spec, Ship API v1.0.0, downloaded 2026-11-12.
**Vendor documentation**, not an observed response; nothing here has been called against
FedEx.

| Function                   | Method and URL                                   | Code     |
| -------------------------- | ------------------------------------------------ | -------- |
| `makeFedexPurchaseRequest` | POST `/ship/v1/shipments`                        | FDX_0001 |
| `cancelShipment`           | PUT `/ship/v1/shipments/cancel`                  | FDX_0003 |
| `getShipmentAsyncResults`  | POST `/ship/v1/shipments/results`                | FDX_0010 |
| `validateShipment`         | POST `/ship/v1/shipments/packages/validate`      | FDX_0011 |
| `createTag`                | POST `/ship/v1/shipments/tag`                    | FDX_0012 |
| `cancelTag`                | PUT `/ship/v1/shipments/tag/cancel/{shipmentid}` | FDX_0013 |

The spec states no rate limit for any Ship endpoint (searched for "rate limit", "throttl"
and "per second").

### Spec quirks and contradictions

The types follow the schema wherever the schema, an example and a description disagree.

- **Stale `required` on create-tag.** `CreateTagRequestedShipment.required` lists
  `shippingLabelType`, `specialServicesRequested` and `shipTimestamp`, none of which exist
  in its `properties` (the schema has `shipDatestamp` and `shipmentSpecialServices`). The
  types follow `properties`.
- **Pickup type typo on validate.** `RequestedShipmentVerify.pickupType` lists
  `"CONTACT_FEDEX TO_SCHEDULE"` with a space; create-shipment and create-tag spell it with
  an underscore. The validate type accepts both. That the space is a typo is an inference.
- **Examples contradicting their schema.** `emailShipment` (boolean) has the example
  `"false"`; `Customs_Money.amount` (number) has `"1556.25"`.
- **`cancelTag` path parameter.** `shipmentid` is `in: path` without `required: true`; it is
  treated as required, as OpenAPI mandates for path parameters. The spec does not say what
  it identifies, and the body carries its own `trackingNumber`.
- **Envelope required-ness.** `transactionId`, `customerTransactionId` and `output` are all
  optional in the spec, and so now are they in the shared `FedExResponse<T>`
  (see "Response envelope").
- **Validate output.** The spec's output schema has only `alerts`.
- **Validate 404 body.** `{error, error_detail}` rather than the `errors[]` envelope the
  other endpoints document. The plugin does not parse error bodies.
- **Single-member `oneOf`.** Every request body is a `oneOf` with one real schema plus
  sample payloads; the types model the one schema.
- **Duplicate schemas.** The spec repeats structurally identical schemas under different
  names (`Address`, `PartyAddress`, `Address_1`; four `PartyAccountNumber*`; `Weight`,
  `Weight_3`, `Weight_4`). The types are deduplicated.

### `serviceType` and `packagingType` are narrower than the spec

The spec types both as plain strings with examples and no enum. The plugin keeps its
`FedExServiceType` and `FedExPackageType` unions on the create-shipment, validate and
create-tag requests. This is **the plugin's refinement carried from v1.0.0**, not something
the spec states: a service FedEx adds later will not type-check until the union is extended.

### Asynchronous create-shipment

`processingOptionType: "ALLOW_ASYNCHRONOUS"` can return a `jobId`, which
`getShipmentAsyncResults` takes. The spec states neither the job's lifetime nor any polling
guidance.

### `FedExCancelShipmentOptions` is not a wire type

It was exported in v1.0.0 with a `deleteAllPackages` flag. The spec has no such field; the
real control is `deletionControl` on the request body. The name is kept, marked
`@deprecated`, and can go in the next major.

### Audit of the v1.0.0 create and cancel types

All 14 exported names from v1.0.0 are kept as aliases of spec-derived `FedExShip*` types.

| Change                                                                                                                                                        | For a TypeScript caller             |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------- |
| `requestedShipment.totalWeight` is now required                                                                                                               | breaking                            |
| `rateRequestTypes?: string[]` removed; the wire field is `rateRequestType`, an array of `LIST`, `NONE`, `PREFERRED`, `ACCOUNT`, `INCENTIVE`, `RETAIL`         | breaking                            |
| `labelStockType`, `imageType`, `labelPrintingOrientation`, weight and dimension `units`, `signatureOptionType`, `ShipmentDocument.contentType` are spec enums | breaking                            |
| Every create-response field is optional (the spec has no `required` on responses)                                                                             | breaking under `strictNullChecks`   |
| `PieceResponse`: `deliveryDatestamp` is `deliveryTimestamp`; `codcollectionAmount` is `codCollectionAmount`; `currency` and `netRateAmount` removed           | breaking                            |
| Cancel response: `successMessage` is `message` (`successMessage` belongs to cancel-tag)                                                                       | breaking                            |
| Request address fields (`streetLines`, `city`, `postalCode`, `countryCode`, `residential`) optional                                                           | breaking only for code reading them |
| `shippingDocumentSpecification` and related nested types re-derived from the spec                                                                             | breaking for values the spec lacks  |
| `preferredCurrency` widened to `string`; `paymentType` gains `COLLECT`; `totalPackageCount` optional                                                          | non-breaking                        |
| Fields v1.0.0 omitted added; `jobId`; `emailShipment`, `senderCountryCode`, `version` on the cancel request                                                   | non-breaking                        |

### Open questions that need a real account

- Is `cancelTag`'s `shipmentid` the tag's master tracking number?
- Does create-tag tolerate omitting the three stale-required fields?
- Does validate accept `CONTACT_FEDEX_TO_SCHEDULE`?
- How long does an async job live, and how should it be polled?

## Open Ship

Source for every statement in this section: FedEx Developer Portal OpenAPI spec, Open Ship API v1.0, downloaded 2026-11-12. That is vendor documentation, not an observed response; nobody has called these endpoints. Anything labelled "inference" is ours.

Family: `src/requests/openShip/`, `requestName` `fedex.openShip.<function>`, error codes `FDX_0030` to `FDX_0039`. Every exported type is prefixed `FedExOpenShip`.

| Function                       | Method | URL (exactly as the spec writes it)        | Code     |
| ------------------------------ | ------ | ------------------------------------------ | -------- |
| `createOpenShipment`           | POST   | `/ship/v1/openshipments/create`            | FDX_0030 |
| `modifyOpenShipment`           | PUT    | `/ship/v1/openshipments/`                  | FDX_0031 |
| `confirmOpenShipment`          | POST   | `/ship/v1/openshipments/`                  | FDX_0032 |
| `modifyOpenShipmentPackages`   | PUT    | `/ship/v1/openshipments/packages`          | FDX_0033 |
| `addOpenShipmentPackages`      | POST   | `/ship/v1/openshipments/packages`          | FDX_0034 |
| `deleteOpenShipmentPackages`   | PUT    | `/ship/v1/openshipments/packages/delete`   | FDX_0035 |
| `retrieveOpenShipmentPackages` | POST   | `/ship/v1/openshipments/packages/retrieve` | FDX_0036 |
| `deleteOpenShipment`           | PUT    | `/ship/v1/openshipments/delete`            | FDX_0037 |
| `retrieveOpenShipment`         | POST   | `/ship/v1/openshipments/retrieve`          | FDX_0038 |
| `getOpenShipmentResults`       | POST   | `/ship/v1/openshipments/results`           | FDX_0039 |

### Wire quirks

- **Two URLs end in a slash, and share it.** Modify (PUT) and confirm (POST) are both `/ship/v1/openshipments/`; only the method tells them apart. The slash is kept as written. Whether FedEx also accepts the slashless form is not stated in the spec and is untested.
- **Async flow.** `createOpenShipment`, `modifyOpenShipment` and `confirmOpenShipment` outputs carry `asynchronousProcessingResultsDetail` and `jobId` (confirm: `jobId` only). `getOpenShipmentResults` takes that `jobId` plus `resultMethodType` (`CREATE`, `MODIFY`, `CONFIRM`) to fetch the outcome. How a caller opts into async processing is not stated anywhere in this spec (inference: it is an account or request-level setting documented elsewhere).
- **`index` identifies an open shipment.** Create's `index` is optional; the spec says that when omitted, the master tracking number acts as the index. Every other operation requires `index`.
- **`openShipmentAction` differs by operation.** Create: `STRONG_VALIDATION | WEAK_VALIDATION | CREATE_PACKAGE | PROVIDE_DOCUMENTS_INCREMENTALLY`. Modify, modify packages, add packages: the first three only. Confirm: only `PROVIDE_DOCUMENTS_INCREMENTALLY`.
- **Package ids are objects, not strings.** `modifyOpenShipmentPackages`, `deleteOpenShipmentPackages` and `retrieveOpenShipmentPackages` take `trackingId` / `trackingIds` as `{ formId, trackingIdType, uspsApplicationId, trackingNumber }`.
- **Response field is lower-case `p`.** `retrieveOpenShipmentPackages` returns `output.requestedpackageLineItem` (not `requestedPackageLineItem`). Typed as the spec spells it.
- **Required headers not modelled.** Every operation lists `content-type` and `authorization` as required headers. They are not modelled as parameters: auth is the client's job, and content-type is assumed to be set by the transport (inference; unverified against `client.ts`).
- **`retrieveOpenShipment` has no 503** among its documented responses; the other nine do.
- **Error bodies are not typed.** The spec's `ErrorResponseVO*` shapes (4xx/5xx) are not modelled; `tryHandleRequest` throws on them.

### Spec contradictions (schema picked, contradiction recorded)

| Where                                                                                                                                                   | Contradiction                                                                                                                                | What the type does                                                                                                                                                             |
| ------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `FullSchema-RetrieveOpenShipment`                                                                                                                       | `required` lists `trackingId`, but `properties` does not define it                                                                           | `trackingId?: FedExOpenShipTrackingId \| string`, optional. The sibling packages operations use the object form; the type is deliberately unsure. Needs a real call to settle. |
| `Weight` (used by `CompletedShipmentDryIceDetail.totalWeight` and every `billingWeight` / `totalBillingWeight` / `totalDimWeight` in the rating blocks) | `units` enum is `["KG"]`; the same spec's `Weight_1` / `Weight_With_Link` allow `KG` and `LB`                                                | Typed as the schema says: `FedExOpenShipWeightKg { units: "KG" }`. Inference: this looks like a truncated enum, and a US shipment may well return `LB`. Open question.         |
| `AccountNumber`                                                                                                                                         | `accountNumber` is required on every request, but its only property `value` is not required                                                  | `accountNumber: { value?: string }`. The examples always send `value`.                                                                                                         |
| `AlcoholDetail.alcoholRecipientType`                                                                                                                    | enum is `LICENSEE`, `CONSUMERstomer` (looks like a mangled `CONSUMER`)                                                                       | Typed as written. Do not send `CONSUMER` on the strength of this spec alone.                                                                                                   |
| `Surcharge.amount`                                                                                                                                      | has a description and example but no `type`                                                                                                  | `string \| number`.                                                                                                                                                            |
| `MinimumSamplePayload-addPackagesInOpenShipment`                                                                                                        | example sends `weight.value: "20"` and `declaredValue.amount: "100"` as strings; the schema types them `number`                              | Schema wins: `number`.                                                                                                                                                         |
| `oneOf` on confirm and add-packages request bodies                                                                                                      | second branch is `MinimumSamplePayload-*`, which is an `example` with no `type` or `properties`                                              | Not a real alternative shape: it is a subset of the full schema. Typed as the full schema only.                                                                                |
| Operation summary                                                                                                                                       | `"Create Open Shipmentt"` (double t)                                                                                                         | Cosmetic; no effect.                                                                                                                                                           |
| `DeliveryOnInvoiceAcceptanceDetail.recipient.contact`                                                                                                   | the shared contact type requires only `phoneNumber`, but this path's `allOf` override requires `companyName`, `personName` and `phoneNumber` | Own type `FedExOpenShipDeliveryOnInvoiceRecipientContact` with all three required. The override lists exactly those three properties; the others are kept optional.            |

### Typing decisions

- **Response envelope.** This spec marks nothing in any response as required (and the shared `FedExResponse<T>` no longer does either, see "Response envelope"). The family has its own `FedExOpenShipResponse<T>` with all three fields optional, and every response field is optional. Required-ness on responses is therefore the spec's silence, not a guarantee that a field is ever absent.
- **No reuse of shared types.** `FedExWeight`, `FedExDimensions`, `FedExAlert` differ in required-ness or enum members from this spec's equivalents, so none are reused.
- **Structural de-duplication.** Spec schemas with identical shapes were collapsed to one exported type: `StringBarcode` kept separate from `BinaryBarcode`, but these pairs were merged (second name no longer exists): `HazardousCommodityQuantityDetail002` into `HazardousCommodityQuantityDetail`, `PieceResponse` / `PieceResponse_1`, `TransactionOpenShipmentOutputVO` / `_1`, `TransactionShipmentOutputVO` / `_1`, `Weight_With_Link` / `Weight_Without_Link`, `PartyContact` / `PartyContact_1` / `PartyContact_2` / `Contact_1` / `Contact_2`, `ContactAndAddress` / `ContactAndAddress_1`, `PartyAccountNumber` / `_1`, `ClearanceItemDetail_address` / `Address_1`.
- **Renamed for readability.** Numeric suffixes in the spec (`Party_1`, `Payment_1`, `Weight_With_Link`, `ShipmentDryIceDetail_1`...) became role names (`FedExOpenShipParty`, `FedExOpenShipDutiesPayment`, `FedExOpenShipWeight`, `FedExOpenShipShipmentDryIceDetail`). The spec's response-side `Weight` is `FedExOpenShipWeightKg`, and its response-side `ShipmentDryIceDetail` is `FedExOpenShipCompletedShipmentDryIceDetail`.
- Create and modify share one `FedExOpenShipCreateRequestedShipment` body shape; retrieve returns the slightly different `FedExOpenShipRetrievedRequestedShipment` (adds `totalDeclaredValue`, `masterTrackingId`, `shippingDocumentSpecification`, `totalPackageCount`; drops `soldTo`).

### Open questions that need a real account

1. Does `retrieveOpenShipment` need `trackingId`, and in what form (string or the object used by the packages operations)? The spec's `required` array says yes; its `properties` say nothing.
2. Can rating-block weights return `LB`? The spec's `Weight` enum allows only `KG`.
3. Is `CONSUMERstomer` real or a typo for `CONSUMER` in `alcoholRecipientType`?
4. What turns on asynchronous processing, so that `jobId` / `getOpenShipmentResults` apply?
5. Is the trailing slash on modify/confirm significant, or does FedEx accept `/ship/v1/openshipments` too?
6. Rate limits: the Open Ship spec states none (searched the file for "rate limit", "throttl", "per second", "requests per": no hits). Nothing here changes the client's calibration.

## Consolidation API

Source: FedEx Developer Portal OpenAPI spec, Consolidation API (`info.version` is literally
`"API"`), downloaded 2026-11-12. **Vendor documentation**, not an observed response; nobody
has called these endpoints.

| Function                          | Method and URL                                     | Code     |
| --------------------------------- | -------------------------------------------------- | -------- |
| `createConsolidation`             | POST `/ship/v1/consolidations`                     | FDX_0050 |
| `modifyConsolidation`             | PUT `/ship/v1/consolidations`                      | FDX_0051 |
| `createConsolidationShipment`     | POST `/ship/v1/consolidations/shipments`           | FDX_0052 |
| `getConsolidationShipmentResults` | POST `/ship/v1/consolidations/results`             | FDX_0053 |
| `confirmConsolidation`            | POST `/ship/v1/consolidations/confirmations`       | FDX_0054 |
| `getConfirmConsolidationResults`  | POST `/ship/v1/consolidations/confirmationresults` | FDX_0055 |
| `retrieveConsolidation`           | POST `/ship/v1/consolidations/retrieve`            | FDX_0056 |
| `deleteConsolidationShipments`    | PUT `/ship/v1/consolidations/shipments/delete`     | FDX_0057 |
| `deleteConsolidation`             | PUT `/ship/v1/consolidations/delete`               | FDX_0058 |

Retrieve is a POST with a body, and both deletes are PUTs with a body, not DELETEs. The
spec states no rate limit for any operation (searched for `ratelimit` and `throttle`).

### Asynchronous flow

A reading of the spec, not observed. `createConsolidationShipment` and
`confirmConsolidation` accept `processingOptionType: "ALLOW_ASYNCHRONOUS"`;
`getConsolidationShipmentResults` and `getConfirmConsolidationResults` take `accountNumber`
plus `jobId` and are the polling half. That the `jobId` comes back from the create or
confirm call is an **inference**. The spec states neither when FedEx picks the async path,
nor the polling cadence, nor how long a result stays retrievable.

### Spec contradictions and how the types resolve them

The schema wins over examples and descriptions, except where the spec's own sample payloads
cannot be expressed in it. For consolidation every sample in the request-body `oneOf`s was
compared, by script, against the schema (value kinds and field names), then each sample was
compiled against the request type. That is vendor documentation (spec schema against spec
examples); nothing here was sent to FedEx. The types now accept the samples' shapes in
addition to the schema's:

- **`consolidationKey` shape.** The schema is `{ date, index, type }`, all required. The
  spec's own minimum sample payloads for retrieve and delete show
  `{ consolidationType, index, shipDatestamp }` instead. The type is `index` plus either pair.
- **Arrays where the schema says a single enum.** The spec's samples send
  `transborderDistributionDetail.specialServicesRequested.specialServiceTypes: ["FEDEX_LTL"]`
  and, in the create-shipment samples, `processingOption.options: ["BYPASS_REGULATORY_VALIDATION"]`
  / `["PACKAGE_LEVEL_COMMODITIES"]`. Those two (and the identically-shaped
  `processingOptionsRequested.options`, widened for consistency though no sample exercises it)
  are typed `T | T[]`. These were the only array/scalar disagreements the script found.
  The processing-option enum also carries the spec's `REQUIRE_PRE_EPIC_BARCODEx` (an apparent
  typo in the spec) next to `REQUIRE_PRE_EPIC_BARCODE`.
- **Fields the samples send that the schema lacks**, added optional:
  `labelSpecification.printerType` and `paperType`, `consolidationKey.consolidationType`
  and `shipDatestamp`, `shipper.address.residential` and `importerOfRecord.address.residential`
  (on `PartyAddressV2`), the duties payment's `billingDetails`,
  `printedLabelOrigin.address.addressClassificationConfidence`, `requestedShipment.shipAction`
  and `dropoffType` (the schema has `dropOffType`), commodity `partNumber` and `harmonizedCode`,
  and `requestedConsolidation.distributionLocations` (an array; the schema's singular
  `distributionLocation` stays).
- **Fields the schema requires that samples omit**, made optional: the payor address's
  `streetLines` and `city` (`AddressV2`), `labelSpecification.printedLabelOrigin`,
  `requestedShipment.shipDatestamp` and `packageCount`, `internationalDistributionDetail` on a
  create/modify consolidation (the TD samples), and `clearanceFacilityLocationId`.
- **`serviceType` on `createConsolidationShipment`** is a five-value enum in the schema; the
  sync IGD and TD samples send `FEDEX_GROUND`. Typed as the five values plus any string.
- **LTL payor `accountNumber`** is a string in the schema; the TD sample sends `{ value }`.
  Typed `string | { value: string }`.
- **`accountNumber` on `createConsolidationShipment`.** Declared as
  `{ type: object, example: "XXXXX2842" }` with no properties. Every other operation uses
  `{ value: string }`, so it is typed that way (inference).
- **`ConfirmConsolidationResponse`** declares only `output`, with no `transactionId`, so
  its type is `{ output }` rather than `FedExResponse<…>`.
- **`ShippingDocument.type` and `Label.type`.** The enum is a single string with every
  value joined by `" - "`. It is split into a union (inference).
- **`Label.parts[].image`** has no `type` and a description copied from another field; the
  twin `ShippingDocument.parts[].image` is `string`, so it is typed `string` (inference).
- **Single-value enums**, probably truncated lists, typed as stated: `processingOptionType`
  (`ALLOW_ASYNCHRONOUS`), `processingOptions` items, `ConsolidationProcessingOptionsRequested.options`,
  `RegulatoryLabelContentDetail.type`, `ClearanceItemDetail.role`,
  `BatteryDetail.batteryRegulatoryType`, `EmailNotificationRecipient.notificationType`,
  `specialServiceTypes`, `epaymentProcessor`. A caller needing another value must cast.
- **`deleteConsolidationShipments`** documents no 503 while the other eight operations do,
  and its 404 examples use `{ error, error_detail }`. Its `deletionControl` is
  `DELETE_ONE_PACKAGE | DELETE_ALL_PACKAGES`.

### Type generation

`types.ts` was generated from the spec's 391 schemas, about 259 of which are reachable from
the nine requests and responses. Identical schemas are merged; near-duplicates that differ
(`Contact`, `Contact_1`, `Party_1_1`…) carry `V2`, `V3` suffixes, which is faithful to the
spec and is why names like `FedExConsolidationContactV5` exist.

### Open questions that need a real account

1. Which `consolidationKey` shape do retrieve and delete accept?
2. What `accountNumber` shape does `createConsolidationShipment` accept?
3. When is the async path taken, and what are the polling cadence and retention?
4. Are the single-value enums truncated?
5. Does `confirmConsolidation` really return `transactionId`?

## Package tracking (Track API)

Source for everything below: FedEx Developer Portal OpenAPI spec, Basic Integrated
Visibility v1.0.0, downloaded 2026-11-12. This is vendor documentation, not an observed
response; nobody has called these endpoints with a real account.

### Endpoints

| Function                                                    | Method and path                    | Code     |
| ----------------------------------------------------------- | ---------------------------------- | -------- |
| `trackPackages` (requestName `fedex.packageTracking.track`) | POST /track/v1/trackingnumbers     | FDX_0006 |
| `trackMultiplePieceShipment`                                | POST /track/v1/associatedshipments | FDX_0020 |
| `sendTrackingNotification`                                  | POST /track/v1/notifications       | FDX_0021 |
| `trackByReferences`                                         | POST /track/v1/referencenumbers    | FDX_0022 |
| `trackByTrackingControlNumber`                              | POST /track/v1/tcn                 | FDX_0023 |
| `getTrackingDocuments`                                      | POST /track/v1/trackingdocuments   | FDX_0024 |

`trackPackages` also has a published `export default trackPackages`; left in place.

### Wire quirks and spec contradictions

- **Every response field is optional.** The spec's `required` arrays appear only on request
  schemas. The v1.0.0 types marked almost every response field required; they are now optional,
  and the Track envelope is its own `FedExTrackResponse<T>` (`transactionId`, `output` optional)
  rather than the shared `FedExResponse`.
- **`trackDocuments` (SPOD) returns JSON, not binary.** Spec: 200 is `application/json`;
  `document` is an array of base64 strings (`format: byte`) to be decoded to PDF or PNG. No
  binary handling is needed. The field description says "list of byte array(base64)"; the
  schema's `type: array, format: base64` on the array itself is inconsistent with its `items`
  (`format: byte`); we follow `items` (string[]).
- **`ReferenceInformation.shipDateEndDate`**: the schema's property and `required` entry are
  `shipDateEndDate`, but the spec's own example (`Full_Schema_Tracking_References.example`) and
  every sibling tracking operation use `shipDateEnd`. The request type accepts either
  spelling, exactly one required (a union with `never` on the other), and sends whichever the
  caller gave. Both rest on the spec (schema vs example), not on a call. Open question (needs
  a real account): which spelling the server accepts.
- **Required dates vs. description (track by reference)**: schema requires `shipDateBegin` and
  `shipDateEndDate`, but the description says a call needs either `value` + `accountNumber`, or
  type + carrierCode + dates + destination postal/country. The types follow the schema (dates
  required); a real account would show whether the dates are really mandatory.
- **`PackageIdentifier.value`** is `string[]` in the schema while the example is a bare string.
  Schema followed; v1.0.0 typed it `string`.
- **`DeliveryDetails.deliveryAttempts`** is a string (example "0"); v1.0.0 typed `number`.
- **Track weights**: `Weight` is `{ unit, value: string }` (singular `unit`, string value), unlike
  the shared `FedExWeight` (`units`, number). A local `TrackWeight` is used.
- **Notification response** has a capitalised `TrackingNumberInfo` key, and
  `recipientDetails` is an array of `string[]` (`notificationEventTypes` is itself an array
  schema). Its `destinationAddress` schema (`AddressVO`) lists `addressVerificationId` in
  `required` but defines no such property; we require only `streetLines` and `countryCode`.
- **`supportHTML`** (notification request) has no type in the spec, only a description saying
  'true'/'false'; typed `boolean | "true" | "false"` (inference).
- **`DelayDetail.subType`**: the spec enum is the illustrative `SNOW`, `TORNADO`,
  `EARTHQUAKE etc`; typed `string`.
- **Paging (associated shipments)**: the request accepts `pagingDetails.resultsPerPage` and
  `pagingToken`, and the description refers to a response `pagingToken` and `moreDataAvailable`,
  but the response schema (`TrackingMPSResponse`) defines neither. Open question: where the next
  token comes back; the types do not model it.
- **`ScanEvent.derivedStatus`** is status text ("Picked Up"); `eventType` is the code ("PU").
  v1.0.0 typed both as the status-code union. The code table is kept as the exported
  `FedExTrackingStatusCodes`; it is not in this spec, so its source is unverified here.
- **Location enums differ by position**: `scanEvents[].locationType` (21 values),
  `deliveryDetails.locationType` (15 values) and the facility `locationType` on
  `destinationLocation` / `holdAtLocation` (12 values) are three different enums.
- **`TimeWindow.type`** allows `TYPICAL`, `PROJECTED`, `PRE_DELIVERY` on top of the date-and-time
  types.
- **Spec title typos** ("multiplee", "outbounddd") are in descriptions only; no effect.
- No rate limit is stated in this spec for any Track endpoint.

### Audit of existing `trackPackages` types (v1.0.0 to now)

Request: `includeDetailedScans` required, `trackingInfo[]` with optional ship dates and
`trackingNumberInfo` (`trackingNumber` required) all matched the spec. Method, URL and body
placement matched. No request change.

Breaking and non-breaking are for a TypeScript caller reading the response.

| Change                                                                                                                                                           | Kind                              |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------- |
| Envelope `FedExResponse<>` to `FedExTrackResponse<>`: `transactionId` and `output` optional                                                                      | Breaking                          |
| `completeTrackResults`, `CompleteTrackResults.trackingNumber/trackResults` optional                                                                              | Breaking                          |
| Every `TrackResult` property optional (was required for ~15)                                                                                                     | Breaking                          |
| `ServiceDetail.descripition` renamed `description` (typo)                                                                                                        | Breaking                          |
| `PackageIdentifier.value` `string` to `string[]`                                                                                                                 | Breaking                          |
| `DeliveryDetails.deliveryAttempts` `number` to `string`                                                                                                          | Breaking                          |
| Weights: `units`/`number` to `unit`/`string` (`TrackWeight`)                                                                                                     | Breaking                          |
| `ScanEvent.derivedStatus`/`eventType` status-code union to `string`                                                                                              | Non-breaking for reads (widening) |
| `ScanEvent.locationType`, `DeliveryDetails.locationType`, facility `locationType`: enums replaced with the spec's per-position enums                             | Breaking (members removed/added)  |
| `physicalPackagingType`, `packagingDescription.type`, `serviceDetail.type`: unions to `string`                                                                   | Non-breaking (widening)           |
| `declaredValue.currency` `CurrencyCodes` to `string`                                                                                                             | Non-breaking (widening)           |
| `ConsolidationDetail.eventType` union to `string`                                                                                                                | Non-breaking (widening)           |
| `DelayDetail.subType` unchanged in effect (`string`)                                                                                                             | None                              |
| `TrackAddress`: removed `urbanizationCode` (not in spec); `residential` now optional                                                                             | Breaking                          |
| `shipmentDetails.possessionStatus` removed (not in spec)                                                                                                         | Breaking                          |
| `TrackResult.error` is now `FedExTrackError` (all fields optional)                                                                                               | Breaking                          |
| `locationContactAndAddress.contact` removed from track locations (`ContactAndAddress1` has only `address`); `recipientInformation`/`shipperInformation` likewise | Breaking                          |
| `TrackResult.trackingNumberInfo` fields optional                                                                                                                 | Breaking                          |
| `CustomDeliveryOption.status` added; `TimeWindow.type` widened                                                                                                   | Non-breaking                      |
| `FedExWindow`/`FedExDistance`/`FedExReason`/`FedExDelayDetail` etc. (unexported) replaced by local equivalents                                                   | None (not exported)               |
| Added exports: `FedExTrackingStatusCodes`, `FedExTrackingStatusCode`, and all `FedExTrack*` types                                                                | Non-breaking                      |

Exported names kept: `TrackPackagesRequest`, `TrackPackagesResponse`, `TrackResult`, `ScanEvent`.
`TrackPackagesRequest` is structurally unchanged.

## Service Availability, Location Search and Postal Code Validation

Sources: FedEx Developer Portal OpenAPI specs, downloaded 2026-11-12: Service
Availability API v1.0.0, FedEx Location Search API v1.0.0, Postal Code Validation API
v1.0.0. All of this is vendor documentation.
Nothing below was observed against a live account.

### Endpoints added

| Function                      | Method and URL                                   | Error code | requestName                                             |
| ----------------------------- | ------------------------------------------------ | ---------- | ------------------------------------------------------- |
| `getServicesAndTransitTimes`  | POST `/availability/v1/transittimes`             | FDX_0070   | `fedex.serviceAvailability.getServicesAndTransitTimes`  |
| `getPackageAndServiceOptions` | POST `/availability/v1/packageandserviceoptions` | FDX_0071   | `fedex.serviceAvailability.getPackageAndServiceOptions` |
| `getSpecialServiceOptions`    | POST `/availability/v1/specialserviceoptions`    | FDX_0072   | `fedex.serviceAvailability.getSpecialServiceOptions`    |
| `findLocations`               | POST `/location/v1/locations`                    | FDX_0073   | `fedex.locationSearch.findLocations`                    |
| `validatePostalCode`          | POST `/country/v1/postal/validate`               | FDX_0074   | `fedex.postalCodeValidation.validatePostalCode`         |

All five take the JSON body as `data`; no endpoint requires a header or path/query
parameter beyond `authorization` and `content-type`, which the client supplies.

### Rate limits

None of the three specs states a rate limit, quota or throttling header (searched
for "rate limit", "throttl", "x-ratelimit" and "429" in each file; no hits). Whatever
limits apply come from the FedEx project-level limits already documented for the
client.

### Spec quirks and contradictions (schema chosen in each case)

- **Request bodies are `oneOf` with example-only members.** `body`, `body_1` and
  `body_specialserviceoptions` list the full schema plus extra members that carry only an
  `example` (`TransitTimes_Domestic`, `Package_and_Service_Options_International`, and so
  on) and no `type` or `properties`. The request types are the single `Full_Schema_*`
  member; the example-only members add no constraints.
- **Transit times: nothing is required at the top level.** `Full_Schema_TransitTime` has no
  `required` array, so `requestedShipment` is typed optional, although
  `TransitTimeRequestedShipment` itself requires `packagingType`, `recipients`,
  `requestedPackageLineItems` and `shipper`. The description implies a body without
  `requestedShipment` is meaningless; the type follows the schema.
- **`Address.postalCode` and `Address.countryCode` have no `type`** in the Service
  Availability `Address` schema (they carry only a description and an example). Typed
  `string` as an inference from the examples ("38127", "US").
- **`allOf` description-only overrides.** Several schemas (`PackageAndOptionsRequestedShipment`,
  `Dimensions`, `KeyDisplayTextVO`, `CodDetail`, `FedExFreightBillingContactAndAddress`) use
  `allOf` to re-state a property with only a new description. These are merged into one
  interface; the property type comes from the base schema.
- **Date field names differ across the three availability requests.** Transit times uses
  `shipDatestamp` (format `YYYY-MM-DD`), package and service options uses `shipDateStamp`
  (`YYYY-MM-DD`), special service options uses `shipDateStamp` (described as
  `YYYY-MM-DDThh:mm:ssTZD`, a different format under the same name). Types follow the
  schema names exactly; the casing difference is the spec's, not a typo here.
- **`permissions` is a map, not an enum.** In `EMailDetail` and `PhoneNumberDetail` the
  schema is `{type: object, additionalProperties: {enum: [GRANT, DENY]}}`. Typed
  `Record<string, "GRANT" | "DENY">`. This package's existing address-validation types model `permissions` as a plain
  enum string, so the map may be a spec generation artefact; unverified.
- **`carrierCodes` enums differ per endpoint.** Transit times: FDXE, FDXG, FXSP. Package and
  service options: FDXE, FDXG, FXFR, FXSP. Special service options: FDXE, FDXG, FXSP, FXFR.
  Location search: FDXE, FDXG. Postal validation: FDXE, FDXG, FXSP, FDXC, FXCC. Descriptions
  in the Transit Times spec also mention FXCC, which its enum omits; the enum is used.
- **Several fields are typed `string` where the meaning is boolean or a time.**
  `SearchLocationConstraints.excludeUnavailableLocations` is a string ("True, False",
  example "true"). `dropOffTimeNeeded` carries `format: HH:MM:SS`; `dropoffTime` is an ISO
  8601 string "in which only the time portion is used". Both kept as `string`.
- **Location search response echoes the request.** `LocationSummaryOutputVO` repeats the
  request fields (`sort`, `locationAttrTypes`, `sameState`, and so on) beside the results,
  with slightly different enum members (for example `OBSERVES_DAY_LIGHT_SAVING_TIMES`
  appears only on the response side, `FEDEX_RETURNS_TECHNOLOGY` only on the request side).
  Typed independently, as the spec has them.
- **Response envelopes do not match the shared `FedExResponse<T>`.** In all three
  families `transactionId` and `output` are optional and `alerts` live inside `output` with
  every Alert field optional. Each of those families still types its own envelope; the shared
  `FedExResponse<T>` has matched them since the "Response envelope" change below.
- **Error responses.** The specs document 400, 401, 403, 404, 500 (and 503 for most) with
  `ErrorResponseVO*` schemas. Not modelled; failures surface through `tryHandleRequest`.
  The Service Availability 404 on `/availability/v1/transittimes` has no body schema.

### Open questions that need a real account

- Whether the transit-times endpoint accepts a body with no `requestedShipment` (the
  schema allows it).
- Which `shipDateStamp` format special service options really accepts: date only or the
  documented `YYYY-MM-DDThh:mm:ssTZD`.
- Whether `permissions` on contact detail is sent as a bare string or a map.
- Whether the location endpoint's `excludeUnavailableLocations` wants the string
  `"true"` or accepts a JSON boolean.

## Trade and end-of-day close

Source for everything below: FedEx Developer Portal OpenAPI specs, downloaded 2026-11-12:
Estimated Duty and Tax API 1.0.0, Global Trade - API 1.0, Harmonized System (HS) Code
Classification API 2.0.0, Regulatory API 1.0.0, Ship EndofDayClose API 1.0.0. This is vendor
documentation; no call was observed against a real account. Every spec states no rate limit
for its endpoint (negative result; the client-level 1,400/10 s calibration is unchanged).

| Function                    | Method and URL                                              | Code     |
| --------------------------- | ----------------------------------------------------------- | -------- |
| `estimateDutiesAndTaxes`    | POST `/dutytax/v1/estimate`                                 | FDX_0080 |
| `retrieveRegulatoryDetails` | POST `/globaltrade/v1/shipments/regulatorydetails/retrieve` | FDX_0081 |
| `searchHarmonizedCodes`     | POST `/commodity/v2/hscodes/search`                         | FDX_0082 |
| `getRegulatoryProfile`      | POST `/regulatory/v1/profiles`                              | FDX_0083 |
| `groundEndOfDayClose`       | PUT `/ship/v1/endofday/`                                    | FDX_0084 |
| `reprintEndOfDayClose`      | POST `/ship/v1/endofday/`                                   | FDX_0085 |

### Wire quirks

- **`x-content-type` header is required** on `/dutytax/v1/estimate` and
  `/commodity/v2/hscodes/search` (spec parameter `required: true`, example `application/json`),
  in addition to `content-type`. It is absent from the other three specs (optional on
  Regulatory). The plugin sends `x-content-type: application/json` itself rather than
  asking the caller for a constant. Inference: whether FedEx actually rejects a call without
  it is unverified; `content-type` is set by the HTTP client from the JSON body.
- **Trailing slash**: `/ship/v1/endofday/` is written with a trailing slash in the spec and is
  sent verbatim. Whether FedEx also accepts it without the slash is unverified.
- **Same URL, two methods**: close is PUT and reprint is POST on one path. The two bodies share
  fields but differ in which apply: `trackingNumber` and `reprintOption` are described as
  reprint-only, and are therefore only on the reprint request type.
- **Regulatory request body is a bare JSON array** (`RegulatoryProfileRequest` is `type: array`).
  The function's `data` is that array.
- **Envelopes differ from `FedExResponse`**:
  - Regulatory 200: the schema `RegulatoryProfileResponse` has `transactionId`, `customerTransactionId` and `output.message`; no `errors`/`alerts`.
  - End-of-day 200 has `transactionId` but no `customerTransactionId`.
  - Global Trade 200 names its alert array `cxsalerts`, not `alerts`.
  - Duties/taxes and HS code 200s match `FedExResponse`.
- **Global Trade `output.countryDetails` and the `shipmentDetails` children are single objects**
  in the schema (`allOf` of one object, not arrays), although "details" naming suggests lists.
  Typed as the schema says. Unverified against a real response.
- **HS code response spells `tarriffAlternates`** (double r). Kept as is.
- Duties/taxes `commodities[].quantity` is an integer; Global Trade `commodities[].quantity` is a
  string. Both typed as the schema says.

### Spec contradictions (schema chosen)

- Global Trade minimum sample sends `customsValue: { amount: "", currency: "" }`; the schema types
  `amount` as a number (double). Typed `number`.
- Global Trade: descriptions say "either `customsClearanceDetail` or `totalCommodityValue` is
  required", but the `required` array lists neither (only `carrierCode`, `originAddress`,
  `destinationAddress`). Both left optional.
- Global Trade `commodities[].countryOfManufacture` description says "Required", but the schema's
  `required` is only `harmonizedCode`. Left optional. Same for `customsValue` on a commodity.
- Duties/taxes `summary`: the schema property is `totalDuty`, but the 200 example `SampleOutput`
  has `totalDuties`. Both are typed, optional. Source: spec schema vs spec example; which one the
  server returns is unverified.
- HS code: `originCountryCode` and `destinationCountryCodes` descriptions say "either is
  mandatory"; the `required` array lists both, but the spec's `MinimumSchemaExample1` sends only
  `destinationCountryCodes` and `MinimumSchemaExample2` only `originCountryCode`. Typed as "at
  least one of the two" (a union): the spec's own examples would not compile against the
  schema's reading. Source: spec examples and field descriptions, not a call.
- End-of-day close: both request bodies have an empty `required` array, but the minimum samples
  include `closeReqType`, `groundServiceCategory`, `accountNumber` and `closeDate` (close) or
  `reprintOption` (reprint). Every field is typed optional; a caller should follow the samples.
  The samples also give `accountNumber.value` as a JSON number (`123456789`) while the schema
  says string; typed `string`.
- End-of-day `closeReqType` is an enum shared by both bodies (`GCDR`, `RGCDR`); the description
  says `GCDR` for close and `RGCDR` for reprint. Not narrowed per function, because the schema
  does not.
- Regulatory `gtinUpcCode` and `phoneExtension` are `integer` in the schema, but the spec's request
  examples send quoted strings with leading zeros (`"00012345678905"`, `"000"`), which a number
  destroys. Both are typed `string | number`. `lotNumberQualifier` is `integer` in the schema but
  `cpscExample3` sends `"1"` (the others send `1`): typed `1 | 2 | "1" | "2"`. `isNoLabEntry`
  appears in `cpscExample3`'s testing details and is not in the schema: added as optional boolean.
  `RegulatoryProfileResponse` does define `transactionId` and `customerTransactionId` (an earlier
  note here said it had none); both are now typed, optional. Source: spec schema and examples.

### Open questions (need a real account)

- Does `/dutytax/v1/estimate` or the HS code search reject a call missing `x-content-type`?
- Does `/ship/v1/endofday/` work identically without the trailing slash?
- Does the real Global Trade response return `countryDetails` as an object or a list?
- What does a ground close return in `closeDocuments[].parts[].image` (the spec says only
  "string"; presumably base64, not stated)?

## Rates, address validation and pickup: audit of the v1.0.0 types

Sources: FedEx Developer Portal OpenAPI specs downloaded 2026-11-12: Rates and Transit Times API v1.0.0, Address Validation API v1.0.0, Pickup Request API v1.0.0. **Vendor documentation**; nobody here has a FedEx account, so nothing below was observed on the wire.

### Endpoint audit (method, URL, envelope)

Every function was checked against its spec path. No method, URL or envelope was wrong; `requestName`s and error codes are unchanged and no new code was needed.

| Function                       | Method and URL (spec)                    | Plugin  | Request body                 | Response envelope                                  |
| ------------------------------ | ---------------------------------------- | ------- | ---------------------------- | -------------------------------------------------- |
| `getFedexRatesAndTransitTimes` | POST `/rate/v1/rates/quotes`             | matches | `data.body` sent as the body | `transactionId`, `customerTransactionId`, `output` |
| `validateFedExAddress`         | POST `/address/v1/addresses/resolve`     | matches | `data` sent as the body      | same                                               |
| `checkPickupAvailability`      | POST `/pickup/v1/pickups/availabilities` | matches | `data`                       | same                                               |
| `createPickup`                 | POST `/pickup/v1/pickups`                | matches | `data`                       | same                                               |
| `cancelPickup`                 | PUT `/pickup/v1/pickups/cancel`          | matches | `data`                       | same                                               |

- Servers in all three specs: `https://apis-sandbox.fedex.com` (sandbox) and `https://apis.fedex.com` (production).
- Every operation declares `content-type` and `authorization` as required headers and `x-customer-transaction-id` and `x-locale` as optional. None is modelled: `content-type` comes from the JSON body and `authorization` from the client's OAuth block (an inference about the client, not checked here).
- Response codes declared: 200, 400, 401, 403, 404, 500, 503. No 429 is declared and none of the three specs states a rate limit (searched for "rate limit", "throttl", "too many", "per second", "429": no hits). The limit stays the one on the client template.
- Request bodies are `oneOf` lists. Only the first member of each list is a real schema (`Full_Schema_Quote_Rate`, `Full_Schema_Validate_Address`, `Full_Schema_Create_Pickup`, `Full_Schema_Pickup_Availability`, `Full_Schema_Cancel_Pickup`); every other member is an example-only schema with no `properties`. The types follow the first member.

#### The `data.body` wrapper on `getFedexRatesAndTransitTimes`

`GetRatesAndTransitTimesData` is `{ body: FedexBody }` and the function sends `data.body`. The spec has no `body` property: `body` is the name of the spec's request-body schema (`#/components/schemas/body`, a `oneOf`), and v1.0.0 carried that schema name into a wrapper object. On the wire it is a no-op. Not justified by the spec, but the public signature is kept (changing it would break every caller and is not wrong on the wire); the type now carries a comment saying so. A follow-up could accept `FedexBody` directly. Inference: the wrapper came from a spec-to-TypeScript conversion that named the property after the schema.

### Rate request fields the spec's samples send

All 22 example-bearing members (of 23) of the rate request `oneOf` were compiled against `FedexBody` (vendor documentation, spec examples against spec schema). Four disagreements were added to the types, all optional: `streetLines` on the shipper/recipient address (`FedexAddress`; the freight and intra-Europe samples), `rateRequestControlParameters.returnLocalizedDateTime` (the freight sample; the intra-Europe sample puts it at the top level of the body, where the schema has no such field, so it is not typed there), and `requestedPackageLineItems[].physicalPackaging` (intra-Europe). Not changed, by decision: the samples also send `serviceType: "FEDEX_PRIORITY"` and `subPackagingType: "OTHER"`, which the shared `FedExServiceType` and `FedExSubPackagingType` do not contain (the first is a deliberate, documented narrowing; the second is a TypeScript enum, see the open questions at the end of this file), and `null` for `customsClearanceDetail.dutiesPayment.payor.responsibleParty` in nine samples (documented only).

### Method used for the field-by-field audit

Each spec schema and each exported TypeScript type was flattened to a list of
`path, required or optional, type, enum` and the two lists were diffed, for the rate
request and response, the three pickup pairs and the address-validation pair. The
rate types were regenerated from the spec and then read, rather than patched by
hand, because the v1.0.0 request side turned out to be modelled on the Ship API,
not the Rate API. After the fixes the only differences left are the deliberate
ones below.

### Where the types deliberately differ from the spec

- **Response envelope.** Every response schema in all three specs has no `required` array, so `transactionId`, `customerTransactionId` and `output` are all optional. The shared `FedExResponse<T>` used to make `transactionId` and `output` required and `alerts[]` members' `code`, `message`, `alertType` required; it no longer does (see "Response envelope"). Everything below `output` follows the spec (optional).
- **Free strings that keep a v1.0.0 union.** Kept because the old unions were already in the published types and replacing them with `string` would widen what a reader sees: `carrierCodes[]` (rate, shared `FedexCarrierCodes`), `requestedShipment.serviceType` and `rateReplyDetails[].serviceType` (shared `FedExServiceType`), `rateReplyDetails[].packagingType` (shared `FedExPackageType`), `subPackagingType` (shared `FedExSubPackagingType`), pickup `shipmentAttributes.packagingType`, create-pickup `pickupType` (`ON_CALL`, `PACKAGE_RETURN_PROGRAM`, `REGULAR_STOP`, which the spec lists only as examples in prose), pickup `options[].countryRelationship` (`DOMESTIC`, `INTERNATIONAL`, from the description), address `AddressType`, `AddressPrecision`, `resolutionMethodName` (values listed in prose). The spec types all of these as plain strings, so a value outside the union is possible.
- **Currencies** are `string`, as the spec has no enum; v1.0.0 used the plugin-kit `CurrencyCodes` enum, which a caller could only satisfy by importing it.
- **Inferences.** `brokers[].broker.contact` (rate request) is required but defines no fields in the spec (`BrokerDetailBroker` takes `Party`, which has only `address` and `accountNumber`; its description says "Name, Email, PhoneNumber"), so it is typed with the all-optional `FedExRateContact2`. An earlier version used `FedexContact`, whose `personName`, `phoneNumber` and `companyName` are required; that invented a constraint. (`FedexContact` stays for the delivery-on-invoice recipient, whose `_contact` schema does require those three.) Pickup `defaultLatestTimeOptions` is untyped; the description gives `HH:MM:SS`, so it is typed `string`. Address `customerMessage[]` is untyped; the description lists message codes, so `string[]`. All three carry or deserve a "needs a real account" note below.
- **Kept from v1.0.0 although absent from the spec**, because removing a response field breaks readers and the field is harmless if the API never returns it: `FedExResolvedAddress.postalCode` and `FedExPickupCreateOutput.message`. Each carries a comment. Source unknown; neither appears in the spec.

### Spec contradictions (schema picked, contradiction recorded)

Rates and Transit Times:

- `requestedShipment.shipDateStamp`: description says "Required Format is YYYY-MM-DD ... Example: 2019-09-05" but also "Both the date and time portions of the string are expected to be used". The v1.0.0 comment said `YYYY-MM-DDTHH:MM:SS`. Typed as `string` with the comment `YYYY-MM-DD`. `homeDeliveryPremiumDetail.shipTimestamp` has the same double statement.
- `pickupDetail.readyDateTime` and `latestPickupDateTime` are named like timestamps but declare `format: date` and "YYYY-MM-DD".
- `requestedShipment.pickupType` is `required` and its enum is `CONTACT_FEDEX_TO_SCHEDULE`, `DROPOFF_AT_FEDEX_LOCATION`, `USE_SCHEDULED_PICKUP`. v1.0.0 made it optional and also allowed `ON_CALL`, `PACKAGE_RETURN_PROGRAM`, `REGULAR_STOP`, `TAG`, which belong to the Pickup API's `pickupType`. The legacy `PickupType` type export is kept but no field uses it.
- `customsClearanceDetail.dutiesPayment.paymentType` enum is `SENDER` only; v1.0.0 allowed `SENDER`, `RECIPIENT`, `THIRD_PARTY`, `COLLECT`.
- `smartPostInfoDetail.specialServices` enum is `USPS_DELIVERY_CONFIRMATION` only; v1.0.0 typed it with a 40-member enum of shipment special services.
- Spelling in the response: `shipmentRateDetail` returns `surCharges` (capital C, spec spelling), where `packageRateDetail` and the other detail types use `surcharges`. v1.0.0 typed `shipmentRateDetail.surcharges`. Following the spec; the real API's casing is unverified.
- `currencyExchangeRate` has `intoCurrency` in the spec; v1.0.0 typed `toCurrency`, which would always read as `undefined` if the spec is right.
- The output flag is `isEncoded` in the spec; v1.0.0 typed `encoded`.
- `shipmentRateDetail.totalDimWeight` is a `Weight` object in the spec; v1.0.0 typed it `number`.
- `accountNumber` is `required` at the top level while its `value` is optional (the reverse of v1.0.0).
- Components `EmailNotificationRecipient`, `SmsDetail`, `EMailNotificationDetail_PrintedReference` exist in the rate spec but are not referenced from the request body. v1.0.0's `emailNotificationDetail`, `groundShipment`, `groupShipment`, `serviceTypeDetail`, `expressFreightDetail`, `contentRecord`, `recipient.contact`, `recipient.accountNumber`, `homeDeliveryPremiumDetail.phoneNumber` and `pendingShipmentDetail` are not in the Rate request at all; they were apparently modelled on the Ship API (inference: some use Ship-style names).

Address Validation:

- `Address.required` is `streetLines`, `city`, `postalCode`; `countryCode` is not required. The `city` description says "City is mandatory when postalcode is not provided and includeResolutionTokens is true", which implies `city` is conditional, not always required. Schema followed.
- `stateOrProvinceCode` and `postalCode` have no `type` in the schema. The Italy example sends `"postalCode": 187` (a number). Typed `string`; a numeric postal code is outside the type.
- The request schema `ResolveContactAndAddress` has only `address` and `clientReferenceId`. The spec also defines `ParsedPersonName`, `EMailDetail`, `SocialMediaDetail`, `PhoneNumberDetail`, `PhoneNumber`, `CompanyName` but nothing references them. v1.0.0's `contact`, `contactAncillaryDetail`, `addressAncillaryDetail` and `urbanizationCode` (with the typos `fedralTaxId`, `socialMediaDeails`, `addtionalDescriptions`) are not in the spec for this endpoint.
- `resolvedAddresses[].attributes`: the spec types most flags as `boolean` but `SuiteRequiredButMissing` and `InvalidSuiteNumber` as `string` with example `"false"`, and `Matched` as `boolean` (v1.0.0 had `string`). v1.0.0 typed the flags as `"true" | "false"` strings and `Resolved` with the comment "documented but does not appear on responses". That reads as if the author looked at real responses; this cannot be checked from here, so the types accept both: `FedExAddressFlag = boolean | "true" | "false"`. `postOfficeBox` is `boolean` in the spec and was `string` in v1.0.0; it gets the same union.
- `AddressPrecision` prose lists `MULTI_TENANT_UNIT`, `MULTI_TENANT_BASE`, `PO_BOX`, `UNIQUE_ZIP`, `STREET_ADDRESS / Street`, `StreetBuilding`, `StreetOrganization`, `StreetName`; v1.0.0 had the first five plus `MULTI_TENANT_UNIT` twice.

Pickup Request:

- `readyDateTimestamp` declares `format: "[YYYY-MM-DDTHH:MM:SSZ]"` and an example ending in `Z`, while the description says "Do not include a TZD (time zone designator) as it will be ignored" and gives `2019-11-15T11:00:00`. Comment says no zone designator.
- `customerCloseTime` (create) description ends with an `Example: 2019-11-15T11:00:00` that does not match its own `HH:MM:SS` format; example field says `18:00:00`.
- `carrierCode` (create, cancel) and `carriers[]` (availability) allow `FDXE` and `FDXG` only. The availability response `carrier` also allows `FXSP` and `FXFR`. v1.0.0 used the 19-value shared `FedexCarrierCodes` in all of them.
- `associatedAccountNumber` is a string in the availability request (with a separate `associatedAccountNumberType`), but an object `{ value }` in create and cancel. v1.0.0 typed the availability field with the `FEDEX_EXPRESS | FEDEX_GROUND` enum that belongs to `associatedAccountNumberType`.
- Create `originDetail.pickupLocation` is an `allOf` that adds `address` and `contact` as required and, inside `address`, requires `city`, `countryCode`, `postalCode`, `stateOrProvinceCode`, `streetLines`. The base `Address` description says state is "Maximum length is 2" and does not mark it required. The `allOf` was followed (state required).
- Cancel has no `accountAddressOfRecord`; v1.0.0 had one.
- Availability `pickupType` is an enum (`ON_CALL`, `TAG`); create `pickupType` is a free string with three prose examples.
- `location` (cancel): "required to cancel a FedEx Express dispatch"; the create response returns it for Express pickups only. The schema marks it optional.

### Open questions that need a real account

- Whether address-validation attribute flags (`POBox`, `DPV`, `Matched`, ...) arrive as booleans or as `"true"`/`"false"` strings, and whether `Resolved` is ever returned. v1.0.0's comment suggests strings and no `Resolved`; the spec says boolean.
- Whether the real `shipmentRateDetail` key is `surCharges` or `surcharges`, and `currencyExchangeRate` `intoCurrency` or `toCurrency`.
- Whether `resolvedAddresses[].postalCode` and create-pickup `message` exist on the wire (kept from v1.0.0, not in the spec).
- Whether `pickupType` accepts anything beyond the three Rate values, and whether `INCLUDE_PICKUPRATES` in `processingOptions` is the only value (the spec lists one).
- Whether a numeric `postalCode` (Italy example) is accepted for Address Validation.
- Whether the pickup request accepts `FXSP` and `FXFR` carriers (the availability response can return them; requests list only `FDXE` and `FDXG`).
- Whether the real responses always include `transactionId` and `output` (the spec marks everything optional).

### Public exports

- Kept (names unchanged, some shapes changed): everything exported from the three `types.ts` files in v1.0.0, including every enum (`VariableOption`, `RateSortOrder`, ..., `FedExCountryCode`), `Recipient` (now an alias of `Shipper`), `TotalVariableHandlingCharges` (alias of `VariableHandlingCharge`), `BooleanString`, and the exported but now unreferenced interfaces `Alert`, `SmsDetail`, `EmailNotificationRecipient`, `PrintedReference`, `EmailNotificationDetail`, `ServiceTypeDetail`, `ExpressFreightDetail`, `ContentRecord`. The enums are no longer used by any field (fields are string-literal unions; an enum member still assigns to the union). Compared with the spec, all legacy enums match a spec enum except `SurchargeType`, which lacks 28 values the spec lists for some surcharge schemas, and the ones with no spec counterpart (`PackageSpecialService`, `SpecialService`, `Locale`, `SmartPostHubId`, `FedExCountryCode`, which v1.0.0 used for fields the spec types as strings).
- Added: the generated rate types (prefix `FedExRate`, plus the v1.0.0 names where a spec component maps to one), `FedExPickupCarrierCode` and the `FedExPickup*` generated types, `FedExValidateAddressAddress`, `FedExValidateAddressInput`, `FedExResolutionToken`, `FedExResolvedAddressAttributes`, `FedExAddressFlag`.
- `CustomsClearanceDetail` is exported by this family under its v1.0.0 name and by `purchaser`; the package barrel exports the purchaser one, and this one stays on its own module path.

### Table of every change to existing types

"For a TypeScript caller": a request type is breaking when a caller's existing literal stops compiling (removed field, newly required field, narrowed type); a response type is breaking when a reader's existing code stops compiling (removed field, field that became optional, widened type). Paths are from the root of the request body or of the whole response (`output` is the response's `output`). `required -> optional` rows with no other change are listed in a block after each table.

#### Address validation: `FedExValidateAddressRequest`

| Path                                            | Change               | Before     | After  | For a TypeScript caller |
| ----------------------------------------------- | -------------------- | ---------- | ------ | ----------------------- |
| `.addressesToValidate[].addressAncillaryDetail` | removed (12 paths)   | opt object | -      | breaking                |
| `.addressesToValidate[].contact`                | removed (15 paths)   | opt object | -      | breaking                |
| `.addressesToValidate[].contactAncillaryDetail` | removed (31 paths)   | opt object | -      | breaking                |
| `.addressesToValidate[].urbanizationCode`       | removed              | opt string | -      | breaking                |
| `.addressesToValidate[].address.city`           | optional -> required | string     | string | breaking                |
| `.addressesToValidate[].address.postalCode`     | optional -> required | string     | string | breaking                |

x (1 paths, each `required -> optional` with no other change; x):

- `.addressesToValidate[].address.countryCode`

#### Address validation: `FedExValidateAddressResponse`

| Path                                                             | Change                                                                              | Before                                                                        | After                | For a TypeScript caller |
| ---------------------------------------------------------------- | ----------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- | -------------------- | ----------------------- |
| `.output.resolvedAddresses[].attributes.AddressPrecision`        | enum members: adds ['Street', 'StreetBuilding', 'StreetName', 'StreetOrganization'] | enum:MULTI_TENANT_BASE\|MULTI_TENANT_UNIT\|PO_BOX\|STREET_ADDRESS\|UNIQUE_ZIP | enum(9)              | breaking                |
| `.output.resolvedAddresses[].attributes.CountrySupported`        | enum members: adds ['']                                                             | enum:false\|true                                                              | enum:false\|true\|\| | breaking                |
| `.output.resolvedAddresses[].attributes.DPV`                     | enum members: adds ['']                                                             | enum:false\|true                                                              | enum:false\|true\|\| | breaking                |
| `.output.resolvedAddresses[].attributes.Inserted`                | enum members: adds ['']                                                             | enum:false\|true                                                              | enum:false\|true\|\| | breaking                |
| `.output.resolvedAddresses[].attributes.InvalidSuiteNumber`      | type enum:false\|true -> string                                                     | enum:false\|true                                                              | string               | breaking                |
| `.output.resolvedAddresses[].attributes.Matched`                 | type string -> enum:false\|true\|\|                                                 | string                                                                        | enum:false\|true\|\| | non-breaking            |
| `.output.resolvedAddresses[].attributes.MultiUnitBase`           | enum members: adds ['']                                                             | enum:false\|true                                                              | enum:false\|true\|\| | breaking                |
| `.output.resolvedAddresses[].attributes.MultipleMatches`         | enum members: adds ['']                                                             | enum:false\|true                                                              | enum:false\|true\|\| | breaking                |
| `.output.resolvedAddresses[].attributes.POBox`                   | enum members: adds ['']                                                             | enum:false\|true                                                              | enum:false\|true\|\| | breaking                |
| `.output.resolvedAddresses[].attributes.POBoxOnlyZIP`            | enum members: adds ['']                                                             | enum:false\|true                                                              | enum:false\|true\|\| | breaking                |
| `.output.resolvedAddresses[].attributes.RRConversion`            | enum members: adds ['']                                                             | enum:false\|true                                                              | enum:false\|true\|\| | breaking                |
| `.output.resolvedAddresses[].attributes.Resolved`                | enum members: adds ['']                                                             | enum:false\|true                                                              | enum:false\|true\|\| | breaking                |
| `.output.resolvedAddresses[].attributes.SplitZip`                | enum members: adds ['']                                                             | enum:false\|true                                                              | enum:false\|true\|\| | breaking                |
| `.output.resolvedAddresses[].attributes.StreetAddress`           | enum members: adds ['']                                                             | enum:false\|true                                                              | enum:false\|true\|\| | breaking                |
| `.output.resolvedAddresses[].attributes.SuiteRequiredButMissing` | type enum:false\|true -> string                                                     | enum:false\|true                                                              | string               | breaking                |
| `.output.resolvedAddresses[].attributes.UniqueZIP`               | enum members: adds ['']                                                             | enum:false\|true                                                              | enum:false\|true\|\| | breaking                |
| `.output.resolvedAddresses[].attributes.ValidMultiUnit`          | enum members: adds ['']                                                             | enum:false\|true                                                              | enum:false\|true\|\| | breaking                |
| `.output.resolvedAddresses[].attributes.ValidlyFormed`           | enum members: adds ['']                                                             | enum:false\|true                                                              | enum:false\|true\|\| | breaking                |
| `.output.resolvedAddresses[].attributes.ZIP11Match`              | enum members: adds ['']                                                             | enum:false\|true                                                              | enum:false\|true\|\| | breaking                |
| `.output.resolvedAddresses[].attributes.ZIP4Match`               | enum members: adds ['']                                                             | enum:false\|true                                                              | enum:false\|true\|\| | breaking                |
| `.output.resolvedAddresses[].postOfficeBox`                      | type string -> enum:false\|true\|\|                                                 | string                                                                        | enum:false\|true\|\| | non-breaking            |

Fields that became optional in the response (1 paths, each `required -> optional` with no other change; breaking):

- `.output.resolvedAddresses`

#### Pickup request

##### `CheckPickupAvailabilityData`

| Path                           | Change                                                 | Before                           | After                                | For a TypeScript caller |
| ------------------------------ | ------------------------------------------------------ | -------------------------------- | ------------------------------------ | ----------------------- |
| `.associatedAccountNumberType` | added                                                  | -                                | opt enum:FEDEX_EXPRESS\|FEDEX_GROUND | non-breaking            |
| `.version`                     | added (4 paths)                                        | -                                | opt object                           | non-breaking            |
| `.associatedAccountNumber`     | type enum:FEDEX_EXPRESS\|FEDEX_GROUND -> string        | enum:FEDEX_EXPRESS\|FEDEX_GROUND | string                               | non-breaking            |
| `.carriers[]`                  | enum members: drops ['FDC', 'FDCC', 'FDEG', 'FDFR']... | enum(19)                         | enum:FDXE\|FDXG                      | breaking                |

Fields that became optional (8 paths, each `required -> optional` with no other change; non-breaking):

- `.packageDetails[].packageSpecialServices`
- `.packageDetails[].packageSpecialServices.specialServiceTypes`
- `.shipmentAttributes.dimensions.height`
- `.shipmentAttributes.dimensions.length`
- `.shipmentAttributes.dimensions.units`
- `.shipmentAttributes.dimensions.width`
- `.shipmentAttributes.weight.units`
- `.shipmentAttributes.weight.value`

##### `CreatePickupData`

| Path                                                       | Change                                                 | Before     | After           | For a TypeScript caller |
| ---------------------------------------------------------- | ------------------------------------------------------ | ---------- | --------------- | ----------------------- |
| `.accountAddressOfRecord.urbanizationCode`                 | removed                                                | opt string | -               | breaking                |
| `.pickupChargesPayment`                                    | added (8 paths)                                        | -          | opt object      | non-breaking            |
| `.requestedExpressPickupDetail`                            | added (2 paths)                                        | -          | opt object      | non-breaking            |
| `.version`                                                 | added (4 paths)                                        | -          | opt object      | non-breaking            |
| `.carrierCode`                                             | enum members: drops ['FDC', 'FDCC', 'FDEG', 'FDFR']... | enum(19)   | enum:FDXE\|FDXG | breaking                |
| `.originDetail.pickupLocation.address.stateOrProvinceCode` | optional -> required                                   | string     | string          | breaking                |

Fields that became optional (17 paths, each `required -> optional` with no other change; non-breaking):

- `.accountAddressOfRecord.city`
- `.accountAddressOfRecord.countryCode`
- `.accountAddressOfRecord.postalCode`
- `.accountAddressOfRecord.stateOrProvinceCode`
- `.accountAddressOfRecord.streetLines`
- `.associatedAccountNumber.value`
- `.expressFreightDetail.dimensions.height`
- `.expressFreightDetail.dimensions.length`
- `.expressFreightDetail.dimensions.units`
- `.expressFreightDetail.dimensions.width`
- `.expressFreightDetail.truckType`
- `.originDetail.pickupLocation.accountNumber.value`
- `.pickupNotificationDetail.emailDetails[].address`
- `.pickupNotificationDetail.format`
- `.pickupNotificationDetail.userMessage`
- `.totalWeight.units`
- `.totalWeight.value`

##### `CancelPickupData`

| Path                      | Change                                                 | Before     | After           | For a TypeScript caller |
| ------------------------- | ------------------------------------------------------ | ---------- | --------------- | ----------------------- |
| `.accountAddressOfRecord` | removed (10 paths)                                     | opt object | -               | breaking                |
| `.version`                | added (4 paths)                                        | -          | opt object      | non-breaking            |
| `.carrierCode`            | enum members: drops ['FDC', 'FDCC', 'FDEG', 'FDFR']... | enum(19)   | enum:FDXE\|FDXG | breaking                |

Fields that became optional (1 paths, each `required -> optional` with no other change; non-breaking):

- `.associatedAccountNumber.value`

##### `CheckPickupAvailabilityResponse`

| Path                                         | Change                                                                       | Before   | After                       | For a TypeScript caller                 |
| -------------------------------------------- | ---------------------------------------------------------------------------- | -------- | --------------------------- | --------------------------------------- |
| `.output.options[].defaultLatestTimeOptions` | added                                                                        | -        | opt string                  | non-breaking                            |
| `.output.options[].earlyCutOffTime`          | added                                                                        | -        | opt string                  | non-breaking                            |
| `.output.options[].carrier`                  | required -> optional; enum members: drops ['FDC', 'FDCC', 'FDEG', 'FDFR']... | enum(19) | enum:FDXE\|FDXG\|FXFR\|FXSP | breaking (reader must handle undefined) |

Fields that became optional (18 paths, each `required -> optional` with no other change; breaking: a reader must handle `undefined`):

- `.output.options`
- `.output.options[].accessTime`
- `.output.options[].accessTime.hours`
- `.output.options[].accessTime.minutes`
- `.output.options[].available`
- `.output.options[].countryRelationship`
- `.output.options[].cutOffTime`
- `.output.options[].defaultReadyTime`
- `.output.options[].earlyAccessTime`
- `.output.options[].earlyAccessTime.hours`
- `.output.options[].earlyAccessTime.minutes`
- `.output.options[].earlyPickupLocationId`
- `.output.options[].latestTimeOptions`
- `.output.options[].pickupDate`
- `.output.options[].readyTimeOptions`
- `.output.options[].residentialAvailable`
- `.output.options[].scheduleDay`
- `.output.requestTimestamp`

##### `CreatePickupResponse`

| Path | Change | Before | After | For a TypeScript caller |
| ---- | ------ | ------ | ----- | ----------------------- |

Fields that became optional (2 paths, each `required -> optional` with no other change; breaking: a reader must handle `undefined`):

- `.output.location`
- `.output.pickupConfirmationCode`

##### `CancelPickupResponse`

| Path | Change | Before | After | For a TypeScript caller |
| ---- | ------ | ------ | ----- | ----------------------- |

Fields that became optional (2 paths, each `required -> optional` with no other change; breaking: a reader must handle `undefined`):

- `.output.cancelConfirmationMessage`
- `.output.pickupConfirmationCode`

#### Rates and transit times: request (`FedexBody`)

| Path                                                                                                          | Change                                                                                                                            | Before                                       | After                                                                           | For a TypeScript caller |
| ------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------- | ------------------------------------------------------------------------------- | ----------------------- |
| `.requestedShipment.emailNotificationDetail`                                                                  | removed (17 paths)                                                                                                                | opt object                                   | -                                                                               | breaking                |
| `.requestedShipment.expressFreightDetail`                                                                     | removed (3 paths)                                                                                                                 | opt object                                   | -                                                                               | breaking                |
| `.requestedShipment.groundShipment`                                                                           | removed                                                                                                                           | opt boolean                                  | -                                                                               | breaking                |
| `.requestedShipment.groupShipment`                                                                            | removed                                                                                                                           | opt boolean                                  | -                                                                               | breaking                |
| `.requestedShipment.recipient.accountNumber`                                                                  | removed                                                                                                                           | opt string                                   | -                                                                               | breaking                |
| `.requestedShipment.recipient.contact`                                                                        | removed (7 paths)                                                                                                                 | opt object                                   | -                                                                               | breaking                |
| `.requestedShipment.requestedPackageLineItems[].contentRecord`                                                | removed (6 paths)                                                                                                                 | opt array                                    | -                                                                               | breaking                |
| `.requestedShipment.serviceTypeDetail`                                                                        | removed (5 paths)                                                                                                                 | opt object                                   | -                                                                               | breaking                |
| `.requestedShipment.shipmentSpecialServices.homeDeliveryPremiumDetail.phoneNumber`                            | removed (6 paths)                                                                                                                 | opt object                                   | -                                                                               | breaking                |
| `.requestedShipment.shipmentSpecialServices.pendingShipmentDetail`                                            | removed (32 paths)                                                                                                                | opt object                                   | -                                                                               | breaking                |
| `.requestedShipment.shipmentSpecialServices.shipmentCODDetail.addTransportationChargesDetail.chargeTotalType` | removed                                                                                                                           | opt enum:CURRENT_PACKAGE\|SUM_OF_PACKAGES    | -                                                                               | breaking                |
| `.processingOptions`                                                                                          | added (2 paths)                                                                                                                   | -                                            | opt array                                                                       | non-breaking            |
| `.requestedShipment.customsClearanceDetail.brokers`                                                           | added (19 paths)                                                                                                                  | -                                            | opt array                                                                       | non-breaking            |
| `.requestedShipment.pickupDetail`                                                                             | added (6 paths)                                                                                                                   | -                                            | opt object                                                                      | non-breaking            |
| `.requestedShipment.requestedPackageLineItems[].packageSpecialServices.alcoholDetail`                         | added (3 paths)                                                                                                                   | -                                            | opt object                                                                      | non-breaking            |
| `.requestedShipment.requestedPackageLineItems[].packageSpecialServices.batteryDetails`                        | added (5 paths)                                                                                                                   | -                                            | opt array                                                                       | non-breaking            |
| `.requestedShipment.requestedPackageLineItems[].packageSpecialServices.dangerousGoodsDetail`                  | added (54 paths)                                                                                                                  | -                                            | opt object                                                                      | non-breaking            |
| `.requestedShipment.requestedPackageLineItems[].packageSpecialServices.dryIceWeight`                          | added (3 paths)                                                                                                                   | -                                            | opt object                                                                      | non-breaking            |
| `.requestedShipment.requestedPackageLineItems[].packageSpecialServices.packageCODDetail`                      | added (5 paths)                                                                                                                   | -                                            | opt object                                                                      | non-breaking            |
| `.requestedShipment.requestedPackageLineItems[].packageSpecialServices.pieceCountVerificationBoxCount`        | added                                                                                                                             | -                                            | opt number                                                                      | non-breaking            |
| `.requestedShipment.requestedPackageLineItems[].packageSpecialServices.standaloneBatteryDetails`              | added (3 paths)                                                                                                                   | -                                            | opt array                                                                       | non-breaking            |
| `.requestedShipment.shipmentSpecialServices.deliveryOnInvoiceAcceptanceDetail.recipient.accountNumber.value`  | added                                                                                                                             | -                                            | opt string                                                                      | non-breaking            |
| `.requestedShipment.shipmentSpecialServices.deliveryOnInvoiceAcceptanceDetail.recipient.address.streetLines`  | added (2 paths)                                                                                                                   | -                                            | opt array                                                                       | non-breaking            |
| `.requestedShipment.shipmentSpecialServices.shipmentCODDetail.addTransportationChargesDetail.chargeLevelType` | added                                                                                                                             | -                                            | opt enum:CURRENT_PACKAGE\|SUM_OF_PACKAGES                                       | non-breaking            |
| `.version`                                                                                                    | added (4 paths)                                                                                                                   | -                                            | opt object                                                                      | non-breaking            |
| `.accountNumber`                                                                                              | optional -> required                                                                                                              | object                                       | object                                                                          | breaking                |
| `.requestedShipment.customsClearanceDetail.commodities[].customsValue.currency`                               | required -> optional; type enum(178) -> string                                                                                    | enum(178)                                    | string                                                                          | non-breaking            |
| `.requestedShipment.customsClearanceDetail.commodities[].unitPrice.currency`                                  | required -> optional; type enum(178) -> string                                                                                    | enum(178)                                    | string                                                                          | non-breaking            |
| `.requestedShipment.customsClearanceDetail.dutiesPayment.paymentType`                                         | required -> optional; enum members: drops ['COLLECT', 'RECIPIENT', 'THIRD_PARTY']                                                 | enum:COLLECT\|RECIPIENT\|SENDER\|THIRD_PARTY | enum:SENDER                                                                     | breaking                |
| `.requestedShipment.pickupType`                                                                               | optional -> required; enum members: drops ['ON_CALL', 'PACKAGE_RETURN_PROGRAM', 'REGULAR_STOP', 'TAG']                            | enum(7)                                      | enum:CONTACT_FEDEX_TO_SCHEDULE\|DROPOFF_AT_FEDEX_LOCATION\|USE_SCHEDULED_PICKUP | breaking                |
| `.requestedShipment.preferredCurrency`                                                                        | type enum(178) -> string                                                                                                          | enum(178)                                    | string                                                                          | non-breaking            |
| `.requestedShipment.requestedPackageLineItems[].declaredValue.currency`                                       | required -> optional; type enum(178) -> string                                                                                    | enum(178)                                    | string                                                                          | non-breaking            |
| `.requestedShipment.requestedPackageLineItems[].packageSpecialServices.signatureOptionType`                   | required -> optional; type string -> enum:ADULT\|DIRECT\|INDIRECT\|NO_SIGNATURE_REQUIRED\|SERVICE_DEFAULT                         | string                                       | enum:ADULT\|DIRECT\|INDIRECT\|NO_SIGNATURE_REQUIRED\|SERVICE_DEFAULT            | breaking                |
| `.requestedShipment.requestedPackageLineItems[].packageSpecialServices.specialServiceTypes[]`                 | type enum(14) -> string                                                                                                           | enum(14)                                     | string                                                                          | non-breaking            |
| `.requestedShipment.requestedPackageLineItems[].variableHandlingChargeDetail.fixedValue.currency`             | required -> optional; type enum(178) -> string                                                                                    | enum(178)                                    | string                                                                          | non-breaking            |
| `.requestedShipment.shipmentSpecialServices.deliveryOnInvoiceAcceptanceDetail.recipient.accountNumber`        | type string -> object                                                                                                             | string                                       | object                                                                          | breaking                |
| `.requestedShipment.shipmentSpecialServices.deliveryOnInvoiceAcceptanceDetail.recipient.contact`              | optional -> required                                                                                                              | object                                       | object                                                                          | breaking                |
| `.requestedShipment.shipmentSpecialServices.returnShipmentDetail.returnType`                                  | type string -> enum(6)                                                                                                            | string                                       | enum(6)                                                                         | breaking                |
| `.requestedShipment.shipmentSpecialServices.specialServiceTypes[]`                                            | type union -> string                                                                                                              | union                                        | string                                                                          | breaking                |
| `.requestedShipment.smartPostInfoDetail.hubId`                                                                | type enum(37) -> string                                                                                                           | enum(37)                                     | string                                                                          | non-breaking            |
| `.requestedShipment.smartPostInfoDetail.specialServices`                                                      | enum members: adds ['USPS_DELIVERY_CONFIRMATION'] drops ['APPOINTMENT', 'BROKER_SELECT_OPTION', 'CALL_BEFORE_DELIVERY', 'COD']... | enum(40)                                     | enum:USPS_DELIVERY_CONFIRMATION                                                 | breaking                |
| `.requestedShipment.variableHandlingChargeDetail.fixedValue.currency`                                         | required -> optional; type enum(178) -> string                                                                                    | enum(178)                                    | string                                                                          | non-breaking            |

Fields that became optional in the request (44 paths, each `required -> optional` with no other change; non-breaking):

- `.accountNumber.value`
- `.requestedShipment.customsClearanceDetail.commercialInvoice.shipmentPurpose`
- `.requestedShipment.customsClearanceDetail.commodities[].customsValue.amount`
- `.requestedShipment.customsClearanceDetail.commodities[].description`
- `.requestedShipment.customsClearanceDetail.commodities[].quantity`
- `.requestedShipment.customsClearanceDetail.commodities[].unitPrice.amount`
- `.requestedShipment.customsClearanceDetail.commodities[].weight`
- `.requestedShipment.customsClearanceDetail.dutiesPayment.payor`
- `.requestedShipment.customsClearanceDetail.dutiesPayment.payor.responsibleParty`
- `.requestedShipment.customsClearanceDetail.dutiesPayment.payor.responsibleParty.accountNumber.value`
- `.requestedShipment.customsClearanceDetail.dutiesPayment.payor.responsibleParty.address.countryCode`
- `.requestedShipment.customsClearanceDetail.dutiesPayment.payor.responsibleParty.address.postalCode`
- `.requestedShipment.customsClearanceDetail.dutiesPayment.payor.responsibleParty.contact.companyName`
- `.requestedShipment.customsClearanceDetail.dutiesPayment.payor.responsibleParty.contact.personName`
- `.requestedShipment.customsClearanceDetail.dutiesPayment.payor.responsibleParty.contact.phoneNumber`
- `.requestedShipment.rateRequestType`
- `.requestedShipment.requestedPackageLineItems[].declaredValue.amount`
- `.requestedShipment.requestedPackageLineItems[].packageSpecialServices.specialServiceTypes`
- `.requestedShipment.requestedPackageLineItems[].variableHandlingChargeDetail.fixedValue.amount`
- `.requestedShipment.shipmentSpecialServices.deliveryOnInvoiceAcceptanceDetail.recipient.address.postalCode`
- `.requestedShipment.shipmentSpecialServices.holdAtLocationDetail.locationContactAndAddress.address.countryCode`
- `.requestedShipment.shipmentSpecialServices.holdAtLocationDetail.locationContactAndAddress.address.postalCode`
- `.requestedShipment.shipmentSpecialServices.holdAtLocationDetail.locationContactAndAddress.contact.companyName`
- `.requestedShipment.shipmentSpecialServices.holdAtLocationDetail.locationContactAndAddress.contact.personName`
- `.requestedShipment.shipmentSpecialServices.holdAtLocationDetail.locationContactAndAddress.contact.phoneNumber`
- `.requestedShipment.shipmentSpecialServices.internationalControlledExportDetail.type`
- `.requestedShipment.shipmentSpecialServices.internationalTrafficInArmsRegulationsDetail.licenseOrExemptionNumber`
- `.requestedShipment.shipmentSpecialServices.shipmentCODDetail.codRecipient.accountNumber.value`
- `.requestedShipment.shipmentSpecialServices.shipmentCODDetail.codRecipient.address.countryCode`
- `.requestedShipment.shipmentSpecialServices.shipmentCODDetail.codRecipient.address.postalCode`
- `.requestedShipment.shipmentSpecialServices.shipmentCODDetail.codRecipient.contact.companyName`
- `.requestedShipment.shipmentSpecialServices.shipmentCODDetail.codRecipient.contact.personName`
- `.requestedShipment.shipmentSpecialServices.shipmentCODDetail.codRecipient.contact.phoneNumber`
- `.requestedShipment.shipmentSpecialServices.shipmentCODDetail.financialInstitutionContactAndAddress.address`
- `.requestedShipment.shipmentSpecialServices.shipmentCODDetail.financialInstitutionContactAndAddress.address.countryCode`
- `.requestedShipment.shipmentSpecialServices.shipmentCODDetail.financialInstitutionContactAndAddress.address.postalCode`
- `.requestedShipment.shipmentSpecialServices.shipmentCODDetail.financialInstitutionContactAndAddress.contact`
- `.requestedShipment.shipmentSpecialServices.shipmentCODDetail.financialInstitutionContactAndAddress.contact.companyName`
- `.requestedShipment.shipmentSpecialServices.shipmentCODDetail.financialInstitutionContactAndAddress.contact.personName`
- `.requestedShipment.shipmentSpecialServices.shipmentCODDetail.financialInstitutionContactAndAddress.contact.phoneNumber`
- `.requestedShipment.shipmentSpecialServices.shipmentDryIceDetail.packageCount`
- `.requestedShipment.shipmentSpecialServices.shipmentDryIceDetail.totalWeight.units`
- `.requestedShipment.shipmentSpecialServices.shipmentDryIceDetail.totalWeight.value`
- `.requestedShipment.variableHandlingChargeDetail.fixedValue.amount`

#### Rates and transit times: response (`GetRatesAndTransitTimesResponse`)

| Path                                                                                                           | Change                                         | Before        | After                                                                 | For a TypeScript caller                 |
| -------------------------------------------------------------------------------------------------------------- | ---------------------------------------------- | ------------- | --------------------------------------------------------------------- | --------------------------------------- |
| `.output.encoded`                                                                                              | removed                                        | REQ boolean   | -                                                                     | breaking                                |
| `.output.rateReplyDetails[].brokerDetail.broker.contact`                                                       | removed (7 paths)                              | REQ object    | -                                                                     | breaking                                |
| `.output.rateReplyDetails[].brokerDetail.brokerCommitDayOfWeek`                                                | removed                                        | REQ string    | -                                                                     | breaking                                |
| `.output.rateReplyDetails[].brokerDetail.brokerCommitTimestamp`                                                | removed                                        | REQ string    | -                                                                     | breaking                                |
| `.output.rateReplyDetails[].brokerDetail.brokerLocationId`                                                     | removed                                        | REQ string    | -                                                                     | breaking                                |
| `.output.rateReplyDetails[].brokerDetail.brokerToDestinationDays`                                              | removed                                        | REQ number    | -                                                                     | breaking                                |
| `.output.rateReplyDetails[].ratedShipmentDetails[].edtCharges[].alternateHarmonizedCodes`                      | removed (2 paths)                              | REQ array     | -                                                                     | breaking                                |
| `.output.rateReplyDetails[].ratedShipmentDetails[].preferredEdtCharges[].alternateHarmonizedCodes`             | removed (2 paths)                              | REQ array     | -                                                                     | breaking                                |
| `.output.rateReplyDetails[].ratedShipmentDetails[].shipmentLegRateDetails[].currencyExchangeRate.toCurrency`   | removed                                        | REQ enum(178) | -                                                                     | breaking                                |
| `.output.rateReplyDetails[].ratedShipmentDetails[].shipmentRateDetail.currencyExchangeRate.toCurrency`         | removed                                        | REQ enum(178) | -                                                                     | breaking                                |
| `.output.rateReplyDetails[].ratedShipmentDetails[].shipmentRateDetail.surcharges`                              | removed (7 paths)                              | REQ array     | -                                                                     | breaking                                |
| `.output.rateReplyDetails[].serviceDescription.operatingOrgCodes`                                              | removed (2 paths)                              | REQ array     | -                                                                     | breaking                                |
| `.output.isEncoded`                                                                                            | added                                          | -             | opt boolean                                                           | non-breaking                            |
| `.output.rateReplyDetails[].commit.delayDetails`                                                               | added (7 paths)                                | -             | opt object                                                            | non-breaking                            |
| `.output.rateReplyDetails[].ratedShipmentDetails[].pickupRateDetail`                                           | added (144 paths)                              | -             | opt object                                                            | non-breaking                            |
| `.output.rateReplyDetails[].ratedShipmentDetails[].shipmentLegRateDetails[].currencyExchangeRate.intoCurrency` | added                                          | -             | opt string                                                            | non-breaking                            |
| `.output.rateReplyDetails[].ratedShipmentDetails[].shipmentRateDetail.currencyExchangeRate.intoCurrency`       | added                                          | -             | opt string                                                            | non-breaking                            |
| `.output.rateReplyDetails[].ratedShipmentDetails[].shipmentRateDetail.ratingBasis`                             | added                                          | -             | opt enum:FLAT_RATE_PER_PACK\|PACK_WEIGHT_BASED\|SHIPMENT_WEIGHT_BASED | non-breaking                            |
| `.output.rateReplyDetails[].ratedShipmentDetails[].shipmentRateDetail.surCharges`                              | added (7 paths)                                | -             | opt array                                                             | non-breaking                            |
| `.output.rateReplyDetails[].ratedShipmentDetails[].shipmentRateDetail.taxes`                                   | added (6 paths)                                | -             | opt array                                                             | non-breaking                            |
| `.output.rateReplyDetails[].ratedShipmentDetails[].shipmentRateDetail.totalDimWeight.units`                    | added                                          | -             | opt enum:KG\|LB                                                       | non-breaking                            |
| `.output.rateReplyDetails[].ratedShipmentDetails[].shipmentRateDetail.totalDimWeight.value`                    | added                                          | -             | opt number                                                            | non-breaking                            |
| `.output.rateReplyDetails[].ratedShipmentDetails[].totalNetFedExTransportationAndPickupCharge`                 | added (3 paths)                                | -             | opt object                                                            | non-breaking                            |
| `.output.rateReplyDetails[].ratedShipmentDetails[].totalNetTransportationAndPickupCharge`                      | added (3 paths)                                | -             | opt object                                                            | non-breaking                            |
| `.output.rateReplyDetails[].ratedShipmentDetails[].ratedPackages[].packageRateDetail.rateType`                 | required -> optional; type enum(9) -> string   | enum(9)       | string                                                                | breaking (reader must handle undefined) |
| `.output.rateReplyDetails[].ratedShipmentDetails[].ratedPackages[].packageRateDetail.ratedWeightMethod`        | required -> optional; type enum(13) -> string  | enum(13)      | string                                                                | breaking (reader must handle undefined) |
| `.output.rateReplyDetails[].ratedShipmentDetails[].ratedPackages[].packageRateDetail.surcharges[].type`        | required -> optional; type enum(92) -> string  | enum(92)      | string                                                                | breaking (reader must handle undefined) |
| `.output.rateReplyDetails[].ratedShipmentDetails[].shipmentLegRateDetails[].currency`                          | required -> optional; type enum(178) -> string | enum(178)     | string                                                                | breaking (reader must handle undefined) |
| `.output.rateReplyDetails[].ratedShipmentDetails[].shipmentLegRateDetails[].currencyExchangeRate.fromCurrency` | required -> optional; type enum(178) -> string | enum(178)     | string                                                                | breaking (reader must handle undefined) |
| `.output.rateReplyDetails[].ratedShipmentDetails[].shipmentLegRateDetails[].surcharges[].type`                 | required -> optional; type enum(92) -> string  | enum(92)      | string                                                                | breaking (reader must handle undefined) |
| `.output.rateReplyDetails[].ratedShipmentDetails[].shipmentRateDetail.currency`                                | required -> optional; type enum(178) -> string | enum(178)     | string                                                                | breaking (reader must handle undefined) |
| `.output.rateReplyDetails[].ratedShipmentDetails[].shipmentRateDetail.currencyExchangeRate.fromCurrency`       | required -> optional; type enum(178) -> string | enum(178)     | string                                                                | breaking (reader must handle undefined) |
| `.output.rateReplyDetails[].ratedShipmentDetails[].shipmentRateDetail.totalDimWeight`                          | required -> optional; type number -> object    | number        | object                                                                | breaking (reader must handle undefined) |
| `.output.rateReplyDetails[].serviceDescription.serviceType`                                                    | required -> optional; type enum(52) -> string  | enum(52)      | string                                                                | breaking (reader must handle undefined) |

Fields that became optional in the response (198 paths, each `required -> optional` with no other change; breaking: a reader must handle `undefined`):

- `.output.quoteDate`
- `.output.rateReplyDetails`
- `.output.rateReplyDetails[].brokerDetail`
- `.output.rateReplyDetails[].brokerDetail.broker.accountNumber`
- `.output.rateReplyDetails[].brokerDetail.broker.accountNumber.value`
- `.output.rateReplyDetails[].brokerDetail.broker.address.countryCode`
- `.output.rateReplyDetails[].brokerDetail.broker.address.postalCode`
- `.output.rateReplyDetails[].brokerDetail.brokerAddress`
- `.output.rateReplyDetails[].brokerDetail.brokerAddress.city`
- `.output.rateReplyDetails[].brokerDetail.brokerAddress.classification`
- `.output.rateReplyDetails[].brokerDetail.brokerAddress.countryCode`
- `.output.rateReplyDetails[].brokerDetail.brokerAddress.countryName`
- `.output.rateReplyDetails[].brokerDetail.brokerAddress.geographicCoordinates`
- `.output.rateReplyDetails[].brokerDetail.brokerAddress.postalCode`
- `.output.rateReplyDetails[].brokerDetail.brokerAddress.residential`
- `.output.rateReplyDetails[].brokerDetail.brokerAddress.stateOrProvinceCode`
- `.output.rateReplyDetails[].brokerDetail.brokerAddress.streetLines`
- `.output.rateReplyDetails[].brokerDetail.brokerAddress.urbanizationCode`
- `.output.rateReplyDetails[].commit`
- `.output.rateReplyDetails[].commit.alternativeCommodityNames`
- `.output.rateReplyDetails[].commit.commitMessageDetails`
- `.output.rateReplyDetails[].commit.commodityName`
- `.output.rateReplyDetails[].commit.dateDetail`
- `.output.rateReplyDetails[].commit.dateDetail.dayFormat`
- `.output.rateReplyDetails[].commit.dateDetail.dayOfWeek`
- `.output.rateReplyDetails[].commit.daysInTransit`
- `.output.rateReplyDetails[].commit.guaranteedType`
- `.output.rateReplyDetails[].commit.label`
- `.output.rateReplyDetails[].commit.saturdayDelivery`
- `.output.rateReplyDetails[].commit.smartPostCommitTime`
- `.output.rateReplyDetails[].commit.transitDays`
- `.output.rateReplyDetails[].commit.transitDays.description`
- `.output.rateReplyDetails[].commit.transitDays.maximumTransitTime`
- `.output.rateReplyDetails[].commit.transitDays.minimumTransitTime`
- `.output.rateReplyDetails[].customerMessages`
- `.output.rateReplyDetails[].customerMessages[].code`
- `.output.rateReplyDetails[].customerMessages[].message`
- `.output.rateReplyDetails[].operationalDetail`
- `.output.rateReplyDetails[].operationalDetail.MaximumTransitTime`
- `.output.rateReplyDetails[].operationalDetail.airportId`
- `.output.rateReplyDetails[].operationalDetail.astraDescription`
- `.output.rateReplyDetails[].operationalDetail.astraPlannedServiceLevel`
- `.output.rateReplyDetails[].operationalDetail.commitDate`
- `.output.rateReplyDetails[].operationalDetail.commitDays`
- `.output.rateReplyDetails[].operationalDetail.countryCodes`
- `.output.rateReplyDetails[].operationalDetail.customTransitTime`
- `.output.rateReplyDetails[].operationalDetail.deliveryDate`
- `.output.rateReplyDetails[].operationalDetail.deliveryDay`
- `.output.rateReplyDetails[].operationalDetail.deliveryEligibilities`
- `.output.rateReplyDetails[].operationalDetail.destinationLocationIds`
- `.output.rateReplyDetails[].operationalDetail.destinationLocationNumbers`
- `.output.rateReplyDetails[].operationalDetail.destinationLocationStateOrProvinceCodes`
- `.output.rateReplyDetails[].operationalDetail.destinationPostalCode`
- `.output.rateReplyDetails[].operationalDetail.destinationServiceAreas`
- `.output.rateReplyDetails[].operationalDetail.ineligibleForMoneyBackGuarantee`
- `.output.rateReplyDetails[].operationalDetail.originLocationIds`
- `.output.rateReplyDetails[].operationalDetail.originLocationNumbers`
- `.output.rateReplyDetails[].operationalDetail.originPostalCodes`
- `.output.rateReplyDetails[].operationalDetail.originServiceAreas`
- `.output.rateReplyDetails[].operationalDetail.packagingCode`
- `.output.rateReplyDetails[].operationalDetail.publishedDeliveryTime`
- `.output.rateReplyDetails[].operationalDetail.scac`
- `.output.rateReplyDetails[].operationalDetail.serviceCode`
- `.output.rateReplyDetails[].operationalDetail.stateOrProvinceCodes`
- `.output.rateReplyDetails[].operationalDetail.transitTime`
- `.output.rateReplyDetails[].operationalDetail.ursaPrefixCode`
- `.output.rateReplyDetails[].operationalDetail.ursaSuffixCode`
- `.output.rateReplyDetails[].packagingType`
- `.output.rateReplyDetails[].ratedShipmentDetails`
- `.output.rateReplyDetails[].ratedShipmentDetails[].ancillaryFeesAndTaxes`
- `.output.rateReplyDetails[].ratedShipmentDetails[].ancillaryFeesAndTaxes[].amount`
- `.output.rateReplyDetails[].ratedShipmentDetails[].ancillaryFeesAndTaxes[].description`
- `.output.rateReplyDetails[].ratedShipmentDetails[].ancillaryFeesAndTaxes[].type`
- `.output.rateReplyDetails[].ratedShipmentDetails[].edtCharges`
- `.output.rateReplyDetails[].ratedShipmentDetails[].edtCharges[].edtTaxDetail`
- `.output.rateReplyDetails[].ratedShipmentDetails[].edtCharges[].edtTaxDetail.amount`
- `.output.rateReplyDetails[].ratedShipmentDetails[].edtCharges[].edtTaxDetail.description`
- `.output.rateReplyDetails[].ratedShipmentDetails[].edtCharges[].edtTaxDetail.edtTaxType`
- `.output.rateReplyDetails[].ratedShipmentDetails[].edtCharges[].edtTaxDetail.effectiveDate`
- `.output.rateReplyDetails[].ratedShipmentDetails[].edtCharges[].edtTaxDetail.formula`
- `.output.rateReplyDetails[].ratedShipmentDetails[].edtCharges[].edtTaxDetail.name`
- `.output.rateReplyDetails[].ratedShipmentDetails[].edtCharges[].edtTaxDetail.taxableValue`
- `.output.rateReplyDetails[].ratedShipmentDetails[].edtCharges[].harmonizedCode`
- `.output.rateReplyDetails[].ratedShipmentDetails[].freightChargeBasis`
- `.output.rateReplyDetails[].ratedShipmentDetails[].preferredEdtCharges`
- `.output.rateReplyDetails[].ratedShipmentDetails[].preferredEdtCharges[].edtTaxDetail`
- `.output.rateReplyDetails[].ratedShipmentDetails[].preferredEdtCharges[].edtTaxDetail.amount`
- `.output.rateReplyDetails[].ratedShipmentDetails[].preferredEdtCharges[].edtTaxDetail.description`
- `.output.rateReplyDetails[].ratedShipmentDetails[].preferredEdtCharges[].edtTaxDetail.edtTaxType`
- `.output.rateReplyDetails[].ratedShipmentDetails[].preferredEdtCharges[].edtTaxDetail.effectiveDate`
- `.output.rateReplyDetails[].ratedShipmentDetails[].preferredEdtCharges[].edtTaxDetail.formula`
- `.output.rateReplyDetails[].ratedShipmentDetails[].preferredEdtCharges[].edtTaxDetail.name`
- `.output.rateReplyDetails[].ratedShipmentDetails[].preferredEdtCharges[].edtTaxDetail.taxableValue`
- `.output.rateReplyDetails[].ratedShipmentDetails[].preferredEdtCharges[].harmonizedCode`
- `.output.rateReplyDetails[].ratedShipmentDetails[].quoteNumber`
- `.output.rateReplyDetails[].ratedShipmentDetails[].rateType`
- `.output.rateReplyDetails[].ratedShipmentDetails[].ratedPackages`
- `.output.rateReplyDetails[].ratedShipmentDetails[].ratedPackages[].effectiveNetDiscount`
- `.output.rateReplyDetails[].ratedShipmentDetails[].ratedPackages[].groupNumber`
- `.output.rateReplyDetails[].ratedShipmentDetails[].ratedPackages[].packageRateDetail`
- `.output.rateReplyDetails[].ratedShipmentDetails[].ratedPackages[].packageRateDetail.baseCharge`
- `.output.rateReplyDetails[].ratedShipmentDetails[].ratedPackages[].packageRateDetail.billingWeight`
- `.output.rateReplyDetails[].ratedShipmentDetails[].ratedPackages[].packageRateDetail.freightDiscounts`
- `.output.rateReplyDetails[].ratedShipmentDetails[].ratedPackages[].packageRateDetail.freightDiscounts[].amount`
- `.output.rateReplyDetails[].ratedShipmentDetails[].ratedPackages[].packageRateDetail.freightDiscounts[].description`
- `.output.rateReplyDetails[].ratedShipmentDetails[].ratedPackages[].packageRateDetail.freightDiscounts[].name`
- `.output.rateReplyDetails[].ratedShipmentDetails[].ratedPackages[].packageRateDetail.freightDiscounts[].percent`
- `.output.rateReplyDetails[].ratedShipmentDetails[].ratedPackages[].packageRateDetail.freightDiscounts[].type`
- `.output.rateReplyDetails[].ratedShipmentDetails[].ratedPackages[].packageRateDetail.netCharge`
- `.output.rateReplyDetails[].ratedShipmentDetails[].ratedPackages[].packageRateDetail.netFedExCharge`
- `.output.rateReplyDetails[].ratedShipmentDetails[].ratedPackages[].packageRateDetail.netFreight`
- `.output.rateReplyDetails[].ratedShipmentDetails[].ratedPackages[].packageRateDetail.surcharges`
- `.output.rateReplyDetails[].ratedShipmentDetails[].ratedPackages[].packageRateDetail.surcharges[].amount`
- `.output.rateReplyDetails[].ratedShipmentDetails[].ratedPackages[].packageRateDetail.surcharges[].description`
- `.output.rateReplyDetails[].ratedShipmentDetails[].ratedPackages[].packageRateDetail.surcharges[].level`
- `.output.rateReplyDetails[].ratedShipmentDetails[].ratedPackages[].packageRateDetail.surcharges[].name`
- `.output.rateReplyDetails[].ratedShipmentDetails[].ratedPackages[].packageRateDetail.totalFreightDiscounts`
- `.output.rateReplyDetails[].ratedShipmentDetails[].ratedPackages[].packageRateDetail.totalRebates`
- `.output.rateReplyDetails[].ratedShipmentDetails[].ratedPackages[].packageRateDetail.totalSurcharges`
- `.output.rateReplyDetails[].ratedShipmentDetails[].ratedPackages[].packageRateDetail.totalTaxes`
- `.output.rateReplyDetails[].ratedShipmentDetails[].ratedWeightMethod`
- `.output.rateReplyDetails[].ratedShipmentDetails[].shipmentLegRateDetails`
- `.output.rateReplyDetails[].ratedShipmentDetails[].shipmentLegRateDetails[].currencyExchangeRate`
- `.output.rateReplyDetails[].ratedShipmentDetails[].shipmentLegRateDetails[].currencyExchangeRate.rate`
- `.output.rateReplyDetails[].ratedShipmentDetails[].shipmentLegRateDetails[].discounts`
- `.output.rateReplyDetails[].ratedShipmentDetails[].shipmentLegRateDetails[].discounts[].amount`
- `.output.rateReplyDetails[].ratedShipmentDetails[].shipmentLegRateDetails[].discounts[].description`
- `.output.rateReplyDetails[].ratedShipmentDetails[].shipmentLegRateDetails[].discounts[].name`
- `.output.rateReplyDetails[].ratedShipmentDetails[].shipmentLegRateDetails[].discounts[].percent`
- `.output.rateReplyDetails[].ratedShipmentDetails[].shipmentLegRateDetails[].discounts[].type`
- `.output.rateReplyDetails[].ratedShipmentDetails[].shipmentLegRateDetails[].legDescription`
- `.output.rateReplyDetails[].ratedShipmentDetails[].shipmentLegRateDetails[].pricingCode`
- `.output.rateReplyDetails[].ratedShipmentDetails[].shipmentLegRateDetails[].rateScale`
- `.output.rateReplyDetails[].ratedShipmentDetails[].shipmentLegRateDetails[].specialRatingApplied`
- `.output.rateReplyDetails[].ratedShipmentDetails[].shipmentLegRateDetails[].surcharges`
- `.output.rateReplyDetails[].ratedShipmentDetails[].shipmentLegRateDetails[].surcharges[].amount`
- `.output.rateReplyDetails[].ratedShipmentDetails[].shipmentLegRateDetails[].surcharges[].description`
- `.output.rateReplyDetails[].ratedShipmentDetails[].shipmentLegRateDetails[].surcharges[].level`
- `.output.rateReplyDetails[].ratedShipmentDetails[].shipmentLegRateDetails[].surcharges[].name`
- `.output.rateReplyDetails[].ratedShipmentDetails[].shipmentLegRateDetails[].taxes`
- `.output.rateReplyDetails[].ratedShipmentDetails[].shipmentLegRateDetails[].taxes[].amount`
- `.output.rateReplyDetails[].ratedShipmentDetails[].shipmentLegRateDetails[].taxes[].description`
- `.output.rateReplyDetails[].ratedShipmentDetails[].shipmentLegRateDetails[].taxes[].name`
- `.output.rateReplyDetails[].ratedShipmentDetails[].shipmentLegRateDetails[].taxes[].type`
- `.output.rateReplyDetails[].ratedShipmentDetails[].shipmentLegRateDetails[].totalBaseCharge`
- `.output.rateReplyDetails[].ratedShipmentDetails[].shipmentLegRateDetails[].totalBillingWeight`
- `.output.rateReplyDetails[].ratedShipmentDetails[].shipmentLegRateDetails[].totalBillingWeight.units`
- `.output.rateReplyDetails[].ratedShipmentDetails[].shipmentLegRateDetails[].totalBillingWeight.value`
- `.output.rateReplyDetails[].ratedShipmentDetails[].shipmentLegRateDetails[].totalNetCharge`
- `.output.rateReplyDetails[].ratedShipmentDetails[].shipmentRateDetail`
- `.output.rateReplyDetails[].ratedShipmentDetails[].shipmentRateDetail.currencyExchangeRate`
- `.output.rateReplyDetails[].ratedShipmentDetails[].shipmentRateDetail.currencyExchangeRate.rate`
- `.output.rateReplyDetails[].ratedShipmentDetails[].shipmentRateDetail.dimDivisor`
- `.output.rateReplyDetails[].ratedShipmentDetails[].shipmentRateDetail.freightDiscount`
- `.output.rateReplyDetails[].ratedShipmentDetails[].shipmentRateDetail.freightDiscount[].amount`
- `.output.rateReplyDetails[].ratedShipmentDetails[].shipmentRateDetail.freightDiscount[].description`
- `.output.rateReplyDetails[].ratedShipmentDetails[].shipmentRateDetail.freightDiscount[].name`
- `.output.rateReplyDetails[].ratedShipmentDetails[].shipmentRateDetail.freightDiscount[].percent`
- `.output.rateReplyDetails[].ratedShipmentDetails[].shipmentRateDetail.freightDiscount[].type`
- `.output.rateReplyDetails[].ratedShipmentDetails[].shipmentRateDetail.fuelSurchargePercent`
- `.output.rateReplyDetails[].ratedShipmentDetails[].shipmentRateDetail.pricingCode`
- `.output.rateReplyDetails[].ratedShipmentDetails[].shipmentRateDetail.rateZone`
- `.output.rateReplyDetails[].ratedShipmentDetails[].shipmentRateDetail.specialRatingApplied`
- `.output.rateReplyDetails[].ratedShipmentDetails[].shipmentRateDetail.totalBillingWeight`
- `.output.rateReplyDetails[].ratedShipmentDetails[].shipmentRateDetail.totalBillingWeight.units`
- `.output.rateReplyDetails[].ratedShipmentDetails[].shipmentRateDetail.totalBillingWeight.value`
- `.output.rateReplyDetails[].ratedShipmentDetails[].shipmentRateDetail.totalFreightDiscount`
- `.output.rateReplyDetails[].ratedShipmentDetails[].shipmentRateDetail.totalSurcharges`
- `.output.rateReplyDetails[].ratedShipmentDetails[].totalAncillaryFeesAndTaxes`
- `.output.rateReplyDetails[].ratedShipmentDetails[].totalBaseCharge`
- `.output.rateReplyDetails[].ratedShipmentDetails[].totalDiscounts`
- `.output.rateReplyDetails[].ratedShipmentDetails[].totalDutiesAndTaxes`
- `.output.rateReplyDetails[].ratedShipmentDetails[].totalDutiesTaxesAndFees`
- `.output.rateReplyDetails[].ratedShipmentDetails[].totalNetCharge`
- `.output.rateReplyDetails[].ratedShipmentDetails[].totalNetChargeWithDutiesAndTaxes`
- `.output.rateReplyDetails[].ratedShipmentDetails[].totalNetFedExCharge`
- `.output.rateReplyDetails[].ratedShipmentDetails[].totalVariableHandlingCharges`
- `.output.rateReplyDetails[].ratedShipmentDetails[].totalVariableHandlingCharges.totalCustomerCharge`
- `.output.rateReplyDetails[].ratedShipmentDetails[].totalVariableHandlingCharges.variableHandlingCharge`
- `.output.rateReplyDetails[].ratedShipmentDetails[].totalVatCharge`
- `.output.rateReplyDetails[].ratedShipmentDetails[].variableHandlingCharges`
- `.output.rateReplyDetails[].ratedShipmentDetails[].variableHandlingCharges.totalCustomerCharge`
- `.output.rateReplyDetails[].ratedShipmentDetails[].variableHandlingCharges.variableHandlingCharge`
- `.output.rateReplyDetails[].serviceDescription`
- `.output.rateReplyDetails[].serviceDescription.astraDescription`
- `.output.rateReplyDetails[].serviceDescription.code`
- `.output.rateReplyDetails[].serviceDescription.description`
- `.output.rateReplyDetails[].serviceDescription.names`
- `.output.rateReplyDetails[].serviceDescription.names[].encoding`
- `.output.rateReplyDetails[].serviceDescription.names[].type`
- `.output.rateReplyDetails[].serviceDescription.names[].value`
- `.output.rateReplyDetails[].serviceDescription.serviceCategory`
- `.output.rateReplyDetails[].serviceDescription.serviceId`
- `.output.rateReplyDetails[].serviceName`
- `.output.rateReplyDetails[].serviceSubOptionDetail`
- `.output.rateReplyDetails[].serviceSubOptionDetail.smartPostIndiciaType`
- `.output.rateReplyDetails[].serviceType`
- `.output.rateReplyDetails[].signatureOptionType`
