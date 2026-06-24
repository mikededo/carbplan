import type { ProductForm } from '@carbplan/domain/product'

import type { CatalogProduct } from '$lib/api/endpoint-types'
import type { CatalogBrand } from '$lib/domain/catalog/queries/catalog'

import { ResultAsync } from 'neverthrow'
import { getContext, setContext } from 'svelte'

import { createProductMutation, deactivateProductMutation, updateProductMutation } from '$lib/domain/catalog/queries/mutations'
import { useCatalogQuery } from '$lib/domain/catalog/queries/use-catalog-query.svelte'
import { generateSlug, ProductSchema } from '$lib/domain/catalog/schemas'
import { noop } from '$lib/utils'

const PRODUCT_FORM_CONTEXT_KEY = Symbol('product-form')

export type ProductFormState = {
  brandId: string
  caffeineMg: string
  calories: string
  carbsG: string
  fatG: string
  flavor: string
  form: '' | ProductForm
  name: string
  notes: string
  proteinG: string
  servingSize: string
  servingsPerPackage: string
  servingUnit: string
  slug: string
  sodiumMg: string
  sugarG: string
}

export type ProductFormContext = {
  autoSlug: boolean
  brands: CatalogBrand[]
  close: () => void
  deactivate: () => Promise<void>
  disableAutoSlug: () => void
  error: Error | null
  errors: Record<string, string>
  isDeactivating: boolean
  isEditing: boolean
  isLoadingBrands: boolean
  isPending: boolean
  state: ProductFormState
  submit: () => Promise<void>
  updateField: <K extends keyof ProductFormState>(key: K, value: ProductFormState[K]) => void
}

type CreateProductFormContextArgs = () => {
  open: boolean
  product?: CatalogProduct
  onOpenChange: (open: boolean) => void
}

const parseNumber = (value: string): number | undefined => {
  if (!value) {
    return undefined
  }
  const parsed = Number(value)
  return Number.isNaN(parsed) ? undefined : parsed
}

const createInitialState = (product?: CatalogProduct): ProductFormState => ({
  brandId: product?.brandId ?? '',
  caffeineMg: product?.caffeineMg?.toString() ?? '',
  calories: product?.calories?.toString() ?? '',
  carbsG: product?.carbsG?.toString() ?? '',
  fatG: product?.fatG?.toString() ?? '',
  flavor: product?.flavor ?? '',
  form: product?.form ?? '',
  name: product?.name ?? '',
  notes: product?.notes ?? '',
  proteinG: product?.proteinG?.toString() ?? '',
  servingSize: product?.servingSize?.toString() ?? '',
  servingsPerPackage: product?.servingsPerPackage?.toString() ?? '',
  servingUnit: product?.servingUnit ?? 'g',
  slug: product?.slug ?? '',
  sodiumMg: product?.sodiumMg?.toString() ?? '',
  sugarG: product?.sugarG?.toString() ?? ''
})

export const createProductFormContext = (getter: CreateProductFormContextArgs): ProductFormContext => {
  const { onOpenChange, open, product } = $derived(getter())

  const catalogQuery = useCatalogQuery()
  const createMutation = createProductMutation()
  const editMutation = $derived(updateProductMutation(product?.id))
  const deactivateMutation = $derived(deactivateProductMutation(product?.id))

  const brands = $derived(catalogQuery.data ?? [])
  const isEditing = $derived(!!product)
  const mutation = $derived(isEditing ? editMutation : createMutation)

  let state = $state<ProductFormState>(createInitialState(product))
  let errors = $state<Record<string, string>>({})
  let autoSlug = $state(!product)

  const validate = () => {
    const result = ProductSchema.safeParse({
      brandId: state.brandId,
      caffeineMg: parseNumber(state.caffeineMg),
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
      const flatErrors = result.error.flatten()
      errors = Object.fromEntries(
        Object.entries(flatErrors.fieldErrors ?? {}).map(([key, value]) => [key, value?.[0] ?? ''])
      )
      return null
    }

    errors = {}
    return result.data
  }

  const submit = async () => {
    const data = validate()
    if (!data) {
      return
    }

    await ResultAsync.fromPromise(
      mutation.mutateAsync({
        brandId: data.brandId,
        caffeineMg: data.caffeineMg,
        calories: data.calories,
        carbsG: data.carbsG,
        fatG: data.fatG,
        flavor: data.flavor,
        form: data.form,
        isActive: true,
        name: data.name,
        notes: data.notes,
        proteinG: data.proteinG,
        servingSize: data.servingSize,
        servingsPerPackage: data.servingsPerPackage,
        servingUnit: data.servingUnit,
        slug: data.slug,
        sodiumMg: data.sodiumMg,
        sugarG: data.sugarG
      }).then(() => undefined),
      (error) => error as Error
    ).match(
      () => onOpenChange(false),
      noop
    )
  }

  const close = () => {
    onOpenChange(false)
  }

  const deactivate = async () => {
    await ResultAsync.fromPromise(
      deactivateMutation.mutateAsync(),
      (error) => error as Error
    ).match(
      () => onOpenChange(false),
      noop
    )
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

  const value: ProductFormContext = {
    get autoSlug() {
      return autoSlug
    },
    get brands() {
      return brands
    },
    close,
    deactivate,
    disableAutoSlug,
    get error() {
      return mutation.error
    },
    get errors() {
      return errors
    },
    get isDeactivating() {
      return deactivateMutation.isPending
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

  setContext(PRODUCT_FORM_CONTEXT_KEY, value)
  return value
}

export const getProductFormContext = (): ProductFormContext => {
  const context = getContext<ProductFormContext>(PRODUCT_FORM_CONTEXT_KEY)
  if (!context) {
    throw new Error('ProductFormContext not found. Make sure to call createProductFormContext first.')
  }
  return context
}
