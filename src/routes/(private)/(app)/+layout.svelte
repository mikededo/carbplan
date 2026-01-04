<script lang="ts">
    import type { Snippet } from 'svelte'

    import type { LayoutData } from './$types'

    import { goto } from '$app/navigation'
    import { ROUTES } from '$lib/constants/routes'
    import { useSupabaseClient } from '$lib/database/context'
    import { AppSidebar } from '$lib/domain/layout/components'
    import { useAthlete } from '$lib/domain/settings/queries'
    import * as Sidebar from '$lib/domain/ui/sidebar'

    type Props = { children: Snippet, data: LayoutData }
    const { children }: Props = $props()

    const supabaseResult = useSupabaseClient()
    const athlete = useAthlete()

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
    {#if athlete?.data}
        <AppSidebar athlete={athlete.data} {onLogOut} />
    {/if}
    <Sidebar.Inset>
        {@render children()}
    </Sidebar.Inset>
</Sidebar.Provider>
