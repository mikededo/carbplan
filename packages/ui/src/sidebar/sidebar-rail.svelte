<script lang="ts">
    import type { HTMLAttributes } from 'svelte/elements'

    import type { WithElementRef } from '../utils.js'

    import { cn } from '../utils.js'
    import { useSidebar } from './context.svelte.js'

    let {
        children,
        class: className,
        ref = $bindable(null),
        ...restProps
    }: WithElementRef<HTMLAttributes<HTMLButtonElement>, HTMLButtonElement> = $props()

    const sidebar = useSidebar()
</script>

<button
    class={cn(
        'absolute inset-y-2 z-20 hidden w-0.5 transition-all ease-in-out group-data-[side=left]:inset-e-0 group-data-[side=left]:translate-x-0.5 group-data-[side=right]:inset-s-0 group-data-[side=right]:-translate-x-1/2 after:absolute after:inset-y-0 after:inset-s-[calc(1/2*100%-1px)] after:w-0.5 after:transition-colors hover:after:bg-muted-foreground/70 sm:flex',
        'in-data-[side=left]:cursor-w-resize in-data-[side=right]:cursor-e-resize',
        '[[data-side=left][data-state=collapsed]_&]:cursor-e-resize [[data-side=right][data-state=collapsed]_&]:cursor-w-resize',
        'group-data-[collapsible=offcanvas]:translate-x-0 group-data-[collapsible=offcanvas]:after:inset-s-full hover:group-data-[collapsible=offcanvas]:bg-sidebar',
        '[[data-side=left][data-collapsible=offcanvas]_&]:-inset-e-2',
        '[[data-side=right][data-collapsible=offcanvas]_&]:-inset-s-2',
        className
    )}
    bind:this={ref}
    tabIndex={-1}
    title="Toggle Sidebar"
    onclick={sidebar.toggle}
    aria-label="Toggle Sidebar"
    data-sidebar="rail"
    data-slot="sidebar-rail"
    {...restProps}
>
    {@render children?.()}
</button>
