<script lang="ts">
    import { formatPercentRange } from '../types'

    type Props = {
        index: number
        maxPercent: null | number
        minPercent: number
        name: string
        range: string
        color: string
    }
    const { color, index, maxPercent, minPercent, name, range }: Props = $props()
</script>

<div class="flex items-center justify-between py-2 text-sm">
    <div class="flex items-center gap-3">
        <div class="size-3 rounded-full" style="background-color: {color};"></div>
        <span class="font-medium">Z{index + 1}</span>
        <span class="text-muted-foreground">{name}</span>
    </div>
    <div class="flex items-center gap-4 text-right">
        <span class="w-24 font-mono text-xs">{range}</span>
        <span class="w-16 font-mono text-xs text-muted-foreground">
            {formatPercentRange(minPercent, maxPercent)}
        </span>
    </div>
</div>

