<script lang="ts">
    import type { HTMLAttributes } from 'svelte/elements'

    import type { WithElementRef, WithoutChildren } from '../utils.js'

    import { cn } from '../utils.js'

    let {
        class: className,
        ref = $bindable(null),
        ...restProps
    }: WithoutChildren<WithElementRef<HTMLAttributes<HTMLDivElement>>> = $props()
</script>

<div
    class={cn('animate-pulse rounded-md bg-accent', className)}
    bind:this={ref}
    data-slot="skeleton"
    {...restProps}
></div>
