<script lang="ts">
    import type { HRZoneModel, HRZonesData } from '../schemas'

    import { ExternalLinkIcon, HeartIcon, InfoIcon } from '@lucide/svelte'

    import * as Select from '$lib/domain/ui/select'
    import * as Tooltip from '$lib/domain/ui/tooltip'
    import { ZoneBar, ZoneListItem, ZonePlaceholder } from '$lib/domain/zones/zone/components'

    import { HR_MODEL_INFO, HR_MODEL_LABELS, HR_ZONE_PRESETS } from '../presets'
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

    const currentModelInfo = $derived(HR_MODEL_INFO[model])
    const currentPreset = $derived(HR_ZONE_PRESETS[model])

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

        <div class="flex items-center gap-2">
            <Tooltip.Root open>
                <Tooltip.Trigger class="text-muted-foreground hover:text-foreground">
                    <InfoIcon class="size-4" />
                </Tooltip.Trigger>
                <Tooltip.Content class="max-w-xs">
                    <p class="mb-2">{currentModelInfo.description}</p>
                    {#if currentModelInfo.referenceUrl}
                        <a
                            class="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                            href={currentModelInfo.referenceUrl}
                            rel="noopener noreferrer"
                            target="_blank"
                        >
                            Learn more <ExternalLinkIcon class="size-3" />
                        </a>
                    {/if}
                </Tooltip.Content>
            </Tooltip.Root>
            <Select.Root type="single" value={model} onValueChange={onHRZonesChange}>
                <Select.Trigger class="w-48">
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
    </div>

    {#if zones}
        <ZoneBar zones={zones.zones} />

        <div class="divide-y divide-border">
            {#each zones.zones as zone, i}
                <ZoneListItem
                    color={zone.color}
                    description={currentPreset[i]?.description}
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

