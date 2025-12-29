import type { Icon as IconType } from '@lucide/svelte'
import type { Session } from '@supabase/supabase-js'
import type { ComponentProps } from 'svelte'

import type { Client } from '$lib/database/types'

declare global {
  type LucideIcon = typeof IconType
  type LucideIconProps = { class?: string } & ComponentProps<LucideIcon>

  type BaseQueryContext<F, U = F> = {
    fallback?: F
    updated?: U
  }

  namespace App {
    interface Locals {
      safeGetSession: () => Promise<{
        session: null | Session
        user?: null | Session['user']
      }>
      session: null | Session
      supabase: Client
    }
    interface PageData {
      session: null | Session
      user?: null | Session['user']
    }

    // interface Error {}
    // interface PageState {}
    // interface Platform {}
  }
}

export {}
