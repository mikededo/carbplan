<script lang="ts">
    import type { ComponentProps } from 'svelte'

    import type { CurrentAthlete } from '$lib/database/types.g'

    import { Logo } from '$lib/domain/ui/logo'
    import * as Sidebar from '$lib/domain/ui/sidebar'

    import SidebarNav from './sidebar-nav.svelte'
    import SidebarUser from './sidebar-user.svelte'

    type Props = {
        onLogOut: () => void
        athlete?: CurrentAthlete
    } & ComponentProps<typeof Sidebar.Root>
    const { athlete, onLogOut, ...restProps }: Props = $props()
</script>

<Sidebar.Root collapsible="icon" {...restProps}>
    <Sidebar.Header
        class="flex h-16 flex-row items-center justify-start gap-0 border-b transition-[width,height] group-has-data-[collapsible=icon]/sidebar-wrapper:h-12"
    >
        <div class="flex size-8 items-center justify-center rounded-lg text-foreground">
            <Logo />
        </div>
        <div class="ml-1 grid flex-1 text-start leading-tight group-has-data-[collapsible=icon]/sidebar-wrapper:hidden">
            <span class="truncate font-semibold">CarbPlan</span>
        </div>
    </Sidebar.Header>
    <Sidebar.Content>
        <SidebarNav />
    </Sidebar.Content>
    <Sidebar.Footer>
        {#if athlete}
            <SidebarUser {athlete} {onLogOut} />
        {/if}
    </Sidebar.Footer>
    <Sidebar.Rail />
</Sidebar.Root>
