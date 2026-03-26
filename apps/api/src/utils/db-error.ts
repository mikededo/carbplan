import { PostgresError } from 'pg-error-enum'
import * as z from 'zod'

const POSTGRES_ERROR_CODES = new Set<string>(Object.values(PostgresError))

const UNKNOWN_DB_ERROR_CODE = 'UNKNOWN_DB_ERROR' as const

export type DatabaseErrorCode = `${PostgresError}` | typeof UNKNOWN_DB_ERROR_CODE
export const DatabaseErrorCodeEnum = z.enum({ ...PostgresError, UNKNOWN: UNKNOWN_DB_ERROR_CODE }).enum

type MaybePostgresError = {
  code?: unknown
  column?: unknown
  constraint?: unknown
  detail?: unknown
  message?: unknown
  table?: unknown
}

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null

const asString = (value: unknown): string | undefined =>
  typeof value === 'string' && value.length > 0 ? value : undefined

const resolveCode = (error: MaybePostgresError): DatabaseErrorCode => {
  const code = asString(error.code)
  if (code && POSTGRES_ERROR_CODES.has(code)) {
    return code as PostgresError
  }

  return UNKNOWN_DB_ERROR_CODE
}

export class DatabaseQueryError extends Error {
  readonly cause: unknown
  readonly code: DatabaseErrorCode
  readonly column?: string
  readonly constraint?: string
  readonly detail?: string
  readonly table?: string

  constructor(args: {
    code: DatabaseErrorCode
    cause: unknown
    column?: string
    constraint?: string
    detail?: string
    message?: string
    table?: string
  }) {
    super(args.message ?? 'Database query failed')
    this.name = 'DatabaseQueryError'
    this.code = args.code
    this.cause = args.cause
    this.column = args.column
    this.constraint = args.constraint
    this.detail = args.detail
    this.table = args.table
  }
}

export const mapDbError = (error: unknown): DatabaseQueryError => {
  if (!isObject(error)) {
    return new DatabaseQueryError({
      cause: error,
      code: UNKNOWN_DB_ERROR_CODE,
      message: 'Database query failed'
    })
  }

  const maybePostgresError = error as MaybePostgresError
  const code = resolveCode(maybePostgresError)
  const detail = asString(maybePostgresError.detail)

  return new DatabaseQueryError({
    cause: error,
    code,
    column: asString(maybePostgresError.column),
    constraint: asString(maybePostgresError.constraint),
    detail,
    message: detail ?? asString(maybePostgresError.message) ?? 'Database query failed',
    table: asString(maybePostgresError.table)
  })
}

export class EntityNotFound extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'EntityNotFound'
  }

  public static withEntityName(entity: string, message?: string) {
    return new EntityNotFound(message ?? '%s not found'.replace('%s', entity))
  }
}

export class EntityNotInserted extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'EntityNotInserted'
  }

  public static withEntityName(entity: string, message?: string) {
    return new EntityNotFound(message ?? '%s could not have been inserted'.replace('%s', entity))
  }
}
