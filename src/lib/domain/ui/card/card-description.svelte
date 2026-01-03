<script lang="ts">
    import type { HTMLAttributes } from 'svelte/elements'

    import type { WithElementRef } from '$lib/utils.js'

    import { cn } from '$lib/utils.js'

    let {
        children,
        class: className,
        ref = $bindable(null),
        ...restProps
    }: WithElementRef<HTMLAttributes<HTMLParagraphElement>> = $props()
</script>

<p
    class={cn('text-muted-foreground text-sm', className)}
    bind:this={ref}
    data-slot="card-description"
    {...restProps}
>
    {@render children?.()}
</p>
