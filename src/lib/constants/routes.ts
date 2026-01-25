import type { Pathname } from '$app/types'

type Route = Exclude<Pathname, `/api${string}`>

const route = <T extends Route>(path: T): T => path

export const ROUTES = {
  admin: {
    supplements: route('/supplements')
  },
  auth: {
    login: route('/auth/log-in'),
    signup: route('/auth/sign-up')
  },
  dashboard: route('/dashboard'),
  landing: route('/'),
  onboarding: route('/onboarding'),
  plans: {
    edit: (id: string) => `/plans/${id}`,
    list: '/plans',
    new: '/plans/new'
  },
  settings: route('/settings')
} as const

export const isOnboardingRoute = (pathname: string) => pathname.startsWith(ROUTES.onboarding)
