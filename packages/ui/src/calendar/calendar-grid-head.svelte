<script lang="ts">
    import { Calendar as CalendarPrimitive } from 'bits-ui'

    import { cn } from '../utils.js'

    let {
        class: className,
        ref = $bindable(null),
        ...restProps
    }: CalendarPrimitive.GridHeadProps = $props()
</script>

<CalendarPrimitive.GridHead class={cn(className)} bind:ref {...restProps} />
