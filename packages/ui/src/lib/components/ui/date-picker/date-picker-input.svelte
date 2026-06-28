<script lang="ts">
    import type { CalendarDate } from '@internationalized/date'

    import { getLocalTimeZone, today } from '@internationalized/date'
    import ChevronDownIcon from '@lucide/svelte/icons/chevron-down'
    import { cn } from 'tailwind-variants'

    import { Button } from '../button/index.js'
    import { Calendar } from '../calendar/index.js'
    import { Label } from '../label/index.js'
    import { PopoverContent, PopoverRoot, PopoverTrigger } from '../popover/index.js'

    type Props = {
        label: string
        class?: string
        value?: CalendarDate
    }
    let { label, value = $bindable(), ...rest }: Props = $props()
    const id = $props.id()

    let open = $state(false)
</script>

<div class={cn('flex flex-col gap-2', rest.class)}>
    <Label class="px-1" for="{id}-date">{label}</Label>

    <PopoverRoot bind:open>
        <PopoverTrigger id="{id}-date">
            {#snippet child({ props })}
                <Button {...props} class="w-48 justify-between font-normal" variant="outline">
                    {value ? value.toDate(getLocalTimeZone()).toLocaleDateString() : 'Select date'}
                    <ChevronDownIcon />
                </Button>
            {/snippet}
        </PopoverTrigger>
        <PopoverContent class="w-auto overflow-hidden p-0" align="start">
            <Calendar
                bind:value
                captionLayout="dropdown"
                maxValue={today(getLocalTimeZone())}
                type="single"
                onValueChange={() => {
                    open = false
                }}
            />
        </PopoverContent>
    </PopoverRoot>
</div>
