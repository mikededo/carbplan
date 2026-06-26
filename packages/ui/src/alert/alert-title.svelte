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

<p
    class={cn('col-start-2 line-clamp-1 min-h-4 font-medium', className)}
    bind:this={ref}
    data-slot="alert-title"
    {...restProps}
>
    {@render children?.()}
</p>
