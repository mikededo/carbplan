import { describe, expect, it, mock } from 'bun:test'

import { toAthletePayload, upsertAthleteForUser } from './provision-athlete'

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
    const onConflictDoUpdate = mock(async () => undefined)
    const values = mock(() => ({ onConflictDoUpdate }))
    const insert = mock(() => ({ values }))

    const db = { insert } as any

    const upserted = await upsertAthleteForUser(db, {
      email: 'athlete@carbplan.app',
      id: 'f8dbd028-c4ed-4e10-8142-a5c4bd8af83d'
    })

    expect(upserted).toBe(true)
    expect(insert).toHaveBeenCalledTimes(1)
    expect(values).toHaveBeenCalledTimes(1)
    expect(onConflictDoUpdate).toHaveBeenCalledTimes(1)
  })

  it('skips bootstrap when user payload is incomplete', async () => {
    const onConflictDoUpdate = mock(async () => undefined)
    const values = mock(() => ({ onConflictDoUpdate }))
    const insert = mock(() => ({ values }))

    const db = { insert } as any

    const upserted = await upsertAthleteForUser(db, {
      email: null,
      id: 'f8dbd028-c4ed-4e10-8142-a5c4bd8af83d'
    })

    expect(upserted).toBe(false)
    expect(insert).toHaveBeenCalledTimes(0)
  })

  it('propagates db failures', async () => {
    const onConflictDoUpdate = mock(async () => {
      throw new Error('db failed')
    })
    const values = mock(() => ({ onConflictDoUpdate }))
    const insert = mock(() => ({ values }))

    const db = { insert } as any

    expect(await upsertAthleteForUser(db, {
      email: 'athlete@carbplan.app',
      id: 'f8dbd028-c4ed-4e10-8142-a5c4bd8af83d'
    })).rejects.toThrow('db failed')
  })
})
