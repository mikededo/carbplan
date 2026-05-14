<script lang="ts">
    import { TooltipContent, TooltipRoot, TooltipTrigger } from '$lib/domain/ui/tooltip'

    import { formatPercentRange } from '../types'

    type Props = {
        color: string
        index: number
        maxPercent: null | number
        minPercent: number
        name: string
        range: string
        description?: string
    }
    const { color, description, index, maxPercent, minPercent, name, range }: Props = $props()
</script>

<div class="flex items-center justify-between py-2 text-sm">
    <div class="flex items-center gap-3">
        <div class="size-3 rounded-full" style="background-color: {color};"></div>
        <span class="font-medium">Z{index + 1}</span>
        {#if description}
            <TooltipRoot>
                <TooltipTrigger class="cursor-help text-muted-foreground underline decoration-dotted underline-offset-2">
                    {name}
                </TooltipTrigger>
                <TooltipContent class="max-w-xs">
                    <p>{description}</p>
                </TooltipContent>
            </TooltipRoot>
        {:else}
            <span class="text-muted-foreground">{name}</span>
        {/if}
    </div>
    <div class="flex items-center gap-4 text-right">
        <span class="w-24 font-mono text-xs">{range}</span>
        <span class="w-16 font-mono text-xs text-muted-foreground">
            {formatPercentRange(minPercent, maxPercent)}
        </span>
    </div>
</div>
