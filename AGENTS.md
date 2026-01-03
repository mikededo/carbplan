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

## Setup and Development

### Initial Setup
1. Run `bun install` to install dependencies
2. Run `bun dev` to start the dev server
3. As of now, there's no local supabase instance

## Project Structure

### Core Directories
- `src/lib/domain/ui/` — UI components (shadcn-svelte style)
- `src/lib/constants/` — App constants (routes, etc.)
- `src/lib/database/` — Supabase types and client helpers, which are generated from the database
- `src/lib/hooks/` — Shared Svelte hooks
- `src/lib/utils.ts` — Utility functions (`cn`, type helpers)

### Domain driven design

The repository follows a domain driven architecture. Each domain is stored under `src/lib/domain`. Each domain can contain:

- `components` folder (domain coupled components)
- `context` file (context specific for that domain)
- `types` file (types for that domain)
- `schemas` file (valibot schemas for that domain)

If there's anything that's shared within the app, that's not a UI component, it should exist under the `global` domain. Domains can also be really small/modular.

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
- **Safe session**: `locals.safeGetSession()` (validates JWT)
- **Client type**: `Client` from `$lib/database/types`
- **Query result helper**: `Result<T>` for typing query results

### Routes Constants
```ts
import { ROUTES } from '$lib/constants/routes'

redirect(303, ROUTES.home)
href={ROUTES.auth.login}
```

## Svelte MCP Tools

You have access to the Svelte MCP server with these tools:

### 1. list-sections
Use this FIRST to discover available documentation sections. Returns titles, use_cases, and paths.

### 2. get-documentation
Retrieves full documentation for specific sections. Use after `list-sections` to fetch ALL relevant sections.

### 3. svelte-autofixer
**You must use this** whenever writing Svelte code. Keep calling until no issues are returned.

### 4. playground-link
Generates a Svelte Playground link. Only use after user confirmation and NEVER if code was written to project files.

## Database

### Types
- **Generated**: `src/lib/database/types.g.ts` — Auto-generated, never edit
- **Custom**: `src/lib/database/types.ts` — Custom helpers
- **Regenerate**: `bun db:types`

### Auth Flow
1. `hooks.server.ts` creates Supabase client + `safeGetSession`
2. Root `+layout.server.ts` loads session/user into page data
3. Root `+layout.svelte` subscribes to auth state changes
4. Public routes under `(public)/` don't require auth

## Troubleshooting

### Common Issues
- Ensure Bun is used (not npm/yarn)
- Run `bun db:types` after schema changes

### Code Quality Checks
- Run `bun lint` for linting errors
- Run `bun check` for Svelte/TS type errors
- Error handling: Return `fail()` with structured errors, never throw in actions
