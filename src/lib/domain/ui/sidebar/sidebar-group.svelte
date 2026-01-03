<script lang="ts">
    import type { HTMLAttributes } from 'svelte/elements'

    import type { WithElementRef } from '$lib/utils.js'

    import { cn } from '$lib/utils.js'

    let {
        children,
        class: className,
        ref = $bindable(null),
        ...restProps
    }: WithElementRef<HTMLAttributes<HTMLElement>> = $props()
</script>

<div
    class={cn('relative flex w-full min-w-0 flex-col p-2', className)}
    bind:this={ref}
    data-sidebar="group"
    data-slot="sidebar-group"
    {...restProps}
>
    {@render children?.()}
</div>
