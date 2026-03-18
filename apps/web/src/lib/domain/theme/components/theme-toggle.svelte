<script lang="ts">
    import CheckIcon from '@lucide/svelte/icons/check'
    import MonitorIcon from '@lucide/svelte/icons/monitor'
    import MoonIcon from '@lucide/svelte/icons/moon'
    import SunIcon from '@lucide/svelte/icons/sun'

    import { useTheme } from '$lib/domain/theme/context.svelte'
    import * as DropdownMenu from '$lib/domain/ui/dropdown-menu'

    const theme = useTheme()

    const OPTIONS = [
        { icon: SunIcon, label: 'Light', value: 'light' },
        { icon: MoonIcon, label: 'Dark', value: 'dark' },
        { icon: MonitorIcon, label: 'System', value: 'system' }
    ] as const
</script>

<DropdownMenu.Sub>
    <DropdownMenu.SubTrigger>
        {#if theme.resolved === 'dark'}
            <MoonIcon />
        {:else}
            <SunIcon />
        {/if}
        Theme
    </DropdownMenu.SubTrigger>
    <DropdownMenu.SubContent sideOffset={8}>
        {#each OPTIONS as option (option.value)}
            <DropdownMenu.Item onclick={() => theme.set(option.value)}>
                <option.icon />
                {option.label}
                {#if theme.preference === option.value}
                    <CheckIcon class="ml-auto" />
                {/if}
            </DropdownMenu.Item>
        {/each}
    </DropdownMenu.SubContent>
</DropdownMenu.Sub>

