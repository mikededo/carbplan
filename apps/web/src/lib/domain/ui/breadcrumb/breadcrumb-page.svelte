<script lang="ts">
    import type { HTMLAttributes } from 'svelte/elements'

    import type { WithElementRef } from '$lib/utils.js'

    import { cn } from '$lib/utils.js'

    let {
        children,
        class: className,
        ref = $bindable(null),
        ...restProps
    }: WithElementRef<HTMLAttributes<HTMLSpanElement>> = $props()
</script>

<span
    class={cn('text-foreground font-normal', className)}
    bind:this={ref}
    role="link"
    aria-current="page"
    aria-disabled="true"
    data-slot="breadcrumb-page"
    {...restProps}
>
    {@render children?.()}
</span>
