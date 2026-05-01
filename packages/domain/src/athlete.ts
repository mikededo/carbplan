import * as z from 'zod'

export const AthleteIdSchema = z.uuid().brand<'Athlete'>()
export type AthleteId = z.infer<typeof AthleteIdSchema>

export const parseAthleteId = (value: string): AthleteId => AthleteIdSchema.parse(value)
