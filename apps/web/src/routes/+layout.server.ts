import type { LayoutServerLoad } from './$types'

export const load: LayoutServerLoad = async ({
  cookies,
  locals
}) => {
  const { session, user } = await locals.authService.getSession().unwrapOr({
    session: undefined,
    user: undefined
  })

  return {
    cookies: cookies.getAll(),
    session,
    user
  }
}
