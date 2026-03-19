import { defineConfig } from 'drizzle-kit'
import process from 'node:process'

const connectionString = process.env.DATABASE_URL

if (!connectionString) {
  throw new Error('DATABASE_URL is required for Drizzle commands')
}

export default defineConfig({
  dbCredentials: { url: connectionString },
  dialect: 'postgresql',
  out: './drizzle',
  schema: './src/schema/index.ts',
  strict: true,
  verbose: true
})
