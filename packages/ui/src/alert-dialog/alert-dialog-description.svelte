<script lang="ts">
    import { AlertDialog as AlertDialogPrimitive } from 'bits-ui'

    import { cn } from '../utils.js'

    let {
        class: className,
        ref = $bindable(null),
        ...restProps
    }: AlertDialogPrimitive.DescriptionProps = $props()
</script>

<AlertDialogPrimitive.Description
    class={cn('text-sm text-muted-foreground', className)}
    bind:ref
    data-slot="alert-dialog-description"
    {...restProps}
/>
