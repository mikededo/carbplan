<script lang="ts">
    import type { HRZoneModel, HRZonesData } from '@carbplan/domain/hr'

    import { HR_MODEL_INFO, HR_MODEL_LABELS, HR_ZONE_PRESETS } from '@carbplan/domain/hr'
    import { SelectContent, SelectItem, SelectPortal, SelectRoot, SelectTrigger } from '@carbplan/ui/select'
    import { createTether, TooltipContent, TooltipRoot, TooltipTrigger } from '@carbplan/ui/tooltip'
    import { ExternalLinkIcon, HeartIcon, InfoIcon } from '@lucide/svelte'

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
    const descriptionTooltipTether = createTether()

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
                            rel="external noopener noreferrer"
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
                        {#each modelOptions as option (option.value)}
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
            {#each zones.zones as zone, i (zone.name)}
                <ZoneListItem
                    color={zone.color}
                    description={currentPreset[i]?.description}
                    descriptionTether={descriptionTooltipTether}
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
