<script lang="ts">
    import type { DateValue } from '@internationalized/date'
    import type { ComponentProps } from 'svelte'

    import type Calendar from './calendar.svelte'

    import { DateFormatter, getLocalTimeZone } from '@internationalized/date'

    import CalendarMonthSelect from './calendar-month-select.svelte'
    import CalendarYearSelect from './calendar-year-select.svelte'

    let {
        captionLayout,
        locale,
        month,
        monthFormat,
        monthIndex = 0,
        months,
        placeholder = $bindable(),
        yearFormat,
        years
    }: {
        captionLayout: ComponentProps<typeof Calendar>['captionLayout']
        locale: string
        month: DateValue
        monthFormat: ComponentProps<typeof CalendarMonthSelect>['monthFormat']
        monthIndex: number
        months: ComponentProps<typeof CalendarMonthSelect>['months']
        placeholder: DateValue | undefined
        yearFormat: ComponentProps<typeof CalendarYearSelect>['yearFormat']
        years: ComponentProps<typeof CalendarYearSelect>['years']
    } = $props()

    const formatYear = (date: DateValue) => {
        const dateObj = date.toDate(getLocalTimeZone())
        if (typeof yearFormat === 'function') {
            return yearFormat(dateObj.getFullYear())
        }
        return new DateFormatter(locale, { year: yearFormat }).format(dateObj)
    }

    const formatMonth = (date: DateValue) => {
        const dateObj = date.toDate(getLocalTimeZone())
        if (typeof monthFormat === 'function') {
            return monthFormat(dateObj.getMonth() + 1)
        }
        return new DateFormatter(locale, { month: monthFormat }).format(dateObj)
    }
</script>

{#snippet MonthSelect()}
    <CalendarMonthSelect
        value={month.month}
        {monthFormat}
        {months}
        onchange={(e) => {
            if (!placeholder) {
                return
            }
            const v = Number.parseInt(e.currentTarget.value)
            const newPlaceholder = placeholder.set({ month: v })
            placeholder = newPlaceholder.subtract({ months: monthIndex })
        }}
    />
{/snippet}

{#snippet YearSelect()}
    <CalendarYearSelect value={month.year} {yearFormat} {years} />
{/snippet}

{#if captionLayout === 'dropdown'}
    {@render MonthSelect()}
    {@render YearSelect()}
{:else if captionLayout === 'dropdown-months'}
    {@render MonthSelect()}
    {#if placeholder}
        {formatYear(placeholder)}
    {/if}
{:else if captionLayout === 'dropdown-years'}
    {#if placeholder}
        {formatMonth(placeholder)}
    {/if}
    {@render YearSelect()}
{:else}
    {formatMonth(month)} {formatYear(month)}
{/if}
