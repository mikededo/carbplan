import type { ApiPath } from '$utils/types'

const BASE_ATHLETES_PATH = '/athletes'

export const getAthletesPath = (path: ApiPath) => `${BASE_ATHLETES_PATH}${path}` as const
export const getMeAthletesPath = (path: ApiPath) => getAthletesPath(`/me${path}` as const)
