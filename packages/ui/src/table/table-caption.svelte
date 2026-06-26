<script lang="ts">
    import type { HTMLAttributes } from 'svelte/elements'

    import type { WithElementRef } from '../utils.js'

    import { cn } from '../utils.js'

    let {
        children,
        class: className,
        ref = $bindable(null),
        ...restProps
    }: WithElementRef<HTMLAttributes<HTMLElement>> = $props()
</script>

<caption
    class={cn('mt-4 text-sm text-muted-foreground', className)}
    bind:this={ref}
    data-slot="table-caption"
    {...restProps}
>
    {@render children?.()}
</caption>
