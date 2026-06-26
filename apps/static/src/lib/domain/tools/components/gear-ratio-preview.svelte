<script lang="ts">
    import { Badge } from '@kilo/ui/badge'
    import { cn } from '@kilo/ui/utils'
    import { CogIcon, GaugeIcon } from '@lucide/svelte'

    import { entryStyles } from '../../marketing/helpers'
    import PreviewWindow from './preview-window.svelte'

    type Props = { isVisible: boolean }
    const { isVisible }: Props = $props()

    // ponytail: static marketing mock, not a working calculator. Real tool lives behind /tools/gear-ratio later.
    const CHAINRINGS = [50, 34]
    const COGS = [11, 14, 17, 21, 25, 30]
    const SELECTED = { chainring: 50, cog: 17 }

    const ratio = (chainring: number, cog: number) => chainring / cog
    const isSelected = (chainring: number, cog: number) =>
        chainring === SELECTED.chainring && cog === SELECTED.cog

    const selectedRatio = ratio(SELECTED.chainring, SELECTED.cog)
    // gear inches ≈ ratio × wheel diameter (700c ≈ 26.4"); speed at 90rpm, 39370 in/km
    const gearInches = selectedRatio * 26.4
    const speed = ((gearInches * Math.PI * 90 * 60) / 39370).toFixed(1)
</script>

<PreviewWindow title="Kilo · Gear-ratio visualizer" {isVisible}>
    {#snippet badge()}
        <Badge class="text-xs" variant="secondary">
            <CogIcon class="mr-1 size-3" />
            50 / 34 · 11–30
        </Badge>
    {/snippet}

    <div class="space-y-5">
        <div class="overflow-hidden rounded-md border border-border">
            <div class="grid" style="grid-template-columns: 3rem repeat({COGS.length}, 1fr);">
                <div class="bg-muted/50 p-2 text-xs font-medium text-muted-foreground">T</div>
                {#each COGS as cog (cog)}
                    <div class="bg-muted/50 p-2 text-center font-mono text-xs text-muted-foreground">
                        {cog}
                    </div>
                {/each}

                {#each CHAINRINGS as chainring (chainring)}
                    <div class="border-t border-border bg-muted/50 p-2 font-mono text-xs font-medium text-muted-foreground">
                        {chainring}
                    </div>
                    {#each COGS as cog, i (cog)}
                        <div
                            class={cn(
                                'border-t border-l border-border p-2 text-center font-mono text-sm tabular-nums transition-all duration-500',
                                isSelected(chainring, cog)
                                    ? 'bg-primary font-semibold text-primary-foreground'
                                    : 'text-foreground'
                            )}
                            style={entryStyles(isVisible, { delay: i * 40 + 300, offset: 8 })}
                        >
                            {ratio(chainring, cog).toFixed(2)}
                        </div>
                    {/each}
                {/each}
            </div>
        </div>

        <div class="grid grid-cols-3 gap-3">
            <div class="rounded-lg bg-muted/50 p-3 text-center">
                <p class="text-xs text-muted-foreground">Ratio</p>
                <p class="text-lg font-bold tabular-nums">{selectedRatio.toFixed(2)}</p>
            </div>
            <div class="rounded-lg bg-muted/50 p-3 text-center">
                <p class="text-xs text-muted-foreground">Gear inches</p>
                <p class="text-lg font-bold tabular-nums">{gearInches.toFixed(0)}"</p>
            </div>
            <div class="rounded-lg bg-muted/50 p-3 text-center">
                <div class="flex items-center justify-center gap-1 text-xs text-muted-foreground">
                    <GaugeIcon class="size-3" />
                    @ 90 rpm
                </div>
                <p class="text-lg font-bold tabular-nums">{speed} km/h</p>
            </div>
        </div>
    </div>
</PreviewWindow>
