<script lang="ts">
    import type { HTMLAttributes } from 'svelte/elements'

    import type { WithElementRef } from '../../../utils.js'

    import { cn } from '../../../utils.js'

    let {
        children,
        class: className,
        ref = $bindable(null),
        ...restProps
    }: WithElementRef<HTMLAttributes<HTMLDivElement>> = $props()
</script>

<div
    class={cn('leading-none font-semibold', className)}
    bind:this={ref}
    data-slot="card-title"
    {...restProps}
>
    {@render children?.()}
</div>
