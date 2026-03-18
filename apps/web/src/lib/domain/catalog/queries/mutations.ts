import type { Brand, BrandInsert, BrandUpdate, Product, ProductInsert, ProductUpdate } from '$lib/database/types.g'

import type { CatalogResult } from './catalog'

import { createMutation, useQueryClient } from '@tanstack/svelte-query'

import { getSupabaseClient } from '$lib/database/context'

import { catalogOptions } from './catalog'

type CatalogMutateContext = { previous?: CatalogResult }

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
    onError: (_, __, context: CatalogMutateContext | undefined) => {
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
    onError: (_, __, context: CatalogMutateContext | undefined) => {
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

export const createProductMutation = () => {
  const supabaseResult = getSupabaseClient()
  const queryClient = useQueryClient()
  const options = catalogOptions()

  const isEnabled = supabaseResult.isOk()
  const supabase = isEnabled ? supabaseResult.value : null

  return createMutation(() => ({
    mutationFn: async (input: Omit<ProductInsert, 'created_at' | 'id' | 'updated_at'>) => {
      if (!supabase) {
        throw new Error('Supabase client not available')
      }

      const { data, error } = await supabase
        .from('products')
        .insert(input)
        .select()
        .single()

      if (error) {
        throw error
      }

      return data
    },
    onError: (_, __, context: CatalogMutateContext | undefined) => {
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

        const newProduct: Product = {
          brand_id: input.brand_id,
          caffeine_mg: input.caffeine_mg ?? null,
          calories: input.calories ?? null,
          carbs_g: input.carbs_g ?? null,
          created_at: new Date().toISOString(),
          fat_g: input.fat_g ?? null,
          flavor: input.flavor ?? null,
          form: input.form,
          id: crypto.randomUUID(),
          is_active: input.is_active ?? true,
          name: input.name,
          notes: input.notes ?? null,
          protein_g: input.protein_g ?? null,
          serving_size: input.serving_size,
          serving_unit: input.serving_unit ?? 'g',
          servings_per_package: input.servings_per_package ?? null,
          slug: input.slug,
          sodium_mg: input.sodium_mg ?? null,
          sugar_g: input.sugar_g ?? null,
          updated_at: new Date().toISOString()
        }

        return old.map((brand) => {
          if (brand.id !== input.brand_id) {
            return brand
          }

          return {
            ...brand,
            products: [...brand.products, newProduct].sort((a, b) => a.name.localeCompare(b.name))
          }
        })
      })

      return { previous }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: options.queryKey })
    }
  }))
}

export const updateProductMutation = (productId?: Product['id']) => {
  const supabaseResult = getSupabaseClient()
  const queryClient = useQueryClient()
  const options = catalogOptions()

  const isEnabled = supabaseResult.isOk() && !!productId
  const supabase = isEnabled ? supabaseResult.value : null

  return createMutation(() => ({
    mutationFn: async (input: Omit<ProductUpdate, 'created_at' | 'id' | 'updated_at'>) => {
      if (!supabase || !productId) {
        throw new Error('Supabase client or product ID not available')
      }

      const { data, error } = await supabase
        .from('products')
        .update(input)
        .eq('id', productId)
        .select()
        .single()

      if (error) {
        throw error
      }

      return data
    },
    onError: (_, __, context: CatalogMutateContext | undefined) => {
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

        return old.map((brand) => ({
          ...brand,
          products: brand.products.map((product) => {
            if (product.id !== productId) {
              return product
            }

            return {
              ...product,
              ...input,
              updated_at: new Date().toISOString()
            }
          }).sort((a, b) => a.name.localeCompare(b.name))
        }))
      })

      return { previous }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: options.queryKey })
    }
  }))
}

export const deactivateProductMutation = (productId?: Product['id']) => {
  const supabaseResult = getSupabaseClient()
  const queryClient = useQueryClient()
  const options = catalogOptions()

  const isEnabled = supabaseResult.isOk() && !!productId
  const supabase = isEnabled ? supabaseResult.value : null

  return createMutation(() => ({
    mutationFn: async () => {
      if (!supabase || !productId) {
        throw new Error('Supabase client or product ID not available')
      }

      const { data, error } = await supabase.rpc(
        'deactivate_product',
        { p_product_id: productId }
      )

      if (error) {
        throw error
      }

      return data
    },
    onError: (_, __, context: CatalogMutateContext | undefined) => {
      if (context?.previous) {
        queryClient.setQueryData(options.queryKey, context.previous)
      }
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: options.queryKey })

      const previous = queryClient.getQueryData(options.queryKey)
      queryClient.setQueryData(options.queryKey, (old) => {
        if (!old) {
          return old
        }

        return old.map((brand) => ({
          ...brand,
          products: brand.products.filter((product) => product.id !== productId)
        }))
      })

      return { previous }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: options.queryKey })
    }
  }))
}
