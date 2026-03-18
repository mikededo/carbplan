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

<kbd
    class={cn('inline-flex items-center gap-1', className)}
    bind:this={ref}
    data-slot="kbd-group"
    {...restProps}
>
    {@render children?.()}
</kbd>
