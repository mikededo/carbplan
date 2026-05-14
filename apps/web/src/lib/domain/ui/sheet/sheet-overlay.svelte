<script lang="ts">
    import { Dialog as SheetPrimitive } from 'bits-ui'

    import { cn } from '$lib/utils.js'

    let {
        class: className,
        ref = $bindable(null),
        ...restProps
    }: SheetPrimitive.OverlayProps = $props()
</script>

<SheetPrimitive.Overlay
    class={cn(
        'fixed inset-0 z-50 bg-black/50 duration-200 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0',
        className
    )}
    bind:ref
    data-slot="sheet-overlay"
    {...restProps}
/>
