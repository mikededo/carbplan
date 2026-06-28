<script lang="ts">
    import { AlertDialog as AlertDialogPrimitive } from 'bits-ui'

    import { cn } from '../../../utils.js'
    import { buttonVariants } from '../button/index.js'

    let {
        class: className,
        ref = $bindable(null),
        ...restProps
    }: AlertDialogPrimitive.ActionProps = $props()
</script>

<AlertDialogPrimitive.Action
    class={cn(buttonVariants(), className)}
    bind:ref
    data-slot="alert-dialog-action"
    {...restProps}
/>
