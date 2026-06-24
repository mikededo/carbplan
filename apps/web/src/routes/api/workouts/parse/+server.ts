import type { RequestHandler } from './$types'

import { json } from '@sveltejs/kit'
import * as z from 'zod'

import { parseWorkoutText } from '$lib/domain/workouts/parser'
import { ParsedWorkoutDocSchema, ParseWorkoutRequestSchema } from '$lib/domain/workouts/schemas'

export const POST: RequestHandler = async ({ request }) => {
  const body = await request.json().catch(() => null)
  const input = ParseWorkoutRequestSchema.safeParse(body)

  if (!input.success) {
    return json({ errors: z.flattenError(input.error) }, { status: 400 })
  }

  const parsed = parseWorkoutText(input.data.text)
  const parsedResult = ParsedWorkoutDocSchema.safeParse(parsed)

  if (!parsedResult.success) {
    return json({ errors: z.flattenError(parsedResult.error) }, { status: 500 })
  }

  return json(parsedResult.data)
}
