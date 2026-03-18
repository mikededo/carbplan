import type { Brand, Product, ProductFormType } from '$lib/database/types.g'

import type { CatalogResult } from '../queries'

import { getContext, setContext } from 'svelte'
import { SvelteSet } from 'svelte/reactivity'

export type SortColumn = 'serving' | keyof Product
type SortDirection = 'asc' | 'desc'

type TableColumn = {
  key: SortColumn
  label: string
  minSize?: number
  sortable?: boolean
}

export const TABLE_COLUMNS: TableColumn[] = [
  { key: 'name', label: 'Name', minSize: 480, sortable: true },
  { key: 'form', label: 'Type', minSize: 96, sortable: true },
  { key: 'serving', label: 'Serving', sortable: false },
  { key: 'calories', label: 'Calories', sortable: true },
  { key: 'carbs_g', label: 'Carbs', sortable: true },
  { key: 'sugar_g', label: 'Sugar', sortable: true },
  { key: 'sodium_mg', label: 'Sodium', sortable: true },
  { key: 'caffeine_mg', label: 'Caffeine', sortable: true }
]

export const CAFFEINE_MAX = 200
export const CALORIES_MAX = 1000

type TableState = {
  brandFilter: Set<string>
  collapsedBrands: Set<string>
  formFilter: Set<'' | ProductFormType>
  globalFilter: string
  maxCaffeine: null | number
  maxCalories: null | number
  maxCarbs: null | number
  maxSodium: null | number
  minCaffeine: null | number
  minCalories: null | number
  minCarbs: null | number
  minSodium: null | number
  sortColumn: SortColumn
  sortDirection: SortDirection
}

const PRODUCTS_TABLE_KEY = Symbol('products-table')

const createProductsTableState = (getBrands: () => CatalogResult) => {
  const brands = $derived(getBrands())
  const state = $state<TableState>({
    brandFilter: new SvelteSet(),
    collapsedBrands: new SvelteSet(),
    formFilter: new SvelteSet(),
    globalFilter: '',
    maxCaffeine: null,
    maxCalories: null,
    maxCarbs: null,
    maxSodium: null,
    minCaffeine: null,
    minCalories: null,
    minCarbs: null,
    minSodium: null,
    sortColumn: 'name',
    sortDirection: 'asc'
  })

  const filteredBrands = $derived(
    brands.reduce<CatalogResult>((acc, brand) => {
      if (state.brandFilter.size > 0 && !state.brandFilter.has(brand.id)) {
        return acc
      }

      const filteredProducts = brand.products
        .filter((product) => {
          if (state.formFilter.size > 0 && !state.formFilter.has(product.form)) {
            return false
          }
          if (state.minCaffeine !== null && (product.caffeine_mg === null || product.caffeine_mg < state.minCaffeine)) {
            return false
          }
          if (state.maxCaffeine !== null && (product.caffeine_mg === null || product.caffeine_mg > state.maxCaffeine)) {
            return false
          }
          if (state.minCalories !== null && (product.calories === null || product.calories < state.minCalories)) {
            return false
          }
          if (state.maxCalories !== null && (product.calories === null || product.calories > state.maxCalories)) {
            return false
          }
          if (state.minCarbs !== null && (product.carbs_g === null || product.carbs_g < state.minCarbs)) {
            return false
          }
          if (state.maxCarbs !== null && (product.carbs_g === null || product.carbs_g > state.maxCarbs)) {
            return false
          }
          if (state.minSodium !== null && (product.sodium_mg === null || product.sodium_mg < state.minSodium)) {
            return false
          }
          if (state.maxSodium !== null && (product.sodium_mg === null || product.sodium_mg > state.maxSodium)) {
            return false
          }
          if (state.globalFilter) {
            const searchLower = state.globalFilter.toLowerCase()
            const matchesBrand = brand.name.toLowerCase().includes(searchLower)
            return matchesBrand || product.name.toLowerCase().includes(searchLower)
          }

          return true
        })

      if (filteredProducts.length === 0) {
        return acc
      }

      const sortedProducts = filteredProducts.toSorted((a, b) => {
        const aVal = state.sortColumn === 'serving'
          ? `${a.serving_size}${a.serving_unit}`
          : a[state.sortColumn]

        const bVal = state.sortColumn === 'serving'
          ? `${b.serving_size}${b.serving_unit}`
          : b[state.sortColumn]

        if (aVal === null) {
          return bVal === null ? 0 : 1
        }
        if (bVal === null) {
          return -1
        }

        const cmp = aVal < bVal ? -1 : aVal > bVal ? 1 : 0
        return state.sortDirection === 'asc' ? cmp : -cmp
      })

      return [...acc, { ...brand, products: sortedProducts }]
    }, [])
  )

  const totalProducts = $derived(brands.reduce((acc, b) => acc + b.products.length, 0))
  const filteredProductsCount = $derived(filteredBrands.reduce((acc, b) => acc + b.products.length, 0))

  const onProductFormChange = (value: string[]) => {
    state.formFilter = new SvelteSet(value as ('' | ProductFormType)[])
  }

  const onToggleProductForm = (form: '' | ProductFormType) => {
    if (state.formFilter.has(form)) {
      state.formFilter.delete(form)
    } else {
      state.formFilter.add(form)
    }
  }

  const onCaffeineChange = (min: null | number, max: null | number) => {
    state.minCaffeine = min
    state.maxCaffeine = max
  }

  const onBrandFilterChange = (value: string[]) => {
    state.brandFilter = new SvelteSet(value)
  }

  const onCaloriesChange = (min: null | number, max: null | number) => {
    state.minCalories = min
    state.maxCalories = max
  }

  const onCarbsChange = (min: null | number, max: null | number) => {
    state.minCarbs = min
    state.maxCarbs = max
  }

  const onSodiumChange = (min: null | number, max: null | number) => {
    state.minSodium = min
    state.maxSodium = max
  }

  const onResetFilters = () => {
    state.brandFilter = new SvelteSet()
    state.formFilter = new SvelteSet()
    state.maxCaffeine = null
    state.maxCalories = null
    state.maxCarbs = null
    state.maxSodium = null
    state.minCaffeine = null
    state.minCalories = null
    state.minCarbs = null
    state.minSodium = null
  }

  const activeFiltersCount = $derived(
    (state.formFilter.size > 0 ? 1 : 0) +
    (state.minCaffeine !== null || state.maxCaffeine !== null ? 1 : 0) +
    (state.brandFilter.size > 0 ? 1 : 0) +
    (state.minCalories !== null || state.maxCalories !== null ? 1 : 0) +
    (state.minCarbs !== null || state.maxCarbs !== null ? 1 : 0) +
    (state.minSodium !== null || state.maxSodium !== null ? 1 : 0)
  )

  const onSortColumn = (column: SortColumn) => () => {
    if (state.sortColumn === column) {
      state.sortDirection = state.sortDirection === 'asc' ? 'desc' : 'asc'
      return
    }

    state.sortColumn = column
    state.sortDirection = 'asc'
  }

  const onToggleCollapseBrand = (id: Brand['id']) => () => {
    if (state.collapsedBrands.has(id)) {
      state.collapsedBrands.delete(id)
    } else {
      state.collapsedBrands.add(id)
    }
  }

  return {
    get activeFiltersCount() {
      return activeFiltersCount
    },
    get brandFilter() {
      return state.brandFilter
    },
    get brands() {
      return brands
    },
    get collapsedBrands() {
      return state.collapsedBrands
    },
    get filteredBrands() {
      return filteredBrands
    },
    get filteredProductsCount() {
      return filteredProductsCount
    },
    get formFilter() {
      return state.formFilter
    },
    get globalFilter() {
      return state.globalFilter
    },
    set globalFilter(value: string) {
      state.globalFilter = value
    },
    get maxCaffeine() {
      return state.maxCaffeine
    },
    get maxCalories() {
      return state.maxCalories
    },
    get maxCarbs() {
      return state.maxCarbs
    },
    get maxSodium() {
      return state.maxSodium
    },
    get minCaffeine() {
      return state.minCaffeine
    },
    get minCalories() {
      return state.minCalories
    },
    get minCarbs() {
      return state.minCarbs
    },
    get minSodium() {
      return state.minSodium
    },
    onBrandFilterChange,
    onCaffeineChange,
    onCaloriesChange,
    onCarbsChange,
    onProductFormChange,
    onResetFilters,
    onSodiumChange,
    onSortColumn,
    onToggleCollapseBrand,
    onToggleProductForm,
    get sortColumn() {
      return state.sortColumn
    },
    get sortDirection() {
      return state.sortDirection
    },
    get totalProducts() {
      return totalProducts
    }
  }
}

export type ProductsTableContext = ReturnType<typeof createProductsTableState>

export const createProductsTableContext = (getBrands: () => CatalogResult) => {
  const state = createProductsTableState(getBrands)
  setContext(PRODUCTS_TABLE_KEY, state)
  return state
}

export const getProductsTableContext = () => {
  const ctx = getContext<ProductsTableContext | undefined>(PRODUCTS_TABLE_KEY)
  if (!ctx) {
    throw new Error('getProductsTableContext must be called within a component tree with createProductsTableContext')
  }
  return ctx
}

