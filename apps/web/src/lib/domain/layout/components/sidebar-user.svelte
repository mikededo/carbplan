<script lang="ts">
    import ChevronsUpDownIcon from '@lucide/svelte/icons/chevrons-up-down'
    import LogOutIcon from '@lucide/svelte/icons/log-out'
    import SettingsIcon from '@lucide/svelte/icons/settings'

    import { resolve } from '$app/paths'
    import { ROUTES } from '$lib/constants/routes'
    import { useAthleteQuery } from '$lib/domain/settings/queries/use-athlete.svelte'
    import ThemeToggle from '$lib/domain/theme/components/theme-toggle.svelte'
    import AvatarFallback from '$lib/domain/ui/avatar/avatar-fallback.svelte'
    import AvatarImage from '$lib/domain/ui/avatar/avatar-image.svelte'
    import AvatarRoot from '$lib/domain/ui/avatar/avatar.svelte'
    import Button from '$lib/domain/ui/button/button.svelte'
    import DropdownMenuContent from '$lib/domain/ui/dropdown-menu/dropdown-menu-content.svelte'
    import DropdownMenuGroup from '$lib/domain/ui/dropdown-menu/dropdown-menu-group.svelte'
    import DropdownMenuItem from '$lib/domain/ui/dropdown-menu/dropdown-menu-item.svelte'
    import DropdownMenuSeparator from '$lib/domain/ui/dropdown-menu/dropdown-menu-separator.svelte'
    import DropdownMenuTrigger from '$lib/domain/ui/dropdown-menu/dropdown-menu-trigger.svelte'
    import DropdownMenuRoot from '$lib/domain/ui/dropdown-menu/dropdown-menu.svelte'
    import { useSidebar } from '$lib/domain/ui/sidebar/context.svelte.js'
    import SidebarMenuButton from '$lib/domain/ui/sidebar/sidebar-menu-button.svelte'
    import SidebarMenuItem from '$lib/domain/ui/sidebar/sidebar-menu-item.svelte'
    import SidebarMenu from '$lib/domain/ui/sidebar/sidebar-menu.svelte'

    type Props = {
        onLogOut: () => void
    }
    const { onLogOut }: Props = $props()

    const athleteQuery = useAthleteQuery()
    const athlete = $derived(athleteQuery?.data)

    const sidebar = useSidebar()
    const initials = $derived(
        athlete?.fullName
            ?.split(' ')
            .map((name) => name[0])
            .join('')
            .slice(0, 2)
            .toUpperCase() ?? '?'
    )
</script>

<SidebarMenu>
    <SidebarMenuItem>
        <DropdownMenuRoot>
            <DropdownMenuTrigger>
                {#snippet child({ props })}
                    <SidebarMenuButton
                        {...props}
                        class="hover:bg-background data-[state=open]:bg-background data-[state=open]:text-sidebar-accent-foreground"
                        size="lg"
                    >
                        <AvatarRoot class="size-8 rounded-lg">
                            <AvatarImage alt={athlete?.fullName ?? 'Avatar'} src={athlete?.avatarUrl} />
                            <AvatarFallback class="rounded-lg">{initials}</AvatarFallback>
                        </AvatarRoot>
                        <div class="grid flex-1 text-start text-sm/tight">
                            <span class="truncate font-medium">{athlete?.fullName ?? 'User'}</span>
                        </div>
                        <ChevronsUpDownIcon class="ms-auto size-4" />
                    </SidebarMenuButton>
                {/snippet}
            </DropdownMenuTrigger>
            <DropdownMenuContent
                class="w-(--bits-dropdown-menu-anchor-width) min-w-56"
                align="end"
                side={sidebar.isMobile ? 'bottom' : 'top'}
                sideOffset={4}
            >
                <DropdownMenuGroup>
                    <ThemeToggle />
                </DropdownMenuGroup>
                <DropdownMenuGroup>
                    <DropdownMenuItem>
                        {#snippet child({ props })}
                            <a href={resolve(ROUTES.settings)} {...props}>
                                <SettingsIcon />
                                Settings
                            </a>
                        {/snippet}
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                    {#snippet child({ props })}
                        <Button
                            {...props}
                            class="flex w-full items-center justify-start gap-2"
                            size="sm"
                            variant="destructive-ghost"
                            onclick={onLogOut}
                        >
                            <LogOutIcon />
                            Log out
                        </Button>
                    {/snippet}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenuRoot>
    </SidebarMenuItem>
</SidebarMenu>
