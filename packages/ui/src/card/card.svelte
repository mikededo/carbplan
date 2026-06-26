<script lang="ts">
    import type { HTMLAttributes } from 'svelte/elements'

    import type { WithElementRef } from '../utils.js'

    import { cn } from '../utils.js'

    let {
        children,
        class: className,
        ref = $bindable(null),
        ...restProps
    }: WithElementRef<HTMLAttributes<HTMLDivElement>> = $props()
</script>

<div
    class={cn(
        'flex flex-col gap-6 rounded-lg border bg-card py-6 text-card-foreground',
        className
    )}
    bind:this={ref}
    data-slot="card"
    {...restProps}
>
    {@render children?.()}
</div>
