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
    class={cn('flex items-center px-6 [.border-t]:pt-6', className)}
    bind:this={ref}
    data-slot="card-footer"
    {...restProps}
>
    {@render children?.()}
</div>
