<script lang="ts">
    import { Dialog as SheetPrimitive } from 'bits-ui'

    import { cn } from '../utils.js'

    let {
        class: className,
        ref = $bindable(null),
        ...restProps
    }: SheetPrimitive.DescriptionProps = $props()
</script>

<SheetPrimitive.Description
    class={cn('text-sm text-muted-foreground', className)}
    bind:ref
    data-slot="sheet-description"
    {...restProps}
/>
