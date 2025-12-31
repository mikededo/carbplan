<script lang="ts">
    import type { HTMLAttributes } from 'svelte/elements'

    import type { WithElementRef } from '$lib/utils.js'

    import { cn } from '$lib/utils.js'

    let {
        children,
        class: className,
        ref = $bindable(null),
        ...restProps
    }: WithElementRef<HTMLAttributes<HTMLDivElement>> = $props()
</script>

<div
    class={cn('col-start-2 row-span-2 row-start-1 self-start justify-self-end', className)}
    bind:this={ref}
    data-slot="card-action"
    {...restProps}
>
    {@render children?.()}
</div>
