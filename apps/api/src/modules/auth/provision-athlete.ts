import type { Db } from '@carbplan/db'

import { athletes } from '@carbplan/db'

type AuthUserPayload = {
  email?: null | string
  id?: null | string
}

export type AthletePayload = {
  email: string
  id: string
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

export const upsertAthleteForUser = async (db: Db, user: AuthUserPayload): Promise<boolean> => {
  const payload = toAthletePayload(user)
  if (!payload) {
    return false
  }

  await db.insert(athletes)
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

  return true
}
