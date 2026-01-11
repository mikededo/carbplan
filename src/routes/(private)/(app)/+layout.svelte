<script lang="ts">
    import type { Snippet } from 'svelte'

    import type { LayoutData } from './$types'

    import { goto } from '$app/navigation'
    import { ROUTES } from '$lib/constants/routes'
    import { getSupabaseClient } from '$lib/database/context'
    import { AppSidebar } from '$lib/domain/layout/components'
    import * as Sidebar from '$lib/domain/ui/sidebar'

    type Props = { children: Snippet, data: LayoutData }
    const { children }: Props = $props()

    const supabaseResult = getSupabaseClient()

    const onLogOut = () => {
        if (supabaseResult.isErr()) {
            return
        }

        supabaseResult.value.auth.signOut().finally(() => {
            goto(ROUTES.auth.login)
        })
    }
</script>

<Sidebar.Provider>
    <AppSidebar {onLogOut} />
    <Sidebar.Inset class="overflow-hidden">
        {@render children()}
    </Sidebar.Inset>
</Sidebar.Provider>
