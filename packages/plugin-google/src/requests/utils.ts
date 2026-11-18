/**
 * Appends the host segment rather than leaving it to the caller: a `:profile`
 * client name handed to `validateAddress` sent an Address Validation body to
 * `www.googleapis.com`, which fails as a 404 rather than as the
 * misconfiguration it is.
 */
export const googleSubClient = (
  clientName: string,
  sub: "profile" | "addressValidation" | "sheetsRead" | "sheetsWrite"
) => `${clientName}:${sub}`;
