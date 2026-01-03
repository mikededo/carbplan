<script lang="ts">
    import LayoutDashboardIcon from '@lucide/svelte/icons/layout-dashboard'
    import SettingsIcon from '@lucide/svelte/icons/settings'

    import { page } from '$app/state'
    import { ROUTES } from '$lib/constants/routes'
    import * as Sidebar from '$lib/domain/ui/sidebar'

    const navItems = [
        { href: ROUTES.dashboard, icon: LayoutDashboardIcon, title: 'Dashboard' },
        { href: ROUTES.settings, icon: SettingsIcon, title: 'Settings' }
    ] as const

    const isActive = (href: string) => page.url.pathname === href
</script>

<Sidebar.Group>
    <Sidebar.Menu>
        {#each navItems as item (item.href)}
            <Sidebar.MenuItem>
                <Sidebar.MenuButton isActive={isActive(item.href)} tooltipContent={item.title}>
                    {#snippet child({ props })}
                        <a href={item.href} {...props}>
                            <item.icon />
                            <span>{item.title}</span>
                        </a>
                    {/snippet}
                </Sidebar.MenuButton>
            </Sidebar.MenuItem>
        {/each}
    </Sidebar.Menu>
</Sidebar.Group>

