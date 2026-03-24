import type { SQLWrapper } from 'drizzle-orm'
import type { PgColumn } from 'drizzle-orm/pg-core'
import type { Result } from 'neverthrow'

import { sql } from 'drizzle-orm'
import { err, ok } from 'neverthrow'
import z from 'zod'

export const SortDirectionSchema = z.enum(['asc', 'desc'])
export const SortDirectionEnum = SortDirectionSchema.enum
export type SortDirection = z.infer<typeof SortDirectionSchema>

export const parseQuerySort = <T extends Record<string, PgColumn>>(
  value: string,
  fields: T
): Result<{ direction: SortDirection, field: keyof T }, string> => {
  const [field, direction] = value.split(':')
  if (
    !field ||
    !direction ||
    (direction !== 'asc' && direction !== 'desc') ||
    !(field in fields)
  ) {
    return err('Invalid sort query')
  }
  return ok({ direction, field: field as keyof T })
}

export const NUMERIC_NULL_SENTINEL = {
  asc: 2_147_483_647,
  desc: -1
} as const

export type SortSql<
  TField extends string = string
> = {
  expression: SQLWrapper
  field: TField
}

type ResolveSortSqlInput<
  T extends Record<string, PgColumn>,
  K extends keyof T & string
> = {
  direction: SortDirection
  fields: T
  field: K
  expression?: SQLWrapper
}

export const resolveSortSql = <
  T extends Record<string, PgColumn>,
  K extends keyof T & string
>({
  direction,
  expression,
  field,
  fields
}: ResolveSortSqlInput<T, K>): SortSql<K> => {
  const sentinel = NUMERIC_NULL_SENTINEL[direction]

  return {
    expression: expression ?? sql`coalesce(${fields[field]}, ${sentinel})`,
    field
  }
}
