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

<caption
    class={cn('text-muted-foreground mt-4 text-sm', className)}
    bind:this={ref}
    data-slot="table-caption"
    {...restProps}
>
    {@render children?.()}
</caption>
