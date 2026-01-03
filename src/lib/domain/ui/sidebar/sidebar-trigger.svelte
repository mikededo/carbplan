<script lang="ts">
    import type { ComponentProps } from 'svelte'

    import PanelLeftIcon from '@lucide/svelte/icons/panel-left'

    import { Button } from '$lib/domain/ui/button/index.js'
    import { cn } from '$lib/utils.js'

    import { useSidebar } from './context.svelte.js'

    let {
        class: className,
        onclick,
        ref = $bindable(null),
        ...restProps
    }: {
        onclick?: (e: MouseEvent) => void
    } & ComponentProps<typeof Button> = $props()

    const sidebar = useSidebar()

    const onSidebarToggle = (e: MouseEvent) => {
        onclick?.(e)
        sidebar.toggle()
    }
</script>

<Button
    class={cn('size-7', className)}
    size="icon"
    type="button"
    variant="ghost"
    onclick={onSidebarToggle}
    data-sidebar="trigger"
    data-slot="sidebar-trigger"
    {...restProps}
>
    <PanelLeftIcon />
    <span class="sr-only">Toggle Sidebar</span>
</Button>
