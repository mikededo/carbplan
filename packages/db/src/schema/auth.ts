import { index, pgTable, text, timestamp, uniqueIndex, uuid } from 'drizzle-orm/pg-core'

export const users = pgTable('user', {
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  email: text('email').notNull(),
  emailVerified: timestamp('email_verified', { withTimezone: true }),
  id: uuid('id').defaultRandom().primaryKey(),
  image: text('image'),
  name: text('name'),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull()
}, (table) => [
  uniqueIndex('user_email_unique').on(table.email),
  index('user_email_idx').on(table.email)
])

export const sessions = pgTable('session', {
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  id: uuid('id').defaultRandom().primaryKey(),
  ipAddress: text('ip_address'),
  token: text('token').notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  userAgent: text('user_agent'),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' })
}, (table) => [
  uniqueIndex('session_token_unique').on(table.token),
  index('session_user_id_idx').on(table.userId),
  index('session_expires_at_idx').on(table.expiresAt)
])

export const accounts = pgTable('account', {
  accessToken: text('access_token'),
  accessTokenExpiresAt: timestamp('access_token_expires_at', { withTimezone: true }),
  accountId: text('account_id').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  id: uuid('id').defaultRandom().primaryKey(),
  idToken: text('id_token'),
  password: text('password'),
  providerId: text('provider_id').notNull(),
  refreshToken: text('refresh_token'),
  refreshTokenExpiresAt: timestamp('refresh_token_expires_at', { withTimezone: true }),
  scope: text('scope'),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' })
}, (table) => [
  uniqueIndex('account_provider_account_unique').on(table.providerId, table.accountId),
  index('account_user_id_idx').on(table.userId)
])

export const verifications = pgTable('verification', {
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  id: uuid('id').defaultRandom().primaryKey(),
  identifier: text('identifier').notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  value: text('value').notNull()
}, (table) => [
  uniqueIndex('verification_identifier_value_unique').on(table.identifier, table.value),
  index('verification_expires_at_idx').on(table.expiresAt)
])
