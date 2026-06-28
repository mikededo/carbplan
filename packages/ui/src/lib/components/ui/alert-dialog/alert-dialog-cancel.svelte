<script lang="ts">
    import { AlertDialog as AlertDialogPrimitive } from 'bits-ui'

    import { cn } from '../../../utils.js'
    import { buttonVariants } from '../button/index.js'

    let {
        class: className,
        ref = $bindable(null),
        ...restProps
    }: AlertDialogPrimitive.CancelProps = $props()
</script>

<AlertDialogPrimitive.Cancel
    class={cn(buttonVariants({ variant: 'ghost' }), className)}
    bind:ref
    data-slot="alert-dialog-cancel"
    {...restProps}
/>
