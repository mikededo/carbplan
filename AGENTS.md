# CarbPlan AI Agent Guide

This document provides comprehensive information for AI agents working on the CarbPlan codebase.

## Project Overview

CarbPlan is an athlete nutrition planning web app where athletes and coaches configure ride/workout nutrition plans using an admin-curated supplement catalog.

- **Language**: TypeScript (strict, ESM)
- **Runtime**: Bun
- **Framework**: SvelteKit 2.x + Svelte 5 (runes only)
- **Database**: Supabase (Postgres + Auth)
- **Styling**: Tailwind CSS 4.x + tailwind-variants
- **Components**: bits-ui (shadcn-svelte pattern)
- **Validation**: Valibot
- **Error handling**: Neverthrow
- **Icons**: @lucide/svelte
- **Data fetching**: TanStack Query (svelte-query)

## Setup and Development

### Initial Setup
1. Run `bun install` to install dependencies
2. Run `bun dev` to start the dev server
3. As of now, there's no local supabase instance

Other helpful scripts:
- Always make sure the project is linted: `bun lint`
- There should not be type errors: `bun check`

## Project development

Focus only in one task, and the task should be developed using TDD. While tests should have maxium coverage, they should be concise, clear. Re-use code whenever possible.

## Project Structure

### Core Directories
- `src/lib/domain/ui/` — UI components (shadcn-svelte style)
- `src/lib/domain/query/` — TanStack Query utilities (client, keys, provider)
- `src/lib/constants/` — App constants (routes, etc.)
- `src/lib/database/` — Supabase types and client helpers, which are generated from the database
- `src/lib/hooks/` — Shared Svelte hooks
- `src/lib/utils.ts` — Utility functions (`cn`, type helpers)

### Domain driven design

The repository follows a domain driven architecture. Each domain is stored under `src/lib/domain`. Each domain can contain:

- `components` folder (domain coupled components)
- `queries` folder (TanStack Query hooks and options)
- `context` file (context specific for that domain)
- `types` file (types for that domain)
- `schemas` file (valibot schemas for that domain)

If there's anything that's shared within the app, that's not a UI component, it should exist under the `global` domain. Domains can also be really small/modular.

## 

## Code Style and Conventions

We should aim for a modular/atomic approach, minimizing shared logic, ensuring state exists only where it makes sense. Avoid barrel files.

### Formatting and Linting
- **Always run** `bun lint` after making changes
- Fix non-auto-fixable errors manually
- ESLint auto-sorts Tailwind classes and Svelte attributes

### TypeScript
- Use `type` over `interface` (enforced)
- Separate type imports: `import type { X } from 'y'`
- Prefix unused vars with `_`, or simply name them `_`, `__`, ...
- Use arrow function expressions
- Prefer `satisfies` over `as`
- Prefer object as parameters over positional parameters
- Prefer absolute imports

### Testing
- Use `vitest` for unit tests
- Unit test should reside next to the file being tested with the same name but with `.test.ts` suffix
- Fix any test until the whole suite is green
- Keep tests focused and small. 
- Avoid duplicating code within the tests

### Svelte 5
- **You must use runes**: `$props()`, `$state()`, `$derived()`, `$effect()`
- **Never use** legacy syntax (`export let`, `$:`, etc.)
- **Indentation**: 4 spaces in `.svelte`, 2 spaces in `.ts`
- **Quotes**: Single in TS, double in Svelte HTML attributes
- **No semicolons**

### Props Pattern
```svelte
<script lang="ts">
    type Props = { propA: string; propB?: number }
    const { propA, propB }: Props = $props()
</script>
```

### Module Exports Pattern
```svelte
<script lang="ts" module>
    export type ButtonProps = { ... }
    export const buttonVariants = tv({ ... })
</script>
```

### Error handling

Prefer `neverthrow` over `try-catch` pattern

## TanStack Query

### Structure
- `src/lib/domain/query/` — Core utilities (client, keys, provider)
- Each domain has a `queries/` folder with its query hooks

### Naming Conventions
- Query hooks: `useXQuery` (e.g., `useAthleteQuery`, `useSupplementsQuery`)
- Mutation hooks: `createXMutation` (e.g., `createAthleteMutation`)
- Query options: `xOptions` (e.g., `athleteOptions`)
- Context getters: `getX` (e.g., `getSupabaseClient`) — not `useX`

### Query Keys
Define all keys in `src/lib/domain/query/keys.ts`:
```ts
export const queryKeys = {
  athlete: {
    all: ['athlete'] as const,
    current: () => [...queryKeys.athlete.all, 'current'] as const
  }
} as const
```

### Query Options Pattern
Use `queryOptions` for type-safe queries:

```ts
import { queryOptions } from '@tanstack/svelte-query'
import { queryKeys } from '$lib/domain/query/keys'

export const getAthleteOptions = (supabase: Client) =>
  queryOptions({
    queryKey: queryKeys.athlete.current(),
    queryFn: async () => {
      const { data, error } = await supabase.from('table').select('*').single()
      if (error) throw error
      return data
    }
  })
```

### Query Hook Pattern

```ts
import { createQuery } from '@tanstack/svelte-query'
import { getAthleteOptions } from './athlete'

export const useAthleteQuery = () => {
  const supabaseResult = getSupabaseClient()
  if (supabaseResult.isErr()) {
    return null
  }

  return createQuery(() => getAthleteOptions(supabaseResult.value))
}
```

### Mutation with Optimistic Updates

```ts
import { createMutation, useQueryClient } from '@tanstack/svelte-query'
import { athleteOptions } from './athlete'

export const createAthleteMutation = (athleteId?: string) => {
  const queryClient = useQueryClient()
  const supabaseResult = getSupabaseClient()
  
  if (supabaseResult.isErr()) {
    return null
  }

  const supabase = supabaseResult.value
  const options = getAthleteOptions(supabase)
  return createMutation({
    mutationFn: async (input) => {
      const { data, error } = await supabase.from('table').update(input).eq('id', athleteId).select().single()
      if (error) throw error
      return data
    },
    onMutate: async (input) => {
      await queryClient.cancelQueries({ queryKey: options.queryKey })
      const previous = queryClient.getQueryData(options.queryKey)
      queryClient.setQueryData(options.queryKey, (old) => ({ ...old, ...input }))
      return { previous }
    },
    onError: (_, __, context) => {
      if (context?.previous) {
        queryClient.setQueryData(options.queryKey, context.previous)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: options.queryKey })
    }
  })
}
```

### SSR with SvelteKit
Prefetch data in `+layout.ts` or `+page.ts`:
```ts
export const load: LayoutLoad = async ({ parent }) => {
  const { queryClient, supabase } = await parent()
  await queryClient.prefetchQuery(athleteOptions(supabase))
}
```

### Usage in Components
```svelte
<script lang="ts">
    const athleteQuery = useAthleteQuery()
    const mutation = $derived(createAthleteMutation(data.session?.user.id))

    mutation.mutate({ ... })
</script>
```

## Common Patterns

### Form Actions (SvelteKit)
```ts
import * as v from 'valibot'

const Schema = v.object({ ... })

export const actions = {
  default: async ({ locals: { supabase }, request }) => {
    const formData = await request.formData()
    const result = v.safeParse(Schema, { ... })
    
    if (!result.success) {
      return fail(400, { errors: v.flatten(result.issues), values: { ... } })
    }
    
    const { error } = await supabase...
    if (error) {
      return fail(400, { message: error.message })
    }
    
    redirect(303, ROUTES.destination)
  }
} satisfies Actions
```

### UI Components (shadcn-svelte)
```svelte
<script lang="ts" module>
    import type { WithElementRef } from '$lib/utils.js'
    import { tv } from 'tailwind-variants'
    
    import { cn } from '$lib/utils.js'
    
    export const variants = tv({ ... })
    export type Props = { variant?: ... } & WithElementRef<HTMLButtonAttributes>
</script>

<script lang="ts">
    let { class: className, variant, ref = $bindable(null), ...restProps }: Props = $props()
</script>

<element class={cn(variants({ variant }), className)} bind:this={ref} {...restProps}>
    {@render children?.()}
</element>
```

### Supabase Access
- **Server**: `locals.supabase` (from hooks.server.ts)
- **Client**: `data.supabase` (from layout load)
- **Safe session**: `locals.safeGetSession()` (validates JWT)
- **Client type**: `Client` from `$lib/database/types`
- **Query result helper**: `Result<T>` for typing query results

### Routes Constants
```ts
import { ROUTES } from '$lib/constants/routes'

redirect(303, ROUTES.home)
href={ROUTES.auth.login}
```

## Troubleshooting

### Common Issues
- Ensure Bun is used (not npm/yarn)
- Run `bun db:types` after schema changes

### Code Quality Checks
- Run `bun lint` for linting errors
- Run `bun check` for Svelte/TS type errors
- Run `bun test` for tests
- Error handling: Return `fail()` with structured errors, never throw in actions
