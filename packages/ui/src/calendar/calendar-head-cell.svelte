<script lang="ts">
    import { Calendar as CalendarPrimitive } from 'bits-ui'

    import { cn } from '../utils.js'

    let {
        class: className,
        ref = $bindable(null),
        ...restProps
    }: CalendarPrimitive.HeadCellProps = $props()
</script>

<CalendarPrimitive.HeadCell
    class={cn(
        'w-(--cell-size) rounded-md text-[0.8rem] font-normal text-muted-foreground',
        className
    )}
    bind:ref
    {...restProps}
/>
