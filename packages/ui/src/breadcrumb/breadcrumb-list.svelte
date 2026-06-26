<script lang="ts">
    import type { HTMLOlAttributes } from 'svelte/elements'

    import type { WithElementRef } from '../utils.js'

    import { cn } from '../utils.js'

    let {
        children,
        class: className,
        ref = $bindable(null),
        ...restProps
    }: WithElementRef<HTMLOlAttributes> = $props()
</script>

<ol
    class={cn(
        'flex flex-wrap items-center gap-1.5 text-sm wrap-break-word text-muted-foreground sm:gap-2.5',
        className
    )}
    bind:this={ref}
    data-slot="breadcrumb-list"
    {...restProps}
>
    {@render children?.()}
</ol>
