import type { Transport } from '$lib/api/transport'

import * as MeContracts from '@carbplan/contracts/me'

import { getApiRoute } from '$lib/api/routes'

const getMeRoute = getApiRoute.prefixed('/me')

export const createMeService = (transport: Transport) => ({
  getCurrentAthlete: () => transport.get({
    path: getMeRoute(''),
    schema: MeContracts.GetCurrentAthleteResponseSchema
  }),
  updateCurrentAthlete: (body: MeContracts.UpdateCurrentAthleteRequest) => transport.patch({
    body,
    path: getMeRoute(''),
    schema: MeContracts.UpdateCurrentAthleteResponseSchema
  }),
  updateHRZones: (body: MeContracts.UpdateHRZonesRequest) => transport.patch({
    body,
    path: getMeRoute('/hr'),
    schema: MeContracts.UpdateHRZonesResponseSchema
  }),
  updatePowerZones: (body: MeContracts.UpdatePowerZonesRequest) => transport.patch({
    body,
    path: getMeRoute('/power'),
    schema: MeContracts.UpdatePowerZonesResponseSchema
  })
})

export type MeService = ReturnType<typeof createMeService>
