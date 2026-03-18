<script lang="ts">
    import type { HTMLOlAttributes } from 'svelte/elements'

    import type { WithElementRef } from '$lib/utils.js'

    import { cn } from '$lib/utils.js'

    let {
        children,
        class: className,
        ref = $bindable(null),
        ...restProps
    }: WithElementRef<HTMLOlAttributes> = $props()
</script>

<ol
    class={cn(
        'text-muted-foreground flex flex-wrap items-center gap-1.5 text-sm break-words sm:gap-2.5',
        className
    )}
    bind:this={ref}
    data-slot="breadcrumb-list"
    {...restProps}
>
    {@render children?.()}
</ol>
