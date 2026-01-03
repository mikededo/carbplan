<script lang="ts">
    import type { CurrentAthlete } from '$lib/database/types.g'

    import { MoonIcon } from '@lucide/svelte'
    import ChevronsUpDownIcon from '@lucide/svelte/icons/chevrons-up-down'
    import LogOutIcon from '@lucide/svelte/icons/log-out'
    import SettingsIcon from '@lucide/svelte/icons/settings'

    import { ROUTES } from '$lib/constants/routes'
    import * as Avatar from '$lib/domain/ui/avatar'
    import { Button } from '$lib/domain/ui/button'
    import * as DropdownMenu from '$lib/domain/ui/dropdown-menu'
    import * as Sidebar from '$lib/domain/ui/sidebar'
    import { useSidebar } from '$lib/domain/ui/sidebar'

    type Props = { athlete: CurrentAthlete }
    const { athlete }: Props = $props()

    const sidebar = useSidebar()
    const initials = $derived(
        athlete.full_name
            ?.split(' ')
            .map((n) => n[0])
            .join('')
            .slice(0, 2)
            .toUpperCase() ?? '?'
    )
</script>

<Sidebar.Menu>
    <Sidebar.MenuItem>
        <DropdownMenu.Root>
            <DropdownMenu.Trigger>
                {#snippet child({ props })}
                    <Sidebar.MenuButton
                        {...props}
                        class="hover:bg-background data-[state=open]:bg-background data-[state=open]:text-sidebar-accent-foreground"
                        size="lg"
                    >
                        <Avatar.Root class="size-8 rounded-lg">
                            {#if athlete.avatar_url}
                                <Avatar.Image alt={athlete.full_name ?? 'Avatar'} src={athlete.avatar_url} />
                            {/if}
                            <Avatar.Fallback class="rounded-lg">{initials}</Avatar.Fallback>
                        </Avatar.Root>
                        <div class="grid flex-1 text-start text-sm leading-tight">
                            <span class="truncate font-medium">{athlete.full_name ?? 'User'}</span>
                        </div>
                        <ChevronsUpDownIcon class="ms-auto size-4" />
                    </Sidebar.MenuButton>
                {/snippet}
            </DropdownMenu.Trigger>
            <DropdownMenu.Content
                class="w-(--bits-dropdown-menu-anchor-width) min-w-56 rounded-lg"
                align="end"
                side={sidebar.isMobile ? 'bottom' : 'top'}
                sideOffset={4}
            >
                <DropdownMenu.Group>
                    <DropdownMenu.Item>
                        <!-- TODO: -->
                        <MoonIcon />
                        Toggle theme
                    </DropdownMenu.Item>
                </DropdownMenu.Group>
                <DropdownMenu.Group>
                    <DropdownMenu.Item>
                        {#snippet child({ props })}
                            <a href={ROUTES.settings} {...props}>
                                <SettingsIcon />
                                Settings
                            </a>
                        {/snippet}
                    </DropdownMenu.Item>
                </DropdownMenu.Group>
                <DropdownMenu.Separator />
                <DropdownMenu.Item>
                    {#snippet child({ props })}
                        <Button
                            {...props}
                            class="flex w-full items-center justify-start gap-2"
                            size="sm"
                            variant="destructive-ghost"
                        >
                            <LogOutIcon />
                            Log out
                        </Button>
                    {/snippet}
                </DropdownMenu.Item>
            </DropdownMenu.Content>
        </DropdownMenu.Root>
    </Sidebar.MenuItem>
</Sidebar.Menu>

