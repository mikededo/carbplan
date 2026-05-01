import type { Actions } from './$types'

import * as AuthContracts from '@carbplan/contracts/auth'
import { fail, redirect } from '@sveltejs/kit'
import * as z from 'zod'

import { ROUTES } from '$lib/constants/routes'
import { AUTH_TOKEN_COOKIE_NAME } from '$lib/domain/auth/constants'
import { forwardResponseCookies, getSharedCookieDomain } from '$lib/domain/auth/cookies.server'

export const actions = {
  default: async ({ cookies, locals: { authService }, request, url }) => {
    const formData = await request.formData()
    const email = formData.get('email')?.toString()
    const result = AuthContracts.SignUpRequestSchema.safeParse({
      email,
      password: formData.get('password')
    })

    if (!result.success) {
      const errors = z.flattenError(result.error)
      return fail(400, {
        errors: {
          email: errors.fieldErrors.email ? 'Invalid email address' : undefined,
          password: errors.fieldErrors.password ? 'Password must be at least 8 characters' : undefined
        },
        values: { email }
      })
    }

    const response = await authService.signUp({
      email: result.data.email,
      name: result.data.email,
      password: result.data.password
    })
    if (response.isErr()) {
      return fail(400, { message: response.error.message, values: { email } })
    }

    const cookieDomain = getSharedCookieDomain(url.hostname)
    const authToken = response.value.headers.get('set-auth-token') ?? response.value.data.token

    forwardResponseCookies({ cookies, domain: cookieDomain, headers: response.value.headers })

    cookies.set(AUTH_TOKEN_COOKIE_NAME, authToken, {
      domain: cookieDomain,
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
      sameSite: 'lax'
    })

    redirect(303, ROUTES.onboarding)
  }
} satisfies Actions
