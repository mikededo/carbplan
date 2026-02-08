<script lang="ts">
    import { Calendar as CalendarPrimitive } from 'bits-ui'

    import { cn } from '$lib/utils.js'

    let {
        class: className,
        ref = $bindable(null),
        ...restProps
    }: CalendarPrimitive.HeadingProps = $props()
</script>

<CalendarPrimitive.Heading
    class={cn('px-(--cell-size) text-sm font-medium', className)}
    bind:ref
    {...restProps}
/>
