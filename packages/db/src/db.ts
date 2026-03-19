import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js'
import type { Options, Sql } from 'postgres'

import { sql } from 'drizzle-orm'
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

import { schema } from './schema'

export type Db = PostgresJsDatabase<typeof schema>
export type DbClient = Sql
export type DbTransaction = Parameters<Parameters<Db['transaction']>[0]>[0]

export const createDbClient = (connectionString: string, options?: Options<Record<string, postgres.PostgresType>>) => postgres(connectionString, {
  prepare: false,
  ...options
})

export const createDb = (connectionString: string, options?: Options<Record<string, postgres.PostgresType>>) => {
  const client = createDbClient(connectionString, options)
  const db = drizzle(client, { schema })
  return { client, db }
}

export const setActorContext = async (executor: Db | DbTransaction, actorId: string) => {
  await executor.execute(sql`select set_config('app.current_user_id', ${actorId}, true)`)
}

export const withActor = async <T>(db: Db, actorId: string, run: (tx: DbTransaction) => Promise<T>) => db.transaction(async (tx) => {
  await setActorContext(tx, actorId)
  return run(tx)
})
