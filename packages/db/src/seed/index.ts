import { and, inArray, sql } from 'drizzle-orm'
import process from 'node:process'

import { createDb } from '../db'
import { brands, products } from '../schema'
import { brandSeedData } from './brands'
import { allProductSeedData } from './products'

const REQUIRED_BRAND_SLUGS = ['sis', 'maurten', 'gu-energy'] as const
const REQUIRED_PRODUCT_SLUGS = ['go-isotonic-gel', 'gel-100', 'energy-gel-salted-caramel'] as const

export const runSeed = async (connectionString = process.env.DATABASE_URL) => {
  if (!connectionString) {
    throw new Error('DATABASE_URL is required to run database seed')
  }

  const { client, db } = createDb(connectionString)

  try {
    await db.insert(brands).values(brandSeedData).onConflictDoUpdate({
      set: {
        description: sql`excluded.description`,
        isActive: true,
        name: sql`excluded.name`,
        updatedAt: sql`now()`,
        website: sql`excluded.website`
      },
      target: brands.slug
    })

    const brandRows = await db.select({
      id: brands.id,
      slug: brands.slug
    }).from(brands)

    const brandBySlug = new Map(brandRows.map((row) => [row.slug, row.id]))

    const missingBrandSlugs = [...new Set(allProductSeedData
      .map((entry) => entry.brandSlug)
      .filter((slugValue) => !brandBySlug.has(slugValue)))]

    if (missingBrandSlugs.length > 0) {
      throw new Error(`Missing brand slugs referenced by products: ${missingBrandSlugs.join(', ')}`)
    }

    const productInsertRows = allProductSeedData.map((entry) => ({
      brandId: brandBySlug.get(entry.brandSlug)!,
      caffeineMg: entry.caffeineMg,
      calories: entry.calories,
      carbsG: entry.carbsG,
      fatG: entry.fatG,
      flavor: entry.flavor,
      form: entry.form,
      name: entry.name,
      notes: entry.notes,
      proteinG: entry.proteinG,
      servingSize: entry.servingSize,
      servingsPerPackage: entry.servingsPerPackage,
      servingUnit: entry.servingUnit,
      slug: entry.slug,
      sodiumMg: entry.sodiumMg,
      sugarG: entry.sugarG
    }))

    await db.insert(products).values(productInsertRows).onConflictDoUpdate({
      set: {
        brandId: sql`excluded.brand_id`,
        caffeineMg: sql`excluded.caffeine_mg`,
        calories: sql`excluded.calories`,
        carbsG: sql`excluded.carbs_g`,
        fatG: sql`excluded.fat_g`,
        flavor: sql`excluded.flavor`,
        form: sql`excluded.form`,
        isActive: true,
        name: sql`excluded.name`,
        notes: sql`excluded.notes`,
        proteinG: sql`excluded.protein_g`,
        servingSize: sql`excluded.serving_size`,
        servingsPerPackage: sql`excluded.servings_per_package`,
        servingUnit: sql`excluded.serving_unit`,
        sodiumMg: sql`excluded.sodium_mg`,
        sugarG: sql`excluded.sugar_g`,
        updatedAt: sql`now()`
      },
      target: [products.brandId, products.slug]
    })

    const [{ brandCount }] = await db.select({
      brandCount: sql<number>`count(*)::int`
    }).from(brands)

    const [{ productCount }] = await db.select({
      productCount: sql<number>`count(*)::int`
    }).from(products)

    if (brandCount < brandSeedData.length) {
      throw new Error(`Seed assertion failed: expected at least ${brandSeedData.length} brands, found ${brandCount}`)
    }

    if (productCount < allProductSeedData.length) {
      throw new Error(`Seed assertion failed: expected at least ${allProductSeedData.length} products, found ${productCount}`)
    }

    const requiredBrands = await db.select({
      slug: brands.slug
    }).from(brands).where(inArray(brands.slug, [...REQUIRED_BRAND_SLUGS]))

    if (requiredBrands.length !== REQUIRED_BRAND_SLUGS.length) {
      throw new Error(`Seed assertion failed: required brand slugs missing (${REQUIRED_BRAND_SLUGS.join(', ')})`)
    }

    const sisBrandId = brandBySlug.get('sis')
    const maurtenBrandId = brandBySlug.get('maurten')
    const guBrandId = brandBySlug.get('gu-energy')

    if (!sisBrandId || !maurtenBrandId || !guBrandId) {
      throw new Error('Seed assertion failed: missing core brand IDs while verifying products')
    }

    const requiredProducts = await db.select({
      slug: products.slug
    }).from(products).where(
      and(
        inArray(products.slug, [...REQUIRED_PRODUCT_SLUGS]),
        inArray(products.brandId, [sisBrandId, maurtenBrandId, guBrandId])
      )
    )

    if (requiredProducts.length !== REQUIRED_PRODUCT_SLUGS.length) {
      throw new Error(`Seed assertion failed: required product slugs missing (${REQUIRED_PRODUCT_SLUGS.join(', ')})`)
    }
  } finally {
    await client.end()
  }
}

if (import.meta.main) {
  runSeed()
    .then(() => {
      console.warn('Database seed completed successfully')
    })
    .catch((error) => {
      console.error('Database seed failed')
      console.error(error)
      process.exitCode = 1
    })
}
