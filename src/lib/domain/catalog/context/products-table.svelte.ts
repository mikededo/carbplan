import type { Brand, Product, ProductForm } from '$lib/database/types.g'

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

type TableState = {
  collapsedBrands: SvelteSet<string>
  formFilter: '' | ProductForm
  globalFilter: string
  sortColumn: SortColumn
  sortDirection: SortDirection
}

const PRODUCTS_TABLE_KEY = Symbol('products-table')

const createProductsTableState = (getBrands: () => CatalogResult) => {
  const brands = $derived(getBrands())
  const state = $state<TableState>({
    collapsedBrands: new SvelteSet(),
    formFilter: '',
    globalFilter: '',
    sortColumn: 'name',
    sortDirection: 'asc'
  })

  const filteredBrands = $derived(
    brands.reduce<CatalogResult>((acc, brand) => {
      const filteredProducts = brand.products
        .filter((product) => {
          if (state.formFilter && product.form !== state.formFilter) {
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

  const onFormFilterChange = (value: string | undefined) => {
    state.formFilter = (value as '' | ProductForm) ?? ''
  }

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
    set formFilter(value: '' | ProductForm) {
      state.formFilter = value
    },
    get globalFilter() {
      return state.globalFilter
    },
    set globalFilter(value: string) {
      state.globalFilter = value
    },
    onFormFilterChange,
    onSortColumn,
    onToggleCollapseBrand,
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

