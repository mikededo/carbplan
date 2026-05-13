<script lang="ts">
    import { LayoutDashboardIcon, PillIcon, SettingsIcon } from '@lucide/svelte'

    import { page } from '$app/state'
    import { ROUTES } from '$lib/constants/routes'
    import { getAuthContext } from '$lib/domain/auth/context'
    import SidebarGroupContent from '$lib/domain/ui/sidebar/sidebar-group-content.svelte'
    import SidebarGroupLabel from '$lib/domain/ui/sidebar/sidebar-group-label.svelte'
    import SidebarGroup from '$lib/domain/ui/sidebar/sidebar-group.svelte'
    import SidebarMenuButton from '$lib/domain/ui/sidebar/sidebar-menu-button.svelte'
    import SidebarMenuItem from '$lib/domain/ui/sidebar/sidebar-menu-item.svelte'
    import SidebarMenu from '$lib/domain/ui/sidebar/sidebar-menu.svelte'

    const BASE_ROUTES = [
        { href: ROUTES.dashboard, icon: LayoutDashboardIcon, title: 'Dashboard' },
        { href: ROUTES.settings, icon: SettingsIcon, title: 'Settings' }
    ]

    const userContext = getAuthContext()

    const adminItems = $derived.by(() => {
        if (userContext.isErr()) {
            return []
        }

        const user = userContext.value
        if (!user || !user.isAdmin) {
            return []
        }

        return [
            {
                href: ROUTES.admin.supplements,
                icon: PillIcon,
                title: 'Catalog'
            }
        ]
    })

    const isActive = (href: string) => page.url.pathname === href
</script>

<SidebarGroup>
    <SidebarMenu>
        {#each BASE_ROUTES as item (item.href)}
            <SidebarMenuItem>
                <SidebarMenuButton isActive={isActive(item.href)} tooltipContent={item.title}>
                    {#snippet child({ props })}
                        <a href={item.href} {...props}>
                            <item.icon />
                            <span>{item.title}</span>
                        </a>
                    {/snippet}
                </SidebarMenuButton>
            </SidebarMenuItem>
        {/each}
    </SidebarMenu>
</SidebarGroup>

{#if adminItems.length}
    <SidebarGroup>
        <SidebarGroupLabel>ADMIN</SidebarGroupLabel>
        <SidebarGroupContent>
            {#each adminItems as item (item.href)}
                <SidebarMenuItem>
                    <SidebarMenuButton isActive={isActive(item.href)} tooltipContent={item.title}>
                        {#snippet child({ props })}
                            <a href={item.href} {...props}>
                                <item.icon />
                                <span>{item.title}</span>
                            </a>
                        {/snippet}
                    </SidebarMenuButton>
                </SidebarMenuItem>
            {/each}
        </SidebarGroupContent>
    </SidebarGroup>
{/if}
