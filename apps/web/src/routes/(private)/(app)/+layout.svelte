<script lang="ts">
    import type { Snippet } from 'svelte'

    import type { LayoutData } from './$types'

    import { SidebarInset, SidebarProvider } from '@carbplan/ui/sidebar'

    import AppSidebar from '$lib/domain/layout/components/app-sidebar.svelte'
    import { createPrivateServicesContext } from '$lib/domain/services/context'

    type Props = {
        children: Snippet
        data: LayoutData
    }
    const { children, data }: Props = $props()

    createPrivateServicesContext(() => data.privateServices)

    const onLogOut = () => {}
</script>

<SidebarProvider>
    <AppSidebar {onLogOut} />
    <SidebarInset class="overflow-hidden">
        {@render children()}
    </SidebarInset>
</SidebarProvider>
