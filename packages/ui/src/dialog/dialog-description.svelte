<script lang="ts">
    import { Dialog as DialogPrimitive } from 'bits-ui'

    import { cn } from '../utils.js'

    let {
        class: className,
        ref = $bindable(null),
        ...restProps
    }: DialogPrimitive.DescriptionProps = $props()
</script>

<DialogPrimitive.Description
    class={cn('text-sm text-muted-foreground', className)}
    bind:ref
    data-slot="dialog-description"
    {...restProps}
/>
