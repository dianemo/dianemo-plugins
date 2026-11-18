# Google API descriptions

`@dianemo/plugin-google` types the Google Sheets API from Google's own
description of it rather than by hand.

| File                                                      | What it is                                                                                                    |
| --------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| `vendor-specs/google/sheets-v4.discovery.json`            | The Discovery document for Sheets v4, as `apis.getRest` returns it, with keys sorted and nothing else changed |
| `packages/plugin-google/src/requests/sheets/generated.ts` | Types generated from its `schemas`; never edited by hand                                                      |

## Current document

- Revision: `20261111`
- etag: none. The `apis.getRest` response carries no `etag` field, so the
  `revision` identifies the document.
- Source: `GET https://discovery.googleapis.com/discovery/v1/apis/sheets/v4/rest`
  ([reference](https://developers.google.com/discovery/v1/reference/apis))

## Updating

```sh
node scripts/fetch-google-discovery.mjs sheets v4 vendor-specs/google/sheets-v4.discovery.json
npm run generate:google-types
```

The fetch is by hand only; CI and the tests read the committed file.
`npm run generate:google-types -- --check` fails when `generated.ts` no longer
matches the document, and CI runs it. Record the new `revision` above.
