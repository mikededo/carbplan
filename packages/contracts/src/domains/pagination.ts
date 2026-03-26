import * as z from 'zod'

export const SortDirectionSchema = z.enum(['asc', 'desc'])
export const SortDirectionEnum = SortDirectionSchema.enum
export type SortDirection = z.infer<typeof SortDirectionSchema>

export const OffsetPaginationQuerySchema = z.object({
  limit: z.coerce.number().int().positive().max(100).default(20),
  offset: z.coerce.number().int().min(0).default(0)
})
export type OffsetPaginationQuery = z.infer<typeof OffsetPaginationQuerySchema>

type CreateSortSchemaInput<TSortField extends readonly [string, ...string[]]> = {
  defaultSort: `${TSortField[number]}:${SortDirection}`
  fields: TSortField
}

type SortValue<T extends readonly [string, ...string[]]> =
  `${T[number]}:${'asc' | 'desc'}`
export type SortOptions<T extends string> = `${T}:${'asc' | 'desc'}`

export const createSortSchema = <TSortField extends readonly [string, ...string[]]>({
  defaultSort,
  fields
}: CreateSortSchemaInput<TSortField>) => {
  const validValues = new Set(
    fields.flatMap((field) => [`${field}:asc`, `${field}:desc`])
  )

  return z
    .custom<SortValue<TSortField>>(
      (val) => typeof val === 'string' && validValues.has(val),
      { error: `Must be one of: ${[...validValues].join(', ')}` }
    )
    .default(defaultSort)
}

type CreateListQuerySchemaInput<
  TFilterShape extends z.ZodRawShape,
  TSortField extends readonly [string, ...string[]]
> = {
  defaultSort: `${TSortField[number]}:${SortDirection}`
  fields: TSortField
  filters: z.ZodObject<TFilterShape>
  maxLimit?: number
}

export const createListQuerySchema = <
  TFilterShape extends z.ZodRawShape,
  TSortField extends readonly [string, ...string[]]
>({
  defaultSort,
  fields,
  filters,
  maxLimit = 100
}: CreateListQuerySchemaInput<TFilterShape, TSortField>) => filters.extend({
  limit: z.coerce.number().int().positive().max(maxLimit).default(20),
  offset: z.coerce.number().int().positive().min(0).default(0),
  sort: createSortSchema({ defaultSort, fields })
})
