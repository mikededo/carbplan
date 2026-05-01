<script lang="ts">
    import type { Snippet } from 'svelte'

    import type { LayoutData } from './$types'

    import { AppSidebar } from '$lib/domain/layout/components'
    import { createPrivateServicesContext } from '$lib/domain/services/context'
    import * as Sidebar from '$lib/domain/ui/sidebar'

    type Props = {
        children: Snippet
        data: LayoutData
    }
    const { children, data }: Props = $props()

    createPrivateServicesContext(() => data.privateServices)

    const onLogOut = () => {}
</script>

<Sidebar.Provider>
    <AppSidebar {onLogOut} />
    <Sidebar.Inset class="overflow-hidden">
        {@render children()}
    </Sidebar.Inset>
</Sidebar.Provider>
