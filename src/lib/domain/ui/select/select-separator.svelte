<script lang="ts">
    import type { Separator as SeparatorPrimitive } from 'bits-ui'

    import { Separator } from '$lib/domain/ui/separator/index.js'
    import { cn } from '$lib/utils.js'

    let {
        class: className,
        ref = $bindable(null),
        ...restProps
    }: SeparatorPrimitive.RootProps = $props()
</script>

<Separator
    class={cn('bg-border pointer-events-none -mx-1 my-1 h-px', className)}
    bind:ref
    data-slot="select-separator"
    {...restProps}
/>
