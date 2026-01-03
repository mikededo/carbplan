import type { Pathname } from '$app/types'

type Route = Exclude<Pathname, `/api${string}`>

const route = <T extends Route>(path: T): T => path

export const ROUTES = {
  auth: {
    login: route('/auth/log-in'),
    signup: route('/auth/sign-up')
  },
  home: route('/'),
  onboarding: route('/onboarding')
} as const
