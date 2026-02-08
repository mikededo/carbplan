<script lang="ts">
    import { Calendar as CalendarPrimitive } from 'bits-ui'

    import { cn } from '$lib/utils.js'

    let {
        class: className,
        ref = $bindable(null),
        ...restProps
    }: CalendarPrimitive.GridRowProps = $props()
</script>

<CalendarPrimitive.GridRow class={cn('flex', className)} bind:ref {...restProps} />
