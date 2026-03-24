import { PostgresError } from 'pg-error-enum'

import { DatabaseQueryError, mapDbError } from '$utils/db-error'

describe('mapDbError', () => {
  it('maps known postgres errors to typed database errors', () => {
    const originalError = {
      code: PostgresError.UNIQUE_VIOLATION,
      column: 'slug',
      constraint: 'products_slug_key',
      detail: 'Key (slug)=(gel-one) already exists.',
      message: 'duplicate key value violates unique constraint',
      table: 'products'
    }

    const mapped = mapDbError(originalError)

    expect(mapped).toBeInstanceOf(DatabaseQueryError)
    expect(mapped.code).toBe(PostgresError.UNIQUE_VIOLATION)
    expect(mapped.detail).toBe('Key (slug)=(gel-one) already exists.')
    expect(mapped.constraint).toBe('products_slug_key')
    expect(mapped.column).toBe('slug')
    expect(mapped.table).toBe('products')
    expect(mapped.cause).toBe(originalError)
  })

  it('maps unknown object errors to UNKNOWN_DB_ERROR and keeps message', () => {
    const originalError = {
      code: 'NOT_A_PG_SQLSTATE',
      message: 'db failed'
    }

    const mapped = mapDbError(originalError)

    expect(mapped.code).toBe('UNKNOWN_DB_ERROR')
    expect(mapped.message).toBe('db failed')
    expect(mapped.cause).toBe(originalError)
  })

  it('maps non-object errors to UNKNOWN_DB_ERROR with fallback message', () => {
    const mapped = mapDbError('db failed')

    expect(mapped.code).toBe('UNKNOWN_DB_ERROR')
    expect(mapped.message).toBe('Database query failed')
    expect(mapped.cause).toBe('db failed')
  })
})
