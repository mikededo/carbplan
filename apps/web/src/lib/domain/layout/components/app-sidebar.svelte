<script lang="ts">
    import type { ComponentProps } from 'svelte'

    import Logo from '$lib/domain/ui/logo/logo.svelte'
    import SidebarContent from '$lib/domain/ui/sidebar/sidebar-content.svelte'
    import SidebarFooter from '$lib/domain/ui/sidebar/sidebar-footer.svelte'
    import SidebarHeader from '$lib/domain/ui/sidebar/sidebar-header.svelte'
    import SidebarRail from '$lib/domain/ui/sidebar/sidebar-rail.svelte'
    import SidebarRoot from '$lib/domain/ui/sidebar/sidebar.svelte'

    import SidebarNav from './sidebar-nav.svelte'
    import SidebarUser from './sidebar-user.svelte'

    type Props = {
        onLogOut: () => void
    } & ComponentProps<typeof SidebarRoot>
    const { onLogOut, ...restProps }: Props = $props()
</script>

<SidebarRoot collapsible="icon" {...restProps}>
    <SidebarHeader
        class="flex h-16 flex-row items-center justify-start gap-0 border-b transition-[width,height] group-has-data-[collapsible=icon]/sidebar-wrapper:h-12"
    >
        <div class="flex size-8 items-center justify-center rounded-lg text-foreground">
            <Logo />
        </div>
        <div class="ml-1 grid flex-1 text-start leading-tight group-has-data-[collapsible=icon]/sidebar-wrapper:hidden">
            <span class="truncate font-semibold">CarbPlan</span>
        </div>
    </SidebarHeader>
    <SidebarContent class="gap-0">
        <SidebarNav />
    </SidebarContent>
    <SidebarFooter>
        <SidebarUser {onLogOut} />
    </SidebarFooter>
    <SidebarRail />
</SidebarRoot>
