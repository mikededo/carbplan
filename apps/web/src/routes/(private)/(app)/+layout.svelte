<script lang="ts">
    import type { Snippet } from 'svelte'

    import type { LayoutData } from './$types'

    import AppSidebar from '$lib/domain/layout/components/app-sidebar.svelte'
    import { createPrivateServicesContext } from '$lib/domain/services/context'
    import { SidebarInset, SidebarProvider } from '$lib/domain/ui/sidebar'

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
