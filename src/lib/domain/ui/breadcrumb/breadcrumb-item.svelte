<script lang="ts">
    import type { HTMLLiAttributes } from 'svelte/elements'

    import type { WithElementRef } from '$lib/utils.js'

    import { cn } from '$lib/utils.js'

    let {
        children,
        class: className,
        ref = $bindable(null),
        ...restProps
    }: WithElementRef<HTMLLiAttributes> = $props()
</script>

<li
    class={cn('inline-flex items-center gap-1.5', className)}
    bind:this={ref}
    data-slot="breadcrumb-item"
    {...restProps}
>
    {@render children?.()}
</li>
