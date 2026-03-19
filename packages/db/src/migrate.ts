import { migrate } from 'drizzle-orm/postgres-js/migrator'
import process from 'node:process'

import { createDb } from './db'

const connectionString = process.env.DATABASE_URL

if (!connectionString) {
  throw new Error('DATABASE_URL is required to run database migrations')
}

const run = async () => {
  const { client, db } = createDb(connectionString, { max: 1 })

  try {
    await migrate(db, { migrationsFolder: './drizzle' })
    console.log('Migrations applied successfully')
  } finally {
    await client.end({ timeout: 5 })
  }
}

await run()
