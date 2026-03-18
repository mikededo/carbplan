<script lang="ts">
    import { Calendar as CalendarPrimitive } from 'bits-ui'

    import { cn } from '$lib/utils.js'

    let {
        class: className,
        ref = $bindable(null),
        ...restProps
    }: CalendarPrimitive.GridBodyProps = $props()
</script>

<CalendarPrimitive.GridBody class={cn(className)} bind:ref {...restProps} />
