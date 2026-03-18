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

<nav
    {...restProps}
    class={cn('absolute inset-x-0 top-0 flex w-full items-center justify-between gap-1', className)}
    bind:this={ref}
>
    {@render children?.()}
</nav>
