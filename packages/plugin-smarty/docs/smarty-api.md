# Smarty API behaviour

Findings behind `@dianemo/plugin-smarty`, which validates addresses against
Smarty's US Street and International Street APIs.

## Each surface is its own subscription

One secret-key pair reaches both APIs, but they are bought, allocated and
metered separately. Smarty sells each product as its own subscription with its
own lookup allocation and its own rate limit, and the rate is an attribute of
that product's plan tier rather than of the account.

**Vendor documentation**, checked 2026-08-25:

| Surface                                                                             | Professional tier                       |
| ----------------------------------------------------------------------------------- | --------------------------------------- |
| US address validation — <https://www.smarty.com/pricing>                            | "Up to 25,000 address lookups / second" |
| International — <https://www.smarty.com/pricing/international-address-verification> | "Up to 3,500 address lookups / second"  |

The US Street API reference says the same thing from the other side: it
describes a 429 as exceeding "your plan's rate limit" and states no number at
all — <https://www.smarty.com/docs/cloud/us-street-api>.

Lookup allocations drain separately too.
<https://www.smarty.com/docs/cloud/licensing> shows one account holding two
active subscriptions with independent annual allocations, selected at call time
by a `license` value (`us-core-cloud`, `us-rooftop-geocoding-cloud`, …).

## How the plugin is wired

One client per account with two sub-clients under it:

| Client  | Host                                          | Rate limit |
| ------- | --------------------------------------------- | ---------- |
| parent  | none                                          | none       |
| `:us`   | `https://us-street.api.smarty.com`            | 25,000/s   |
| `:intl` | `https://international-street.api.smarty.com` | 3,500/s    |

The limits are the template's `professional` rate-limit option, declared per
sub-client path (`us`, `intl`) and applied by core, which is also the default
when a caller names none. Each sub-client meters against its own vendor figure, because there is no shared
budget for a shared bucket to protect and the two ceilings differ by roughly 7x —
one bucket would cap US traffic against a budget international traffic was also
draining.

The parent deliberately has neither a `baseURL` nor a `rateLimit`. It exists to
carry the query-string auth both surfaces share, and every request resolves a
sub-client; a call that somehow addressed the parent fails on the missing base
URL rather than going out unmetered.

**These are Professional-tier figures and are wrong for any other tier.** The
Free Trial is a fixed grant (1,000 US lookups over 42 days; 100 international)
rather than a rated plan, and both pricing pages offer a Custom tier whose
allowance reads "custom address lookups/second". Other tiers are added as
further `rateLimitOptions` once their figures are sourced; until then pace a
particular account with the `rateLimitOverrides` argument to `addTemplateClient`
rather than editing the template.

## What a 429 means here

The configured ceilings are the vendor's own, so reaching them is not what
produces a 429. One means the subscription's **lookup allocation** is exhausted,
the credentials are wrong, or the account is on a lower tier than the template
assumes.

These ceilings are also not a spend guard, and were not sized as one. Smarty
bills per lookup, so 25,000/s bounds a runaway loop at 90M lookups an hour —
which is to say it does not bound it in any sense that matters. Cost control
belongs upstream of the rate limiter. A lower `rateLimitOverrides` is the lever
if you want the limiter to double as one.

## `authId` is logged in plaintext on any error

Smarty's secret-key auth is query-string only, so `auth-id` and `auth-token`
ride in the URL. Core's redaction covers headers, which is where its escape
hatch applies, so a 4xx or 5xx logs the query string as sent. `authToken` is
redacted by name; `authId` is not. Not fixable from this package.

## Open

- **Whether the Professional-tier rates are uniform across plan sizes.** Both
  pricing pages state the rate once, above the allocation selector (1K through
  170K US), which reads as one rate for the whole tier — but that is an
  inference from page layout, not a statement. An account on a small
  Professional plan would settle it.
- **Whether `license` must be sent explicitly for accounts holding more than one
  US subscription.** The International Street reference lists a `license` input
  and `SmartyIntlRequest` carries it; the US Street reference lists none and
  `SmartyUsRequest` matches that. An account holding both `us-core-cloud` and
  `us-rooftop-geocoding-cloud` would show whether the US endpoint needs it
  anyway.
