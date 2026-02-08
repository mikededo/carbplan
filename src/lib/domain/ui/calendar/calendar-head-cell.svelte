<script lang="ts">
    import { Calendar as CalendarPrimitive } from 'bits-ui'

    import { cn } from '$lib/utils.js'

    let {
        class: className,
        ref = $bindable(null),
        ...restProps
    }: CalendarPrimitive.HeadCellProps = $props()
</script>

<CalendarPrimitive.HeadCell
    class={cn(
        'text-muted-foreground w-(--cell-size) rounded-md text-[0.8rem] font-normal',
        className
    )}
    bind:ref
    {...restProps}
/>
