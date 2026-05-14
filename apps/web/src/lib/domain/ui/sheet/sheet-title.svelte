<script lang="ts">
    import { Dialog as SheetPrimitive } from 'bits-ui'

    import { cn } from '$lib/utils.js'

    let {
        class: className,
        ref = $bindable(null),
        ...restProps
    }: SheetPrimitive.TitleProps = $props()
</script>

<SheetPrimitive.Title
    class={cn('font-semibold text-foreground', className)}
    bind:ref
    data-slot="sheet-title"
    {...restProps}
/>
