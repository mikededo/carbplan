import type { Session } from '@carbplan/contracts/auth'

export const isSessionExpired = (session: Session) => {
  const expiresAt = new Date(session.expiresAt)
  return expiresAt.getTime() < Date.now()
}
