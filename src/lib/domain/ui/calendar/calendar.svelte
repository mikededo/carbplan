<script lang="ts">
    import type { DateValue } from '@internationalized/date'
    import type { Snippet } from 'svelte'

    import type { WithoutChildrenOrChild } from '$lib/utils.js'

    import type { ButtonVariant } from '../button/button.svelte'

    import { isEqualMonth } from '@internationalized/date'
    import { Calendar as CalendarPrimitive } from 'bits-ui'

    import { cn } from '$lib/utils.js'

    import * as Calendar from './index.js'

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
        'bg-background group/calendar p-3 [--cell-size:--spacing(8)] [[data-slot=card-content]_&]:bg-transparent [[data-slot=popover-content]_&]:bg-transparent',
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
        <Calendar.Months>
            <Calendar.Nav>
                <Calendar.PrevButton variant={buttonVariant} />
                <Calendar.NextButton variant={buttonVariant} />
            </Calendar.Nav>
            {#each months as month, monthIndex (month)}
                <Calendar.Month>
                    <Calendar.Header>
                        <Calendar.Caption
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
                    </Calendar.Header>
                    <Calendar.Grid>
                        <Calendar.GridHead>
                            <Calendar.GridRow class="select-none">
                                {#each weekdays as weekday (weekday)}
                                    <Calendar.HeadCell>
                                        {weekday.slice(0, 2)}
                                    </Calendar.HeadCell>
                                {/each}
                            </Calendar.GridRow>
                        </Calendar.GridHead>
                        <Calendar.GridBody>
                            {#each month.weeks as weekDates (weekDates)}
                                <Calendar.GridRow class="mt-2 w-full">
                                    {#each weekDates as date (date)}
                                        <Calendar.Cell month={month.value} {date}>
                                            {#if day}
                                                {@render day({
                                                    day: date,
                                                    outsideMonth: !isEqualMonth(date, month.value)
                                                })}
                                            {:else}
                                                <Calendar.Day />
                                            {/if}
                                        </Calendar.Cell>
                                    {/each}
                                </Calendar.GridRow>
                            {/each}
                        </Calendar.GridBody>
                    </Calendar.Grid>
                </Calendar.Month>
            {/each}
        </Calendar.Months>
    {/snippet}
</CalendarPrimitive.Root>
