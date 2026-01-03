<script lang="ts">
    import { RadioGroup as RadioGroupPrimitive } from 'bits-ui'

    import { cn } from '$lib/utils.js'

    let {
        class: className,
        ref = $bindable(null),
        value = $bindable(''),
        ...restProps
    }: RadioGroupPrimitive.RootProps = $props()
</script>

<RadioGroupPrimitive.Root
    class={cn('grid gap-3', className)}
    bind:ref
    bind:value
    data-slot="radio-group"
    {...restProps}
/>
