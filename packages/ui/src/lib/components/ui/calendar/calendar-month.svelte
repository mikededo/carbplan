<script lang="ts">
    import type { HTMLAttributes } from 'svelte/elements'

    import type { WithElementRef } from '../../../utils.js'

    import { cn } from '../../../utils.js'

    let {
        children,
        class: className,
        ref = $bindable(null),
        ...restProps
    }: WithElementRef<HTMLAttributes<HTMLElement>> = $props()
</script>

<div {...restProps} class={cn('flex flex-col', className)} bind:this={ref}>
    {@render children?.()}
</div>
