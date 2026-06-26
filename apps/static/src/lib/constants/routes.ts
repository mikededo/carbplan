import { PUBLIC_APP_ORIGIN } from '$env/static/public'

export const ROUTES = {
  auth: {
    signin: `${PUBLIC_APP_ORIGIN}/auth/sign-in`,
    signup: `${PUBLIC_APP_ORIGIN}/auth/sign-up`
  },
  dashboard: `${PUBLIC_APP_ORIGIN}/dashboard`,
  landing: '/',
  tools: '/tools'
} as const
