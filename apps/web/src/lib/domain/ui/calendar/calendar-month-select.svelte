<script lang="ts">
    import type { WithoutChildrenOrChild } from '$lib/utils.js'

    import ChevronDownIcon from '@lucide/svelte/icons/chevron-down'
    import { Calendar as CalendarPrimitive } from 'bits-ui'

    import { cn } from '$lib/utils.js'

    let {
        class: className,
        onchange,
        ref = $bindable(null),
        value,
        ...restProps
    }: WithoutChildrenOrChild<CalendarPrimitive.MonthSelectProps> = $props()
</script>

<span
    class={cn(
        'has-focus:border-ring border-input has-focus:ring-ring/50 relative flex rounded-md border shadow-xs has-focus:ring-[3px]',
        className
    )}
>
    <CalendarPrimitive.MonthSelect
        class="absolute inset-0 opacity-0 dark:bg-popover dark:text-popover-foreground"
        bind:ref
        {...restProps}
    >
        {#snippet child({ monthItems, props, selectedMonthItem })}
            <select {...props} {value} {onchange}>
                {#each monthItems as monthItem (monthItem.value)}
                    <option
                        value={monthItem.value}
                        selected={value !== undefined
                            ? monthItem.value === value
                            : monthItem.value === selectedMonthItem.value}
                    >
                        {monthItem.label}
                    </option>
                {/each}
            </select>
            <span
                class="flex h-8 items-center gap-1 rounded-md ps-2 pe-1 text-sm font-medium select-none [&>svg]:size-3.5 [&>svg]:text-muted-foreground"
                aria-hidden="true"
            >
                {monthItems.find((item) => item.value === value)?.label || selectedMonthItem.label}
                <ChevronDownIcon class="size-4" />
            </span>
        {/snippet}
    </CalendarPrimitive.MonthSelect>
</span>
