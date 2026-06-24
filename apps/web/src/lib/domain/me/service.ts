import type { ApiBody, ApiClient, ApiData } from '$lib/api/eden'

import { unwrapEden } from '$lib/api/eden'

export type CurrentAthlete = ApiData<ApiClient['v1']['me']['get']>
export type UpdateCurrentAthleteInput = ApiBody<ApiClient['v1']['me']['patch']>
export type UpdateHRZonesInput = ApiBody<ApiClient['v1']['me']['hr']['patch']>
export type UpdatePowerZonesInput = ApiBody<ApiClient['v1']['me']['power']['patch']>

export const createMeService = (api: ApiClient) => ({
  getCurrentAthlete: () => unwrapEden(api.v1.me.get()),
  updateCurrentAthlete: (body: UpdateCurrentAthleteInput) => unwrapEden(api.v1.me.patch(body)),
  updateHRZones: (body: UpdateHRZonesInput) => unwrapEden(api.v1.me.hr.patch(body)),
  updatePowerZones: (body: UpdatePowerZonesInput) => unwrapEden(api.v1.me.power.patch(body))
})

export type MeService = ReturnType<typeof createMeService>
