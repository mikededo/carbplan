import type { Icon as IconType } from '@lucide/svelte'
import type { Session } from '@supabase/supabase-js'
import type { ComponentProps } from 'svelte'

import type { Pathname } from '$app/types'
import type { Transport } from '$lib/api/transport'
import type { AthletesService } from '$lib/domain/athletes/service'
import type { AuthService } from '$lib/domain/auth/service'

declare global {
  type LucideIcon = typeof IconType
  type LucideIconProps = { class?: string } & ComponentProps<LucideIcon>

  type NonApiRoutes = Exclude<Pathname, `/api${string}`>

  type BaseQueryContext<F, U = F> = {
    fallback?: F
    updated?: U
  }

  namespace App {
    interface Locals {
      authService: AuthService
      serverTransport: Transport
      services: {
        athletes: AthletesService
      }
      session: null | Session
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

export { }
