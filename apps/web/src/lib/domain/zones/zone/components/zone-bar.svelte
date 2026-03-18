<script lang="ts">
    import type { ZonePreset } from '../types'

    import * as Tooltip from '$lib/domain/ui/tooltip'

    type Props = {
        zones: ZonePreset[]
    }
    const { zones }: Props = $props()

    const zoneWidths = $derived(() => {
        const totalRange = zones.reduce((acc, zone) => {
            const range = (zone.maxPercent ?? 200) - zone.minPercent
            return acc + range
        }, 0)

        return zones.map((zone) => {
            const range = (zone.maxPercent ?? 200) - zone.minPercent
            return (range / totalRange) * 100
        })
    })
</script>

<div class="flex h-8 w-full overflow-hidden rounded-md">
    {#each zones as zone, i}
        <Tooltip.Root>
            <Tooltip.Trigger
                class="flex items-center justify-center text-xs font-medium text-white transition-opacity hover:opacity-80"
                style="width: {zoneWidths()[i]}%; background-color: {zone.color};"
            >
                <span class="truncate px-1">Z{i + 1}</span>
            </Tooltip.Trigger>
            <Tooltip.Content>
                <p class="font-medium">{zone.name}</p>
            </Tooltip.Content>
        </Tooltip.Root>
    {/each}
</div>

