import { AthleteProvisioningServiceImpl, toAthletePayload, upsertAthleteForUser } from './provision-athlete'

describe('athlete provisioning', () => {
  it('creates payload when user has id and email', () => {
    const payload = toAthletePayload({
      email: 'athlete@carbplan.app',
      id: 'f8dbd028-c4ed-4e10-8142-a5c4bd8af83d'
    })

    expect(payload).toEqual({
      email: 'athlete@carbplan.app',
      id: 'f8dbd028-c4ed-4e10-8142-a5c4bd8af83d'
    })
  })

  it('returns null payload when required fields are missing', () => {
    expect(toAthletePayload({ email: null, id: 'id' })).toBeNull()
    expect(toAthletePayload({ email: 'a@b.com', id: null })).toBeNull()
  })

  it('upserts athlete on signup bootstrap', async () => {
    const upsertAthlete = vi.fn(async () => undefined)
    const service = new AthleteProvisioningServiceImpl({ upsertAthlete })

    const upserted = await upsertAthleteForUser(service, {
      email: 'athlete@carbplan.app',
      id: 'f8dbd028-c4ed-4e10-8142-a5c4bd8af83d'
    })

    expect(upserted).toBe(true)
    expect(upsertAthlete).toHaveBeenCalledTimes(1)
  })

  it('skips bootstrap when user payload is incomplete', async () => {
    const upsertAthlete = vi.fn(async () => undefined)
    const service = new AthleteProvisioningServiceImpl({ upsertAthlete })

    const upserted = await upsertAthleteForUser(service, {
      email: null,
      id: 'f8dbd028-c4ed-4e10-8142-a5c4bd8af83d'
    })

    expect(upserted).toBe(false)
    expect(upsertAthlete).toHaveBeenCalledTimes(0)
  })

  it('propagates db failures', async () => {
    const upsertAthlete = vi.fn().mockRejectedValue('db failed')
    const service = new AthleteProvisioningServiceImpl({ upsertAthlete })

    await expect(upsertAthleteForUser(service, {
      email: 'athlete@carbplan.app',
      id: 'f8dbd028-c4ed-4e10-8142-a5c4bd8af83d'
    })).rejects.toThrow('db failed')
  })
})
