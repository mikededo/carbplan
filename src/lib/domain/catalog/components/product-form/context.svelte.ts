import type { Product, ProductFormType } from '$lib/database/types.g'
import type { CatalogBrand } from '$lib/domain/catalog/queries'

import { getContext, setContext } from 'svelte'
import * as v from 'valibot'

import { createProductMutation, updateProductMutation, useCatalogQuery } from '$lib/domain/catalog/queries'
import { generateSlug, ProductSchema } from '$lib/domain/catalog/schemas'

const PRODUCT_FORM_CONTEXT_KEY = Symbol('product-form')

export type ProductFormState = {
  brandId: string
  caffeineMg: string
  carbsG: string
  fatG: string
  name: string
  servingSize: string
  servingsPerPackage: string
  servingUnit: string
  slug: string
  sugarG: string
  calories: string
  flavor: string
  form: '' | ProductFormType
  notes: string
  proteinG: string
  sodiumMg: string
}

export type ProductFormContext = {
  brands: CatalogBrand[]
  isEditing: boolean
  isPending: boolean
  state: ProductFormState
  submit: () => Promise<void>
  updateField: <K extends keyof ProductFormState>(key: K, value: ProductFormState[K]) => void
  autoSlug: boolean
  close: () => void
  disableAutoSlug: () => void
  error: Error | null
  errors: Record<string, string>
  isLoadingBrands: boolean
}

type CreateProductFormContextArgs = () => {
  onOpenChange: (open: boolean) => void
  open: boolean
  product?: Product
}

const parseNumber = (value: string): number | undefined => {
  if (!value) {
    return undefined
  }
  const parsed = Number(value)
  return Number.isNaN(parsed) ? undefined : parsed
}

const createInitialState = (product?: Product): ProductFormState => ({
  brandId: product?.brand_id ?? '',
  caffeineMg: product?.caffeine_mg?.toString() ?? '',
  calories: product?.calories?.toString() ?? '',
  carbsG: product?.carbs_g?.toString() ?? '',
  fatG: product?.fat_g?.toString() ?? '',
  flavor: product?.flavor ?? '',
  form: product?.form ?? '',
  name: product?.name ?? '',
  notes: product?.notes ?? '',
  proteinG: product?.protein_g?.toString() ?? '',
  servingSize: product?.serving_size?.toString() ?? '',
  servingsPerPackage: product?.servings_per_package?.toString() ?? '',
  servingUnit: product?.serving_unit ?? 'g',
  slug: product?.slug ?? '',
  sodiumMg: product?.sodium_mg?.toString() ?? '',
  sugarG: product?.sugar_g?.toString() ?? ''
})

export const createProductFormContext = (getter: CreateProductFormContextArgs): ProductFormContext => {
  const { onOpenChange, open, product } = $derived(getter())

  const catalogQuery = useCatalogQuery()
  const createMutation = createProductMutation()
  const editMutation = $derived(updateProductMutation(product?.id))

  const brands = $derived(catalogQuery.data ?? [])
  const isEditing = $derived(!!product)
  const mutation = $derived(isEditing ? editMutation : createMutation)

  let state = $state<ProductFormState>(createInitialState(product))
  let errors = $state<Record<string, string>>({})
  let autoSlug = $state(!product)

  const validate = () => {
    const result = v.safeParse(ProductSchema, {
      brandId: state.brandId,
      caffeineGm: parseNumber(state.caffeineMg),
      calories: parseNumber(state.calories),
      carbsG: parseNumber(state.carbsG),
      fatG: parseNumber(state.fatG),
      flavor: state.flavor || undefined,
      form: state.form || undefined,
      name: state.name,
      notes: state.notes || undefined,
      proteinG: parseNumber(state.proteinG),
      servingSize: parseNumber(state.servingSize),
      servingsPerPackage: parseNumber(state.servingsPerPackage),
      servingUnit: state.servingUnit,
      slug: state.slug,
      sodiumMg: parseNumber(state.sodiumMg),
      sugarG: parseNumber(state.sugarG)
    })

    if (!result.success) {
      const flatErrors = v.flatten(result.issues)
      errors = Object.fromEntries(
        Object.entries(flatErrors.nested ?? {}).map(([key, value]) => [key, value?.[0] ?? ''])
      )
      return null
    }

    errors = {}
    return result.output
  }

  const submit = async () => {
    const data = validate()
    if (!data) {
      return
    }

    try {
      await mutation.mutateAsync({
        brand_id: data.brandId,
        caffeine_mg: data.caffeineGm ?? null,
        calories: data.calories ?? null,
        carbs_g: data.carbsG ?? null,
        fat_g: data.fatG ?? null,
        flavor: data.flavor ?? null,
        form: data.form,
        name: data.name,
        notes: data.notes ?? null,
        protein_g: data.proteinG ?? null,
        serving_size: data.servingSize,
        serving_unit: data.servingUnit,
        servings_per_package: data.servingsPerPackage ?? null,
        slug: data.slug,
        sodium_mg: data.sodiumMg ?? null,
        sugar_g: data.sugarG ?? null
      })
      onOpenChange(false)
    } catch (error) {
      console.error('Failed to save product:', error)
    }
  }

  const close = () => {
    onOpenChange(false)
  }

  const updateField = <K extends keyof ProductFormState>(key: K, value: ProductFormState[K]) => {
    state[key] = value
  }

  const disableAutoSlug = () => {
    autoSlug = false
  }

  $effect(() => {
    if (!open) {
      return
    }

    state = createInitialState(product)
    errors = {}
    autoSlug = !product
  })

  $effect(() => {
    if (autoSlug && state.name) {
      state.slug = generateSlug(state.name)
    }
  })

  const ctx: ProductFormContext = {
    get autoSlug() {
      return autoSlug
    },
    get brands() {
      return brands
    },
    close,
    disableAutoSlug,
    get error() {
      return mutation.error
    },
    get errors() {
      return errors
    },
    get isEditing() {
      return isEditing
    },
    get isLoadingBrands() {
      return catalogQuery.isLoading
    },
    get isPending() {
      return mutation.isPending
    },
    get state() {
      return state
    },
    submit,
    updateField
  }

  setContext(PRODUCT_FORM_CONTEXT_KEY, ctx)
  return ctx
}

export const getProductFormContext = (): ProductFormContext => {
  const ctx = getContext<ProductFormContext>(PRODUCT_FORM_CONTEXT_KEY)
  if (!ctx) {
    throw new Error('ProductFormContext not found. Make sure to call createProductFormContext first.')
  }
  return ctx
}
