const NORMALIZE_URL_MATCH = /\/$/
export const normalizeURL = (raw: string) => new URL(raw).toString().replace(NORMALIZE_URL_MATCH, '')
