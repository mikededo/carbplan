<script lang="ts">
    import type { HRZoneModel, HRZonesData } from '@carbplan/domain/hr'

    import { HR_MODEL_INFO, HR_MODEL_LABELS, HR_ZONE_PRESETS } from '@carbplan/domain/hr'
    import { ExternalLinkIcon, HeartIcon, InfoIcon } from '@lucide/svelte'

    import SelectContent from '$lib/domain/ui/select/select-content.svelte'
    import SelectItem from '$lib/domain/ui/select/select-item.svelte'
    import SelectPortal from '$lib/domain/ui/select/select-portal.svelte'
    import SelectTrigger from '$lib/domain/ui/select/select-trigger.svelte'
    import SelectRoot from '$lib/domain/ui/select/select.svelte'
    import TooltipContent from '$lib/domain/ui/tooltip/tooltip-content.svelte'
    import TooltipTrigger from '$lib/domain/ui/tooltip/tooltip-trigger.svelte'
    import TooltipRoot from '$lib/domain/ui/tooltip/tooltip.svelte'
    import ZoneBar from '$lib/domain/zones/zone/components/zone-bar.svelte'
    import ZoneListItem from '$lib/domain/zones/zone/components/zone-list-item.svelte'
    import ZonePlaceholder from '$lib/domain/zones/zone/components/zone-placeholder.svelte'

    import { calculateHRZones, formatHRRange, isHRPresetZoneModel } from '../utils'

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
            <TooltipRoot>
                <TooltipTrigger class="text-muted-foreground hover:text-foreground">
                    <InfoIcon class="size-4" />
                </TooltipTrigger>
                <TooltipContent class="max-w-xs">
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
                </TooltipContent>
            </TooltipRoot>
            <SelectRoot type="single" value={model} onValueChange={onHRZonesChange}>
                <SelectTrigger class="w-48">
                    {HR_MODEL_LABELS[model]}
                </SelectTrigger>
                <SelectPortal>
                    <SelectContent>
                        {#each modelOptions as option}
                            <SelectItem value={option.value}>
                                {option.label}
                            </SelectItem>
                        {/each}
                    </SelectContent>
                </SelectPortal>
            </SelectRoot>
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
