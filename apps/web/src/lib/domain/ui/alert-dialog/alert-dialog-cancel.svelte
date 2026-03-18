<script lang="ts">
    import { AlertDialog as AlertDialogPrimitive } from 'bits-ui'

    import { buttonVariants } from '$lib/domain/ui/button/index.js'
    import { cn } from '$lib/utils.js'

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
