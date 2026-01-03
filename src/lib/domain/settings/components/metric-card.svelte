<script lang="ts">
    import { cn } from '$lib/utils'

    type Props = {
        label: string
        unit: string
        value: number | string
        class?: string
        Icon?: LucideIcon
    }
    const { class: className, Icon, label, unit, value }: Props = $props()
</script>

<div class={cn('rounded-lg bg-accent p-0.5', className)}>
    <p class="px-2 py-1 text-xs text-muted-foreground">{label}</p>
    <div class="flex items-center gap-2 rounded-md bg-white p-2">
        {#if Icon}
            <Icon class="size-5 shrink-0" />
        {/if}
        <div class="flex items-baseline gap-1">
            <span class="text-2xl font-semibold tabular-nums">{value}</span>
            <span class="text-sm text-muted-foreground">{unit}</span>
        </div>
    </div>
</div>

