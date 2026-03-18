<script lang="ts">
    import { Calendar as CalendarPrimitive } from 'bits-ui'

    import { cn } from '$lib/utils.js'

    let {
        class: className,
        ref = $bindable(null),
        ...restProps
    }: CalendarPrimitive.GridProps = $props()
</script>

<CalendarPrimitive.Grid
    class={cn('mt-4 flex w-full border-collapse flex-col gap-1', className)}
    bind:ref
    {...restProps}
/>
