import type {
  CatalogProduct,
  CreateBrandRequest,
  CreateProductRequest,
  UpdateBrandRequest,
  UpdateProductRequest
} from '@carbplan/contracts/catalog'

import type { CatalogResult } from './catalog'

import { createMutation, useQueryClient } from '@tanstack/svelte-query'
import { err, ok } from 'neverthrow'

import { queryKeys } from '$lib/domain/query/keys'
import { resultAsyncValueOrThrow } from '$lib/domain/query/utils'
import { getPrivateServicesContext } from '$lib/domain/services/context'

type CatalogMutateContext = { previous?: CatalogResult }

const getCatalogService = () => {
  const services = getPrivateServicesContext()
  return services.isOk() ? ok(services.value.catalog) : err()
}

export const createBrandMutation = () => {
  const service = getCatalogService()
  const queryClient = useQueryClient()

  return createMutation(() => ({
    mutationFn: async (input: CreateBrandRequest) => {
      if (service.isErr()) {
        throw new Error('Catalog service not available')
      }

      return resultAsyncValueOrThrow(service.value.createBrand(input))
    },
    onError: (_, __, context: CatalogMutateContext | undefined) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKeys.catalog.all, context.previous)
      }
    },
    onMutate: async (input) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.catalog.all })

      const previous = queryClient.getQueryData<CatalogResult>(queryKeys.catalog.all)
      queryClient.setQueryData<CatalogResult>(queryKeys.catalog.all, (old) => {
        if (!old) {
          return old
        }

        return [...old, {
          createdAt: new Date(),
          description: input.description ?? null,
          id: crypto.randomUUID(),
          isActive: input.isActive,
          logoUrl: input.logoUrl ?? null,
          name: input.name,
          products: [],
          slug: input.slug,
          updatedAt: null,
          website: input.website ?? null
        }].sort((a, b) => a.name.localeCompare(b.name))
      })

      return { previous }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.catalog.all })
    }
  }))
}

export const updateBrandMutation = (brandId?: string) => {
  const service = getCatalogService()
  const queryClient = useQueryClient()

  return createMutation(() => ({
    mutationFn: async (input: UpdateBrandRequest) => {
      if (service.isErr() || !brandId) {
        throw new Error('Catalog service or brand ID not available')
      }

      return resultAsyncValueOrThrow(service.value.updateBrand(brandId, input))
    },
    onError: (_, __, context: CatalogMutateContext | undefined) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKeys.catalog.all, context.previous)
      }
    },
    onMutate: async (input) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.catalog.all })

      const previous = queryClient.getQueryData<CatalogResult>(queryKeys.catalog.all)
      queryClient.setQueryData<CatalogResult>(queryKeys.catalog.all, (old) => {
        if (!old) {
          return old
        }

        return old.map((brand) => brand.id === brandId
          ? {
              ...brand,
              description: input.description ?? brand.description,
              logoUrl: input.logoUrl ?? brand.logoUrl,
              name: input.name ?? brand.name,
              slug: input.slug ?? brand.slug,
              website: input.website ?? brand.website
            }
          : brand).sort((a, b) => a.name.localeCompare(b.name))
      })

      return { previous }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.catalog.all })
    }
  }))
}

export const createProductMutation = () => {
  const service = getCatalogService()
  const queryClient = useQueryClient()

  return createMutation(() => ({
    mutationFn: async (input: CreateProductRequest) => {
      if (service.isErr()) {
        throw new Error('Catalog service not available')
      }

      return resultAsyncValueOrThrow(service.value.createProduct(input))
    },
    onError: (_, __, context: CatalogMutateContext | undefined) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKeys.catalog.all, context.previous)
      }
    },
    onMutate: async (input) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.catalog.all })

      const previous = queryClient.getQueryData<CatalogResult>(queryKeys.catalog.all)
      queryClient.setQueryData<CatalogResult>(queryKeys.catalog.all, (old) => {
        if (!old) {
          return old
        }

        const newProduct: CatalogProduct = {
          ...input,
          caffeineMg: input.caffeineMg ?? null,
          calories: input.calories ?? null,
          carbsG: input.carbsG ?? null,
          createdAt: new Date(),
          fatG: input.fatG ?? null,
          flavor: input.flavor ?? null,
          id: crypto.randomUUID(),
          isActive: input.isActive,
          notes: input.notes ?? null,
          proteinG: input.proteinG ?? null,
          servingsPerPackage: input.servingsPerPackage ?? null,
          sodiumMg: input.sodiumMg ?? null,
          sugarG: input.sugarG ?? null,
          updatedAt: null
        }

        return old.map((brand) => brand.id === input.brandId
          ? { ...brand, products: [...brand.products, newProduct].sort((a, b) => a.name.localeCompare(b.name)) }
          : brand)
      })

      return { previous }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.catalog.all })
    }
  }))
}

export const updateProductMutation = (productId?: string) => {
  const service = getCatalogService()
  const queryClient = useQueryClient()

  return createMutation(() => ({
    mutationFn: async (input: UpdateProductRequest) => {
      if (service.isErr() || !productId) {
        throw new Error('Catalog service or product ID not available')
      }

      return resultAsyncValueOrThrow(service.value.updateProduct(productId, input))
    },
    onError: (_, __, context: CatalogMutateContext | undefined) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKeys.catalog.all, context.previous)
      }
    },
    onMutate: async (input) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.catalog.all })

      const previous = queryClient.getQueryData<CatalogResult>(queryKeys.catalog.all)
      queryClient.setQueryData<CatalogResult>(queryKeys.catalog.all, (old) => {
        if (!old) {
          return old
        }

        return old.map((brand) => ({
          ...brand,
          products: brand.products.map((product) => product.id === productId
            ? { ...product, ...input, updatedAt: new Date() }
            : product).sort((a, b) => a.name.localeCompare(b.name))
        }))
      })

      return { previous }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.catalog.all })
    }
  }))
}

export const deactivateProductMutation = (productId?: string) => {
  const service = getCatalogService()
  const queryClient = useQueryClient()

  return createMutation(() => ({
    mutationFn: async () => {
      if (service.isErr() || !productId) {
        throw new Error('Catalog service or product ID not available')
      }

      return resultAsyncValueOrThrow(service.value.deactivateProduct(productId))
    },
    onError: (_, __, context: CatalogMutateContext | undefined) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKeys.catalog.all, context.previous)
      }
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: queryKeys.catalog.all })

      const previous = queryClient.getQueryData<CatalogResult>(queryKeys.catalog.all)
      queryClient.setQueryData<CatalogResult>(queryKeys.catalog.all, (old) => old?.map((brand) => ({
        ...brand,
        products: brand.products.filter((product) => product.id !== productId)
      })))

      return { previous }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.catalog.all })
    }
  }))
}
