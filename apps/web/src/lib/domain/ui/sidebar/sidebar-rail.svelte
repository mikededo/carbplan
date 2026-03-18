<script lang="ts">
    import type { HTMLAttributes } from 'svelte/elements'

    import type { WithElementRef } from '$lib/utils.js'

    import { cn } from '$lib/utils.js'

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
        'hover:after:bg-sidebar-border absolute inset-y-0 z-20 hidden w-4 -translate-x-1/2 transition-all ease-linear group-data-[side=left]:-end-4 group-data-[side=right]:start-0 after:absolute after:inset-y-0 after:start-[calc(1/2*100%-1px)] after:w-[2px] sm:flex',
        'in-data-[side=left]:cursor-w-resize in-data-[side=right]:cursor-e-resize',
        '[[data-side=left][data-state=collapsed]_&]:cursor-e-resize [[data-side=right][data-state=collapsed]_&]:cursor-w-resize',
        'hover:group-data-[collapsible=offcanvas]:bg-sidebar group-data-[collapsible=offcanvas]:translate-x-0 group-data-[collapsible=offcanvas]:after:start-full',
        '[[data-side=left][data-collapsible=offcanvas]_&]:-end-2',
        '[[data-side=right][data-collapsible=offcanvas]_&]:-start-2',
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
