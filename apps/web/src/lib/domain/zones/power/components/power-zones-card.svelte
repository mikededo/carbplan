<script lang="ts">
    import type { PowerZoneModel, PowerZonesData } from '@carbplan/domain/power'

    import { POWER_MODEL_INFO, POWER_MODEL_LABELS, POWER_ZONE_PRESETS } from '@carbplan/domain/power'
    import { ExternalLinkIcon, InfoIcon, ZapIcon } from '@lucide/svelte'

    import { SelectContent, SelectItem, SelectPortal, SelectRoot, SelectTrigger } from '$lib/domain/ui/select'
    import { TooltipContent, TooltipRoot, TooltipTrigger } from '$lib/domain/ui/tooltip'
    import ZoneBar from '$lib/domain/zones/zone/components/zone-bar.svelte'
    import ZoneListItem from '$lib/domain/zones/zone/components/zone-list-item.svelte'
    import ZonePlaceholder from '$lib/domain/zones/zone/components/zone-placeholder.svelte'

    import { calculatePowerZones, formatPowerRange, isPowerPresetZoneModel } from '../utils'

    type Props = {
        ftp: number | undefined
        model?: Exclude<PowerZoneModel, 'custom'>
        onPowerZonesChange?: (data: PowerZonesData) => void
    }
    const {
        ftp,
        model = 'coggan',
        ...props
    }: Props = $props()

    const modelOptions = Object.entries(POWER_MODEL_LABELS)
        .filter(([key]) => key !== 'custom')
        .map(([value, label]) => ({ label, value }))

    const currentModelInfo = $derived(POWER_MODEL_INFO[model])
    const currentPreset = $derived(POWER_ZONE_PRESETS[model])

    const zones: null | PowerZonesData = $derived.by(() => {
        if (!ftp) {
            return null
        }

        return calculatePowerZones({ ftp, model })
    })

    const onPowerZonesChange = (model: string | undefined) => {
        if (!ftp) {
            return
        }

        const isModel = isPowerPresetZoneModel(model)
        if (!isModel) {
            return
        }

        if (model !== 'custom') {
            props.onPowerZonesChange?.(calculatePowerZones({ ftp, model }))
        }
    }
</script>

<div class="space-y-2">
    <div class="flex flex-col justify-between sm:flex-row sm:items-end">
        <div class="flex min-h-10 flex-col">
            <p class="text-sm font-medium">Power Zones</p>
            <p class="text-sm text-muted-foreground">Define the power zones that will be used to plan your nutrition</p>
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
            <SelectRoot type="single" value={model} onValueChange={onPowerZonesChange}>
                <SelectTrigger class="w-48">
                    {POWER_MODEL_LABELS[model]}
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
                    index={i}
                    maxPercent={zone.maxPercent}
                    minPercent={zone.minPercent}
                    name={zone.name}
                    range={formatPowerRange(zone)}
                />
            {/each}
        </div>
    {:else}
        <ZonePlaceholder
            description="Enter your FTP to see power zones"
            Icon={ZapIcon}
        />
    {/if}
</div>
