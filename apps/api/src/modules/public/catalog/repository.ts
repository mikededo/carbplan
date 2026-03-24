import type { Db } from '@carbplan/db'
import type { SQL } from 'drizzle-orm'
import type { PgColumn } from 'drizzle-orm/pg-core'

import type { CatalogListPageResult, CatalogProductsListQuery, CatalogSortField } from '$modules/public/catalog/model'

import { brands, products } from '@carbplan/db'
import {
  and,
  asc,
  count,
  desc,
  eq,
  gte,
  ilike,
  inArray,
  lte,
  or,
  sql
} from 'drizzle-orm'
import { errAsync, ResultAsync } from 'neverthrow'

import { CatalogQueryValidationError } from '$modules/public/catalog/model'
import { NUMERIC_NULL_SENTINEL, parseQuerySort, resolveSortSql } from '$utils/sorting'

const SORT_FIELD_MAP: Record<CatalogSortField, PgColumn> = {
  caffeineMg: products.caffeineMg,
  calories: products.calories,
  carbsG: products.carbsG,
  fatG: products.fatG,
  name: products.name,
  proteinG: products.proteinG,
  sodiumMg: products.sodiumMg,
  sugarG: products.sugarG
}

export type PublicCatalogRepository = {
  listCatalogProducts: (query: CatalogProductsListQuery) => ResultAsync<CatalogListPageResult, unknown>
}

export class DbPublicCatalogRepository implements PublicCatalogRepository {
  constructor(private readonly db: Db) { }

  listCatalogProducts(query: CatalogProductsListQuery): ResultAsync<CatalogListPageResult, unknown> {
    const parsedQuery = parseQuerySort(query.sort, SORT_FIELD_MAP)
    if (parsedQuery.isErr()) {
      return errAsync(new CatalogQueryValidationError('Invalid sort param'))
    }

    const { direction, field } = parsedQuery.value
    const sortSql = resolveSortSql({
      direction,
      expression: field !== 'name'
        ? sql`coalesce(${SORT_FIELD_MAP[field]}, ${NUMERIC_NULL_SENTINEL[direction]})`
        : undefined,
      field,
      fields: SORT_FIELD_MAP
    })
    const directionSort = direction === 'asc' ? asc : desc

    const filters: SQL[] = [
      eq(brands.isActive, true),
      eq(products.isActive, true)
    ]

    if (query.brand?.length) {
      filters.push(inArray(brands.slug, query.brand))
    }

    if (query.form?.length) {
      filters.push(inArray(products.form, query.form))
    }

    if (query.q) {
      filters.push(or(
        ilike(products.name, `%${query.q}%`),
        ilike(brands.name, `%${query.q}%`)
      ) as SQL)
    }

    if (query.carbsGte !== undefined) {
      filters.push(gte(products.carbsG, query.carbsGte))
    }
    if (query.carbsLte !== undefined) {
      filters.push(lte(products.carbsG, query.carbsLte))
    }
    if (query.caloriesGte !== undefined) {
      filters.push(gte(products.calories, query.caloriesGte))
    }
    if (query.caloriesLte !== undefined) {
      filters.push(lte(products.calories, query.caloriesLte))
    }

    const whereClause = and(...filters)

    return ResultAsync.fromPromise(
      Promise.all([
        this.db
          .select({
            brandDescription: brands.description,
            brandId: brands.id,
            brandLogoUrl: brands.logoUrl,
            brandName: brands.name,
            brandSlug: brands.slug,
            brandWebsite: brands.website,
            caffeineMg: products.caffeineMg,
            calories: products.calories,
            carbsG: products.carbsG,
            fatG: products.fatG,
            flavor: products.flavor,
            form: products.form,
            id: products.id,
            name: products.name,
            proteinG: products.proteinG,
            servingSize: products.servingSize,
            servingsPerPackage: products.servingsPerPackage,
            servingUnit: products.servingUnit,
            slug: products.slug,
            sodiumMg: products.sodiumMg,
            sugarG: products.sugarG
          })
          .from(brands)
          .innerJoin(products, eq(products.brandId, brands.id))
          .where(whereClause)
          .orderBy(
            directionSort(sortSql.expression),
            directionSort(products.id)
          )
          .limit(query.limit)
          .offset(query.offset),
        this.db
          .select({ total: count() })
          .from(brands)
          .innerJoin(products, eq(products.brandId, brands.id))
          .where(whereClause)
      ]),
      (error) => error
    ).map(([rows, countRows]) => ({
      data: rows,
      meta: {
        limit: query.limit,
        offset: query.offset,
        total: Number(countRows[0]?.total ?? 0)
      }
    }))
  }
}
