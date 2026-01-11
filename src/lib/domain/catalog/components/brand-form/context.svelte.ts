import type { CatalogBrand } from '$lib/domain/catalog/queries'

import { ResultAsync } from 'neverthrow'
import { getContext, setContext } from 'svelte'
import * as v from 'valibot'

import { createBrandMutation, updateBrandMutation } from '$lib/domain/catalog/queries'
import { BrandSchema, generateSlug } from '$lib/domain/catalog/schemas'
import { noop } from '$lib/utils'

const BRAND_FORM_CONTEXT_KEY = Symbol('brand-form')

export type BrandFormState = {
  name: string
  slug: string
  website: string
  description: string
  logoUrl: string
}

export type BrandFormContext = {
  isEditing: boolean
  isPending: boolean
  state: BrandFormState
  submit: () => Promise<void>
  updateField: <K extends keyof BrandFormState>(key: K, value: BrandFormState[K]) => void
  autoSlug: boolean
  close: () => void
  disableAutoSlug: () => void
  error: Error | null
  errors: Record<string, string>
}

type CreateBrandFormContextArgs = () => {
  onOpenChange: (open: boolean) => void
  open: boolean
  brand?: CatalogBrand
}

const createInitialState = (brand?: CatalogBrand): BrandFormState => ({
  description: brand?.description ?? '',
  logoUrl: brand?.logo_url ?? '',
  name: brand?.name ?? '',
  slug: brand?.slug ?? '',
  website: brand?.website ?? ''
})

export const createBrandFormContext = (getter: CreateBrandFormContextArgs): BrandFormContext => {
  const { brand, onOpenChange, open } = $derived(getter())

  const createMutation = createBrandMutation()
  const editMutation = $derived(updateBrandMutation(brand?.id))

  const isEditing = $derived(!!brand)
  const mutation = $derived(isEditing ? editMutation : createMutation)

  let state = $state<BrandFormState>(createInitialState(brand))
  let errors = $state<Record<string, string>>({})
  let autoSlug = $state(!brand)

  const validate = () => {
    const result = v.safeParse(BrandSchema, {
      description: state.description || undefined,
      logoUrl: state.logoUrl || undefined,
      name: state.name,
      slug: state.slug,
      website: state.website || undefined
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

    await ResultAsync.fromPromise(
      mutation.mutateAsync({
        description: data.description ?? null,
        logo_url: data.logoUrl ?? null,
        name: data.name,
        slug: data.slug,
        website: data.website ?? null
      }),
      (error) => error as Error
    ).match(
      () => onOpenChange(false),
      noop
    )
  }

  const close = () => {
    onOpenChange(false)
  }

  const updateField = <K extends keyof BrandFormState>(key: K, value: BrandFormState[K]) => {
    state[key] = value
  }

  const disableAutoSlug = () => {
    autoSlug = false
  }

  $effect(() => {
    if (!open) {
      return
    }

    state = createInitialState(brand)
    errors = {}
    autoSlug = !brand
  })

  $effect(() => {
    if (autoSlug && state.name) {
      state.slug = generateSlug(state.name)
    }
  })

  const value: BrandFormContext = {
    get autoSlug() {
      return autoSlug
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
    get isPending() {
      return mutation.isPending
    },
    get state() {
      return state
    },
    submit,
    updateField
  }

  setContext(BRAND_FORM_CONTEXT_KEY, value)
  return value
}

export const getBrandFormContext = (): BrandFormContext => {
  const context = getContext<BrandFormContext>(BRAND_FORM_CONTEXT_KEY)
  if (!context) {
    throw new Error('BrandFormContext not found. Make sure to call createBrandFormContext first.')
  }
  return context
}
