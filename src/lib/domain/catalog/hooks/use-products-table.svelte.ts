import type { Brand, Product, ProductForm } from '$lib/database/types.g'

import type { CatalogResult } from '../queries'

import { SvelteSet } from 'svelte/reactivity'

export type SortColumn = 'serving' | keyof Product
export type SortDirection = 'asc' | 'desc'

export type TableColumn = {
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

export const useProductsTable = (getBrands: () => CatalogResult) => {
  const state = $state<TableState>({
    collapsedBrands: new SvelteSet(),
    formFilter: '',
    globalFilter: '',
    sortColumn: 'name',
    sortDirection: 'asc'
  })

  const filteredBrands = $derived.by(() => {
    const brands = getBrands()
    const searchLower = state.globalFilter.toLowerCase()

    return brands.map((brand) => {
      let products = brand.products

      if (state.formFilter) {
        products = products.filter((p) => p.form === state.formFilter)
      }

      if (state.globalFilter) {
        const matchesBrand = brand.name.toLowerCase().includes(searchLower)
        products = products.filter((p) =>
          matchesBrand || p.name.toLowerCase().includes(searchLower)
        )
      }

      products = [...products].sort((a, b) => {
        let aVal: boolean | null | number | string
        let bVal: boolean | null | number | string

        if (state.sortColumn === 'serving') {
          aVal = `${a.serving_size}${a.serving_unit}`
          bVal = `${b.serving_size}${b.serving_unit}`
        } else {
          aVal = a[state.sortColumn]
          bVal = b[state.sortColumn]
        }

        if (aVal === null && bVal === null) {
          return 0
        }
        if (aVal === null) {
          return 1
        }
        if (bVal === null) {
          return -1
        }

        const cmp = aVal < bVal ? -1 : aVal > bVal ? 1 : 0
        return state.sortDirection === 'asc' ? cmp : -cmp
      })

      return { ...brand, products }
    }).filter((brand) => brand.products.length > 0)
  })

  const totalProducts = $derived(getBrands().reduce((acc, b) => acc + b.products.length, 0))
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
