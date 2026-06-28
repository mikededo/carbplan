<script lang="ts">
    import type { HTMLAttributes } from 'svelte/elements'

    import type { WithElementRef } from '../../../utils.js'

    import { cn } from '../../../utils.js'

    let {
        children,
        class: className,
        ref = $bindable(null),
        ...restProps
    }: WithElementRef<HTMLAttributes<HTMLSpanElement>> = $props()
</script>

<span
    class={cn('ms-auto text-xs tracking-widest text-muted-foreground', className)}
    bind:this={ref}
    data-slot="dropdown-menu-shortcut"
    {...restProps}
>
    {@render children?.()}
</span>
