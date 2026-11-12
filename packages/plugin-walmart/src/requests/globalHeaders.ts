import { WalmartMarket } from "./items/types.js";

/**
 * Walmart rejects `WM_MARKET` unless `WM_GLOBAL_VERSION` accompanies it, so the
 * pair is built together from one `market` argument rather than left to a caller
 * to get half-right.
 *
 * Returns undefined when no market is given, which sends neither header — the US
 * marketplace. See docs/walmart-api.md#the-global-market-header-travels-in-pairs
 */
const globalHeaders = (market?: WalmartMarket) => {
  if (!market) return undefined;
  return { WM_MARKET: market, WM_GLOBAL_VERSION: 3.1 };
};

export default globalHeaders;
