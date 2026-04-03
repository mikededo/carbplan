export const getApiRoute = <T extends `/${string}`>(baseUrl: T) =>
  `/api/v1${baseUrl}` as `/api/v1${T}`

getApiRoute.prefixed = <P extends `/${string}`>(prefix: P) =>
  <T extends string>(baseUrl: T) => `/api/v1${prefix}${baseUrl}` as `/api/v1${P}${T}`

