<script lang="ts">
    import type { HTMLAttributes } from 'svelte/elements'

    import type { WithElementRef } from '../../../utils.js'

    import { cn } from '../../../utils.js'

    let {
        children,
        class: className,
        ref = $bindable(null),
        ...restProps
    }: WithElementRef<HTMLAttributes<HTMLParagraphElement>> = $props()
</script>

<p
    class={cn('text-sm text-muted-foreground', className)}
    bind:this={ref}
    data-slot="card-description"
    {...restProps}
>
    {@render children?.()}
</p>
