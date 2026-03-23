import type { Db } from '@carbplan/db'

import { schema } from '@carbplan/db'
import { drizzle } from 'drizzle-orm/postgres-js'

type MockQueueItem =
  | { kind: 'error', value: Error } |
  { kind: 'result', value: unknown }

type MockDbWithSession = {
  session: {
    prepareQuery: (...args: unknown[]) => unknown
  }
} & Db

export type RepositoryDbMock = {
  capturedSql: string[]
  db: Db
  queueError: (error: Error) => void
  queueResult: (value: unknown) => void
  restore: () => void
}

const normalizeError = (error: Error): Error => error

export const createRepositoryDbMock = (): RepositoryDbMock => {
  const queue: MockQueueItem[] = []
  const capturedSql: string[] = []
  const db = drizzle.mock({ schema }) as unknown as MockDbWithSession
  const originalPrepareQuery = db.session.prepareQuery.bind(db.session)

  const dequeue = () => {
    const next = queue.shift()
    if (!next) {
      throw new Error('No queued Drizzle mock response available')
    }

    if (next.kind === 'error') {
      throw next.value
    }

    return next.value
  }

  db.session.prepareQuery = (query) => {
    const sql = typeof query === 'object' && query !== null && 'sql' in query
      ? String((query as { sql: unknown }).sql)
      : ''
    capturedSql.push(sql)

    const preparedQuery = {
      all: async () => dequeue(),
      execute: async () => dequeue(),
      isResponseInArrayMode: () => false,
      mapResult: () => preparedQuery,
      setToken: () => preparedQuery
    }

    return preparedQuery
  }

  return {
    capturedSql,
    db: db as Db,
    queueError: (error: Error) => {
      queue.push({ kind: 'error', value: normalizeError(error) })
    },
    queueResult: (value: unknown) => {
      queue.push({ kind: 'result', value })
    },
    restore: () => {
      db.session.prepareQuery = originalPrepareQuery
    }
  }
}
