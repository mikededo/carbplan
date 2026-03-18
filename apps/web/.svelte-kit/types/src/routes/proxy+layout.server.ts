// @ts-nocheck
import type { LayoutServerLoad } from './$types'

export const load = async ({
  cookies,
  locals: { safeGetSession }
}: Parameters<LayoutServerLoad>[0]) => {
  const { session, user } = await safeGetSession()

  return {
    cookies: cookies.getAll(),
    session,
    user
  }
}
