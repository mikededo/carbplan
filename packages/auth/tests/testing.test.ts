import { athletes, parseAthleteId } from '@carbplan/db'
import { eq } from 'drizzle-orm'
import { describe, expect, it } from 'vitest'

import { createRepositoryDbMock } from '../src/testing'

const athleteId = parseAthleteId('00000000-0000-4000-8000-000000000000')

describe('repository db mock', () => {
  it('returns queued results in order', async () => {
    const mock = createRepositoryDbMock()
    mock.queueResult([{ completed: true }])
    mock.queueResult([])

    const first = await mock.db
      .select({ completed: athletes.onboardingCompleted })
      .from(athletes)
      .where(eq(athletes.id, athleteId))

    const second = await mock.db
      .select({ completed: athletes.onboardingCompleted })
      .from(athletes)
      .where(eq(athletes.id, athleteId))

    expect(first).toEqual([{ completed: true }])
    expect(second).toEqual([])
    mock.restore()
  })

  it('throws queued errors', async () => {
    const mock = createRepositoryDbMock()
    mock.queueError(new Error('db failed'))

    await expect((async () => {
      await mock.db
        .select({ completed: athletes.onboardingCompleted })
        .from(athletes)
        .where(eq(athletes.id, athleteId))
    })()).rejects.toThrow('db failed')

    mock.restore()
  })

  it('captures generated sql for debugging', async () => {
    const mock = createRepositoryDbMock()
    mock.queueResult([])

    await mock.db
      .select({ completed: athletes.onboardingCompleted })
      .from(athletes)
      .where(eq(athletes.id, athleteId))

    expect(mock.capturedSql).toHaveLength(1)
    expect(mock.capturedSql[0]).toContain('from "athletes"')
    mock.restore()
  })
})
