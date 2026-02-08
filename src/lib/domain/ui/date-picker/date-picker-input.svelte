<script lang="ts">
    import type { CalendarDate } from '@internationalized/date'

    import { getLocalTimeZone, today } from '@internationalized/date'
    import ChevronDownIcon from '@lucide/svelte/icons/chevron-down'
    import { cn } from 'tailwind-variants'

    import { Button } from '$lib/domain/ui/button'
    import { Calendar } from '$lib/domain/ui/calendar'
    import { Label } from '$lib/domain/ui/label'
    import * as Popover from '$lib/domain/ui/popover'

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

    <Popover.Root bind:open>
        <Popover.Trigger id="{id}-date">
            {#snippet child({ props })}
                <Button {...props} class="w-48 justify-between font-normal" variant="outline">
                    {value ? value.toDate(getLocalTimeZone()).toLocaleDateString() : 'Select date'}
                    <ChevronDownIcon />
                </Button>
            {/snippet}
        </Popover.Trigger>
        <Popover.Content class="w-auto overflow-hidden p-0" align="start">
            <Calendar
                bind:value
                captionLayout="dropdown"
                maxValue={today(getLocalTimeZone())}
                type="single"
                onValueChange={() => {
                    open = false
                }}
            />
        </Popover.Content>
    </Popover.Root>
</div>
