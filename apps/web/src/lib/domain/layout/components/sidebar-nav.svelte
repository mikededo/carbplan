<script lang="ts">
    import { LayoutDashboardIcon, PillIcon, SettingsIcon } from '@lucide/svelte'

    import { page } from '$app/state'
    import { ROUTES } from '$lib/constants/routes'
    import { getAuthContext } from '$lib/domain/auth/context'
    import * as Sidebar from '$lib/domain/ui/sidebar'

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

<Sidebar.Group>
    <Sidebar.Menu>
        {#each BASE_ROUTES as item (item.href)}
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

{#if adminItems.length}
    <Sidebar.Group>
        <Sidebar.GroupLabel>ADMIN</Sidebar.GroupLabel>
        <Sidebar.GroupContent>
            {#each adminItems as item (item.href)}
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
        </Sidebar.GroupContent>
    </Sidebar.Group>
{/if}
