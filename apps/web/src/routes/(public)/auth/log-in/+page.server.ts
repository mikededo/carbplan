import type { Actions } from './$types'

import { fail, redirect } from '@sveltejs/kit'
import * as z from 'zod'

import { ROUTES } from '$lib/constants/routes'

const LoginSchema = z.object({
  email: z.string().trim().email('Invalid email address'),
  password: z.string().trim().min(1, 'Password is required')
})

export const actions = {
  default: async ({ locals: { supabase }, request }) => {
    const formData = await request.formData()
    const email = formData.get('email')?.toString()
    const result = LoginSchema.safeParse({
      email: formData.get('email'),
      password: formData.get('password')
    })

    if (!result.success) {
      const errors = result.error.flatten()
      return fail(400, {
        errors: {
          email: errors.fieldErrors.email?.[0],
          password: errors.fieldErrors.password?.[0]
        },
        values: { email }
      })
    }

    const { error } = await supabase.auth.signInWithPassword({
      email: result.data.email,
      password: result.data.password
    })
    if (error) {
      return fail(400, { message: error.message, values: { email } })
    }

    redirect(303, ROUTES.dashboard)
  }
} satisfies Actions

