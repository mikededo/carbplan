<script lang="ts">
    import type { Snippet } from 'svelte'

    import type { LayoutData } from './$types'

    import { goto } from '$app/navigation'
    import { ROUTES } from '$lib/constants/routes'
    import { AppSidebar } from '$lib/domain/layout/components'
    import * as Sidebar from '$lib/domain/ui/sidebar'

    type Props = { children: Snippet, data: LayoutData }
    const { children, data }: Props = $props()

    const onLogOut = () => {
        data.supabase.auth.signOut().finally(() => {
            goto(ROUTES.auth.login)
        })
    }
</script>

<Sidebar.Provider>
    <AppSidebar athlete={data.athlete} {onLogOut} />
    <Sidebar.Inset>
        {@render children()}
    </Sidebar.Inset>
</Sidebar.Provider>

