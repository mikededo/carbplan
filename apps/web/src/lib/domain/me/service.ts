import type { ApiClient } from '$lib/api/eden'
import type {
  CurrentAthleteResponse,
  UpdateCurrentAthleteRequest,
  UpdateCurrentAthleteResponse,
  UpdateHRZonesRequest,
  UpdateHRZonesResponse,
  UpdatePowerZonesRequest,
  UpdatePowerZonesResponse
} from '$lib/api/endpoint-types'

import { unwrapEden } from '$lib/api/eden'

export const createMeService = (api: ApiClient) => ({
  getCurrentAthlete: () => unwrapEden<CurrentAthleteResponse>(api.v1.me.get()),
  updateCurrentAthlete: (body: UpdateCurrentAthleteRequest) => unwrapEden<UpdateCurrentAthleteResponse>(api.v1.me.patch(body)),
  updateHRZones: (body: UpdateHRZonesRequest) => unwrapEden<UpdateHRZonesResponse>(api.v1.me.hr.patch(body)),
  updatePowerZones: (body: UpdatePowerZonesRequest) => unwrapEden<UpdatePowerZonesResponse>(api.v1.me.power.patch(body))
})

export type MeService = ReturnType<typeof createMeService>
