<script lang="ts">
    import type { PowerZoneModel, PowerZonesData } from '../schemas'

    import { ZapIcon } from '@lucide/svelte'

    import * as Select from '$lib/domain/ui/select'
    import { ZoneBar, ZoneListItem, ZonePlaceholder } from '$lib/domain/zones/zone/components'

    import { POWER_MODEL_LABELS } from '../presets'
    import { isPowerPresetZoneModel } from '../schemas'
    import { calculatePowerZones, formatPowerRange } from '../utils'

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

        <Select.Root type="single" value={model} onValueChange={onPowerZonesChange}>
            <Select.Trigger class="ml-auto w-48">
                {POWER_MODEL_LABELS[model]}
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

