<script lang="ts">
    import type { Separator as SeparatorPrimitive } from 'bits-ui'

    import { Separator } from '../separator/index.js'
    import { cn } from '../utils.js'

    let {
        class: className,
        ref = $bindable(null),
        ...restProps
    }: SeparatorPrimitive.RootProps = $props()
</script>

<Separator
    class={cn('pointer-events-none -mx-1 my-1 h-px bg-border', className)}
    bind:ref
    data-slot="select-separator"
    {...restProps}
/>
