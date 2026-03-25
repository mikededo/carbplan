import type { ApiPath } from '$utils/types'

const BASE_ATHLETES_PATH = '/v1/athletes'

export const getAthletesPath = <T extends ApiPath>(path: T) =>
  `${BASE_ATHLETES_PATH}${path}` as const satisfies `${typeof BASE_ATHLETES_PATH}${T}`
export const getMeAthletesPath = <T extends ApiPath>(path: T) =>
  getAthletesPath(`/me${path}` as const satisfies `/me${T}`)
