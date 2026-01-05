<script lang="ts">
    import type { ComponentProps } from 'svelte'

    import { Select as SelectPrimitive } from 'bits-ui'

    import { cn } from '$lib/utils.js'

    let {
        children,
        class: className,
        ref = $bindable(null),
        ...restProps
    }: ComponentProps<typeof SelectPrimitive.GroupHeading> = $props()
</script>

<SelectPrimitive.GroupHeading
    class={cn('text-muted-foreground px-2 py-1.5 text-xs', className)}
    bind:ref
    data-slot="select-group-heading"
    {...restProps}
>
    {@render children?.()}
</SelectPrimitive.GroupHeading>
