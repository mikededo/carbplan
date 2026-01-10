import type { Brand, BrandInsert, BrandUpdate } from '$lib/database/types.g'

import type { CatalogResult } from './catalog'

import { createMutation, useQueryClient } from '@tanstack/svelte-query'

import { getSupabaseClient } from '$lib/database/context'

import { catalogOptions } from './catalog'

type BrandMutateContext = { previous?: CatalogResult }

export const createBrandMutation = () => {
  const supabaseResult = getSupabaseClient()
  const queryClient = useQueryClient()
  const options = catalogOptions()

  const isEnabled = supabaseResult.isOk()
  const supabase = isEnabled ? supabaseResult.value : null

  return createMutation(() => ({
    mutationFn: async (input: Omit<BrandInsert, 'created_at' | 'id' | 'updated_at'>) => {
      if (!supabase) {
        throw new Error('Supabase client not available')
      }

      const { data, error } = await supabase
        .from('brands')
        .insert(input)
        .select()
        .single()

      if (error) {
        throw error
      }

      return data
    },
    onError: (_, __, context: BrandMutateContext | undefined) => {
      if (context?.previous) {
        queryClient.setQueryData(options.queryKey, context.previous)
      }
    },
    onMutate: async (input) => {
      await queryClient.cancelQueries({ queryKey: options.queryKey })

      const previous = queryClient.getQueryData(options.queryKey)
      queryClient.setQueryData(options.queryKey, (old) => {
        if (!old) {
          return old
        }

        const newBrand = {
          description: input.description ?? null,
          id: crypto.randomUUID(),
          logo_url: input.logo_url ?? null,
          name: input.name,
          products: [],
          slug: input.slug,
          website: input.website ?? null
        }

        return [...old, newBrand].sort((a, b) => a.name.localeCompare(b.name))
      })

      return { previous }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: options.queryKey })
    }
  }))
}

export const updateBrandMutation = (brandId?: Brand['id']) => {
  const supabaseResult = getSupabaseClient()
  const queryClient = useQueryClient()
  const options = catalogOptions()

  const isEnabled = supabaseResult.isOk() && !!brandId
  const supabase = isEnabled ? supabaseResult.value : null

  return createMutation(() => ({
    mutationFn: async (input: Omit<BrandUpdate, 'created_at' | 'id' | 'updated_at'>) => {
      if (!supabase || !brandId) {
        throw new Error('Supabase client or brand ID not available')
      }

      const { data, error } = await supabase
        .from('brands')
        .update(input)
        .eq('id', brandId)
        .select()
        .single()

      if (error) {
        throw error
      }

      return data
    },
    onError: (_, __, context: BrandMutateContext | undefined) => {
      if (context?.previous) {
        queryClient.setQueryData(options.queryKey, context.previous)
      }
    },
    onMutate: async (input) => {
      await queryClient.cancelQueries({ queryKey: options.queryKey })

      const previous = queryClient.getQueryData(options.queryKey)
      queryClient.setQueryData(options.queryKey, (old) => {
        if (!old) {
          return old
        }

        return old.map((brand) => {
          if (brand.id !== brandId) {
            return brand
          }

          return {
            ...brand,
            logo_url: input.logo_url !== undefined ? input.logo_url : brand.logo_url,
            name: input.name ?? brand.name,
            slug: input.slug ?? brand.slug
          }
        }).sort((a, b) => a.name.localeCompare(b.name))
      })

      return { previous }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: options.queryKey })
    }
  }))
}
