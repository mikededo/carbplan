import type { Db } from '@carbplan/db'

import { athletes } from '@carbplan/db'

export type AuthUserPayload = {
  email?: null | string
  id?: null | string
}

export type AthletePayload = {
  email: string
  id: string
}

export type AthleteProvisioningRepository = {
  upsertAthlete: (payload: AthletePayload) => Promise<void>
}

export type AthleteProvisioningService = {
  upsertAthleteForUser: (user: AuthUserPayload) => Promise<boolean>
}

export const toAthletePayload = (user: AuthUserPayload): AthletePayload | null => {
  if (!user.id || !user.email) {
    return null
  }

  return {
    email: user.email,
    id: user.id
  }
}

export class DbAthleteProvisioningRepository implements AthleteProvisioningRepository {
  constructor(private readonly db: Db) {}

  async upsertAthlete(payload: AthletePayload): Promise<void> {
    await this.db.insert(athletes)
      .values({
        email: payload.email,
        id: payload.id
      })
      .onConflictDoUpdate({
        set: {
          email: payload.email,
          updatedAt: new Date()
        },
        target: athletes.id
      })
  }
}

export class AthleteProvisioningServiceImpl implements AthleteProvisioningService {
  constructor(private readonly repository: AthleteProvisioningRepository) {}

  async upsertAthleteForUser(user: AuthUserPayload): Promise<boolean> {
    const payload = toAthletePayload(user)
    if (!payload) {
      return false
    }

    await this.repository.upsertAthlete(payload)
    return true
  }
}

export const upsertAthleteForUser = async (
  service: AthleteProvisioningService,
  user: AuthUserPayload
): Promise<boolean> => service.upsertAthleteForUser(user)
