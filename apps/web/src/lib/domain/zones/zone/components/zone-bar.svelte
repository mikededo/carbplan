<script lang="ts">
    import type { ZonePreset } from '../types'

    import { createTether, TooltipContent, TooltipRoot, TooltipTrigger } from '$lib/domain/ui/tooltip'

    type Props = {
        zones: ZonePreset[]
    }
    const { zones }: Props = $props()

    const tooltipTether = createTether<ZonePreset>()

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
    <TooltipRoot tether={tooltipTether}>
        {#snippet children({ payload })}
            {#each zones as zone, i (zone.name)}
                <TooltipTrigger
                    class="flex items-center justify-center text-xs text-white transition-opacity hover:opacity-80"
                    payload={zone}
                    style="width: {zoneWidths()[i]}%; background-color: {zone.color};"
                >
                    <span class="truncate px-1">Z{i + 1}</span>
                </TooltipTrigger>
            {/each}

            <TooltipContent>
                <p>{payload?.name ?? 'Zone'}</p>
            </TooltipContent>
        {/snippet}
    </TooltipRoot>
</div>
