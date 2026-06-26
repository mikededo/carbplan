import type { Actions } from './$types'

import * as AuthContracts from '@kilo/contracts/auth'
import { fail, redirect } from '@sveltejs/kit'
import * as z from 'zod'

import { PRIVATE_API_ORIGIN } from '$env/static/private'
import { ROUTES } from '$lib/constants/routes'
import { forwardResponseCookies, getSharedCookieDomain } from '$lib/domain/auth/cookies.server'

export const actions = {
  default: async ({ cookies, fetch, request, url }) => {
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

    const response = await fetch(`${PRIVATE_API_ORIGIN}/api/v1/auth/sign-up/email`, {
      body: JSON.stringify({
        email: result.data.email,
        name: result.data.email,
        password: result.data.password
      }),
      headers: { 'content-type': 'application/json' },
      method: 'POST'
    })
    if (!response.ok) {
      const error = await response.json().catch(() => undefined) as { message?: string } | undefined
      return fail(response.status, { message: error?.message ?? 'Unable to sign up', values: { email } })
    }

    const cookieDomain = getSharedCookieDomain(url.hostname)
    forwardResponseCookies({ cookies, domain: cookieDomain, headers: response.headers })

    redirect(303, ROUTES.onboarding)
  }
} satisfies Actions
