<script lang="ts">
    import type { ComponentProps } from 'svelte'

    import { Logo } from '@carbplan/ui/logo'
    import { SidebarContent, SidebarFooter, SidebarHeader, SidebarRail, SidebarRoot } from '@carbplan/ui/sidebar'

    import SidebarNav from './sidebar-nav.svelte'
    import SidebarUser from './sidebar-user.svelte'

    type Props = {
        onLogOut: () => void
    } & ComponentProps<typeof SidebarRoot>
    const { onLogOut, ...restProps }: Props = $props()
</script>

<SidebarRoot collapsible="icon" variant="inset" {...restProps}>
    <SidebarHeader class="mt-2 flex h-12 flex-row items-center justify-start gap-0 px-4 transition-[width,height]">
        <div class="flex size-4 items-center justify-center rounded-lg text-foreground">
            <Logo />
        </div>
        <div class="grid flex-1 pl-1 text-start text-sm/tight group-has-data-[collapsible=icon]/sidebar-wrapper:hidden">
            <span class="truncate font-medium">CarbPlan</span>
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
