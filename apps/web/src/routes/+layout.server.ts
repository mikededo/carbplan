import type { LayoutServerLoad } from './$types'

export const load: LayoutServerLoad = async ({
  cookies,
  locals
}) => {
  const { session, user } = await locals.authService.getSession().unwrapOr({
    session: null,
    user: null
  })

  return {
    cookies: cookies.getAll(),
    session,
    user
  }
}
