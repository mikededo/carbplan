import { PRODUCT_FORM } from '@carbplan/domain/product'
import { sql } from 'drizzle-orm'
import {
  boolean,
  index,
  integer,
  numeric,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
  uuid
} from 'drizzle-orm/pg-core'

import { athletes } from './athletes'

export const productFormEnum = pgEnum('product_form', PRODUCT_FORM)

export const brands = pgTable('brands', {
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  description: text('description'),
  id: uuid('id').defaultRandom().primaryKey(),
  isActive: boolean('is_active').default(true).notNull(),
  logoUrl: text('logo_url'),
  name: text('name').notNull(),
  slug: text('slug').notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  website: text('website')
}, (table) => [
  uniqueIndex('brands_name_unique').on(table.name),
  uniqueIndex('brands_slug_unique').on(table.slug),
  index('brands_slug_idx').on(table.slug),
  index('brands_is_active_idx').on(table.isActive)
])

export const products = pgTable('products', {
  brandId: uuid('brand_id').notNull().references(() => brands.id, { onDelete: 'cascade' }),
  caffeineMg: integer('caffeine_mg'),
  calories: integer('calories'),
  carbsG: numeric('carbs_g', { mode: 'number', precision: 5, scale: 1 }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  fatG: numeric('fat_g', { mode: 'number', precision: 5, scale: 1 }),
  flavor: text('flavor'),
  form: productFormEnum('form').notNull(),
  id: uuid('id').defaultRandom().primaryKey(),
  isActive: boolean('is_active').default(true).notNull(),
  name: text('name').notNull(),
  notes: text('notes'),
  proteinG: numeric('protein_g', { mode: 'number', precision: 5, scale: 1 }),
  servingSize: numeric('serving_size', { mode: 'number', precision: 6, scale: 2 }).notNull(),
  servingsPerPackage: integer('servings_per_package'),
  servingUnit: text('serving_unit').default('g').notNull(),
  slug: text('slug').notNull(),
  sodiumMg: integer('sodium_mg'),
  sugarG: numeric('sugar_g', { mode: 'number', precision: 5, scale: 1 }),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull()
}, (table) => [
  uniqueIndex('products_brand_slug_unique').on(table.brandId, table.slug),
  index('products_brand_id_idx').on(table.brandId),
  index('products_slug_idx').on(table.slug),
  index('products_form_idx').on(table.form),
  index('products_is_active_idx').on(table.isActive),
  index('products_caffeine_idx').on(table.caffeineMg).where(sql`${table.caffeineMg} is not null`)
])

export const favoriteBrands = pgTable('favorite_brands', {
  athleteId: uuid('athlete_id').notNull().references(() => athletes.id, { onDelete: 'cascade' }),
  brandId: uuid('brand_id').notNull().references(() => brands.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull()
}, (table) => [
  primaryKey({ columns: [table.athleteId, table.brandId] }),
  index('favorite_brands_athlete_idx').on(table.athleteId),
  index('favorite_brands_brand_idx').on(table.brandId)
])

export const favoriteProducts = pgTable('favorite_products', {
  athleteId: uuid('athlete_id').notNull().references(() => athletes.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  productId: uuid('product_id').notNull().references(() => products.id, { onDelete: 'cascade' })
}, (table) => [
  primaryKey({ columns: [table.athleteId, table.productId] }),
  index('favorite_products_athlete_idx').on(table.athleteId),
  index('favorite_products_product_idx').on(table.productId)
])
