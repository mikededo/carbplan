import type { Session, User } from '@kilo/contracts/auth'
import type { Icon as IconType } from '@lucide/svelte'
import type { ComponentProps } from 'svelte'

import type { Pathname } from '$app/types'
import type { AthletesService } from '$lib/domain/athletes/service'

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
      athletes: AthletesService
    }
    interface PageData {
      session?: null | Session
      user?: null | User
    }

    // interface Error {}
    // interface PageState {}
    // interface Platform {}
  }
}

export { }
