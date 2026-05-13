<script lang="ts">
    import type { DateValue } from '@internationalized/date'
    import type { Snippet } from 'svelte'

    import type { WithoutChildrenOrChild } from '$lib/utils.js'

    import type { ButtonVariant } from '../button/button.svelte'

    import { isEqualMonth } from '@internationalized/date'
    import { Calendar as CalendarPrimitive } from 'bits-ui'

    import { cn } from '$lib/utils.js'

    import CalendarCaption from './calendar-caption.svelte'
    import CalendarCell from './calendar-cell.svelte'
    import CalendarDay from './calendar-day.svelte'
    import CalendarGridBody from './calendar-grid-body.svelte'
    import CalendarGridHead from './calendar-grid-head.svelte'
    import CalendarGridRow from './calendar-grid-row.svelte'
    import CalendarGrid from './calendar-grid.svelte'
    import CalendarHeadCell from './calendar-head-cell.svelte'
    import CalendarHeader from './calendar-header.svelte'
    import CalendarMonth from './calendar-month.svelte'
    import CalendarMonths from './calendar-months.svelte'
    import CalendarNav from './calendar-nav.svelte'
    import CalendarNextButton from './calendar-next-button.svelte'
    import CalendarPrevButton from './calendar-prev-button.svelte'

    let {
        buttonVariant = 'ghost',
        captionLayout = 'label',
        class: className,
        day,
        disableDaysOutsideMonth = false,
        locale = 'en-US',
        monthFormat: monthFormatProp,
        months: monthsProp,
        placeholder = $bindable(),
        ref = $bindable(null),
        value = $bindable(),
        weekdayFormat = 'short',
        yearFormat = 'numeric',
        years,
        ...restProps
    }: {
        buttonVariant?: ButtonVariant
        captionLayout?: 'dropdown-months' | 'dropdown-years' | 'dropdown' | 'label'
        day?: Snippet<[{ day: DateValue, outsideMonth: boolean }]>
        monthFormat?: CalendarPrimitive.MonthSelectProps['monthFormat']
        months?: CalendarPrimitive.MonthSelectProps['months']
        yearFormat?: CalendarPrimitive.YearSelectProps['yearFormat']
        years?: CalendarPrimitive.YearSelectProps['years']
    } & WithoutChildrenOrChild<CalendarPrimitive.RootProps> = $props()

    const monthFormat = $derived.by(() => {
        if (monthFormatProp) {
            return monthFormatProp
        }
        if (captionLayout.startsWith('dropdown')) {
            return 'short'
        }
        return 'long'
    })
</script>

<!--
Discriminated Unions + Destructing (required for bindable) do not
get along, so we shut typescript up by casting `value` to `never`.
-->
<CalendarPrimitive.Root
    class={cn(
        'bg-background group/calendar p-3 [--cell-size:--spacing(8)] in-data-[slot=card-content]:bg-transparent in-data-[slot=popover-content]:bg-transparent',
        className
    )}
    bind:placeholder
    bind:ref
    bind:value={value as never}
    {disableDaysOutsideMonth}
    {locale}
    {monthFormat}
    {weekdayFormat}
    {yearFormat}
    {...restProps}
>
    {#snippet children({ months, weekdays })}
        <CalendarMonths>
            <CalendarNav>
                <CalendarPrevButton variant={buttonVariant} />
                <CalendarNextButton variant={buttonVariant} />
            </CalendarNav>
            {#each months as month, monthIndex (month)}
                <CalendarMonth>
                    <CalendarHeader>
                        <CalendarCaption
                            bind:placeholder
                            month={month.value}
                            months={monthsProp}
                            {captionLayout}
                            {locale}
                            {monthFormat}
                            {monthIndex}
                            {yearFormat}
                            {years}
                        />
                    </CalendarHeader>
                    <CalendarGrid>
                        <CalendarGridHead>
                            <CalendarGridRow class="select-none">
                                {#each weekdays as weekday (weekday)}
                                    <CalendarHeadCell>
                                        {weekday.slice(0, 2)}
                                    </CalendarHeadCell>
                                {/each}
                            </CalendarGridRow>
                        </CalendarGridHead>
                        <CalendarGridBody>
                            {#each month.weeks as weekDates (weekDates)}
                                <CalendarGridRow class="mt-2 w-full">
                                    {#each weekDates as date (date)}
                                        <CalendarCell month={month.value} {date}>
                                            {#if day}
                                                {@render day({
                                                    day: date,
                                                    outsideMonth: !isEqualMonth(date, month.value)
                                                })}
                                            {:else}
                                                <CalendarDay />
                                            {/if}
                                        </CalendarCell>
                                    {/each}
                                </CalendarGridRow>
                            {/each}
                        </CalendarGridBody>
                    </CalendarGrid>
                </CalendarMonth>
            {/each}
        </CalendarMonths>
    {/snippet}
</CalendarPrimitive.Root>
