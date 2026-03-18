<script lang="ts">
    import type { WithoutChildrenOrChild } from '$lib/utils.js'

    import ChevronDownIcon from '@lucide/svelte/icons/chevron-down'
    import { Calendar as CalendarPrimitive } from 'bits-ui'

    import { cn } from '$lib/utils.js'

    let {
        class: className,
        ref = $bindable(null),
        value,
        ...restProps
    }: WithoutChildrenOrChild<CalendarPrimitive.YearSelectProps> = $props()
</script>

<span
    class={cn(
        'has-focus:border-ring border-input has-focus:ring-ring/50 relative flex rounded-md border shadow-xs has-focus:ring-[3px]',
        className
    )}
>
    <CalendarPrimitive.YearSelect
        class="absolute inset-0 opacity-0 dark:bg-popover dark:text-popover-foreground"
        bind:ref
        {...restProps}
    >
        {#snippet child({ props, selectedYearItem, yearItems })}
            <select {...props} {value}>
                {#each yearItems as yearItem (yearItem.value)}
                    <option
                        value={yearItem.value}
                        selected={value !== undefined
                            ? yearItem.value === value
                            : yearItem.value === selectedYearItem.value}
                    >
                        {yearItem.label}
                    </option>
                {/each}
            </select>
            <span
                class="flex h-8 items-center gap-1 rounded-md ps-2 pe-1 text-sm font-medium select-none [&>svg]:size-3.5 [&>svg]:text-muted-foreground"
                aria-hidden="true"
            >
                {yearItems.find((item) => item.value === value)?.label || selectedYearItem.label}
                <ChevronDownIcon class="size-4" />
            </span>
        {/snippet}
    </CalendarPrimitive.YearSelect>
</span>
