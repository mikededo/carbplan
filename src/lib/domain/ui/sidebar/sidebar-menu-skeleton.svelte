<script lang="ts">
    import type { HTMLAttributes } from 'svelte/elements'

    import type { WithElementRef } from '$lib/utils.js'

    import { Skeleton } from '$lib/domain/ui/skeleton/index.js'
    import { cn } from '$lib/utils.js'

    let {
        children,
        class: className,
        ref = $bindable(null),
        showIcon = false,
        ...restProps
    }: {
        showIcon?: boolean
    } & WithElementRef<HTMLAttributes<HTMLElement>> = $props()

    // Random width between 50% and 90%
    const width = `${Math.floor(Math.random() * 40) + 50}%`
</script>

<div
    class={cn('flex h-8 items-center gap-2 rounded-md px-2', className)}
    bind:this={ref}
    data-sidebar="menu-skeleton"
    data-slot="sidebar-menu-skeleton"
    {...restProps}
>
    {#if showIcon}
        <Skeleton class="size-4 rounded-md" data-sidebar="menu-skeleton-icon" />
    {/if}
    <Skeleton
        class="h-4 max-w-(--skeleton-width) flex-1"
        style="--skeleton-width: {width};"
        data-sidebar="menu-skeleton-text"
    />
    {@render children?.()}
</div>
