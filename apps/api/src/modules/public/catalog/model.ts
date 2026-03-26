import type { CatalogProductListItem } from '@carbplan/contracts/catalog'
import type { SortDirection, SortOptions } from '@carbplan/contracts/pagination'
import type { ProductForm } from '@carbplan/domain/product'

import type { PaginationModel, PaginationWithTotal } from '$utils/pagination'

export type CatalogSortField =
  | 'caffeineMg' |
  'calories' |
  'carbsG' |
  'fatG' |
  'name' |
  'proteinG' |
  'sodiumMg' |
  'sugarG'

export type CatalogSortSelection = {
  direction: SortDirection
  field: CatalogSortField
}

export type CatalogProductsListQuery = {
  sort: SortOptions<CatalogSortField>
  brand?: string[] | undefined
  caloriesGte?: number | undefined
  caloriesLte?: number | undefined
  carbsGte?: number | undefined
  carbsLte?: number | undefined
  form?: ProductForm[] | undefined
  q?: string | undefined
} & PaginationModel

export type CatalogListPageResult = {
  data: CatalogProductListItem[]
  meta: PaginationWithTotal
}

export class CatalogQueryValidationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'CatalogQueryValidationError'
  }
}
