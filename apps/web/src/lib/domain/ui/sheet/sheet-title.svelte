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
    class={cn('text-foreground font-semibold', className)}
    bind:ref
    data-slot="sheet-title"
    {...restProps}
/>
