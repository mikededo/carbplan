<script lang="ts">
    import type { HRZoneModel, HRZonesData } from '../schemas'

    import { HeartIcon } from '@lucide/svelte'

    import * as Select from '$lib/domain/ui/select'
    import { ZoneBar, ZoneListItem, ZonePlaceholder } from '$lib/domain/zones/zone/components'

    import { HR_MODEL_LABELS } from '../presets'
    import { isHRPresetZoneModel } from '../schemas'
    import { calculateHRZones, formatHRRange } from '../utils'

    type Props = {
        hrMax: number | undefined
        hrRest: number | undefined
        model?: Exclude<HRZoneModel, 'custom'>
        onHRZonesChange?: (data: HRZonesData) => void
    }
    const {
        hrMax,
        hrRest,
        model = '5-zone',
        ...props
    }: Props = $props()

    const modelOptions = Object.entries(HR_MODEL_LABELS)
        .filter(([key]) => key !== 'custom')
        .map(([value, label]) => ({ label, value }))

    const zones: HRZonesData | null = $derived.by(() => {
        if (!hrMax) {
            return null
        }

        return calculateHRZones({ hrMax, hrRest, model })
    })

    const onHRZonesChange = (model: string | undefined) => {
        if (!hrMax) {
            return
        }

        const isModel = isHRPresetZoneModel(model)
        if (!isModel) {
            return
        }

        if (model !== 'custom') {
            props.onHRZonesChange?.(calculateHRZones({ hrMax, hrRest, model }))
        }
    }
</script>

<div class="space-y-2">
    <div class="flex flex-col justify-between sm:flex-row sm:items-end">
        <div class="flex min-h-10 flex-col">
            <p class="text-sm font-medium">Heart Rate Zones</p>
            <p class="text-sm text-muted-foreground">Define the heart rate zones that will be used to plan your nutrition</p>
        </div>

        <Select.Root type="single" value={model} onValueChange={onHRZonesChange}>
            <Select.Trigger class="ml-auto w-48">
                {HR_MODEL_LABELS[model]}
            </Select.Trigger>
            <Select.Portal>
                <Select.Content>
                    {#each modelOptions as option}
                        <Select.Item value={option.value}>
                            {option.label}
                        </Select.Item>
                    {/each}
                </Select.Content>
            </Select.Portal>
        </Select.Root>
    </div>

    {#if zones}
        <ZoneBar zones={zones.zones} />

        <div class="divide-y divide-border">
            {#each zones.zones as zone, i}
                <ZoneListItem
                    color={zone.color}
                    index={i}
                    maxPercent={zone.maxPercent}
                    minPercent={zone.minPercent}
                    name={zone.name}
                    range={formatHRRange(zone)}
                />
            {/each}
        </div>

        {#if model === 'karvonen' && hrRest}
            <p class="text-xs text-muted-foreground">
                Using Karvonen formula with HR reserve of {hrMax! - hrRest} bpm
            </p>
        {:else if model === 'karvonen' && !hrRest}
            <p class="text-xs text-amber-600">
                Add resting HR for accurate Karvonen zones
            </p>
        {/if}
    {:else}
        <ZonePlaceholder
            description="Enter your maximum heart rate to see zones"
            Icon={HeartIcon}
        />
    {/if}
</div>

