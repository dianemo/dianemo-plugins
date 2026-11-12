export const subscriptionsUrl = (base: string, subscriptionId?: string) =>
  subscriptionId === undefined
    ? `${base}/subscriptions`
    : `${base}/subscriptions/${encodeURIComponent(subscriptionId)}`;

/**
 * USPS declares its array filters `style: form, explode: false`, a comma-joined
 * value; axios's default would send `CRID[]=a&CRID[]=b` instead.
 */
export const listParams = (params: object): Record<string, string | number> => {
  const out: Record<string, string | number> = {};
  for (const [key, value] of Object.entries(params)) {
    if (Array.isArray(value)) out[key] = value.join(",");
    else if (value !== undefined) out[key] = value as string | number;
  }
  return out;
};

type ResponseWithHeaders<T> = { data: T; headers?: Record<string, unknown> };

const header = (headers: Record<string, unknown> | undefined, name: string) => {
  const value = headers?.[name];
  return typeof value === "string" ? value : "";
};

export const subscriptionResult = <S>(res: ResponseWithHeaders<S>) => ({
  subscription: res.data,
  etag: header(res.headers, "etag"),
});

export const subscriptionCreated = <S>(res: ResponseWithHeaders<S>) => ({
  ...subscriptionResult(res),
  location: header(res.headers, "location"),
});
