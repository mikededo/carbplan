<script lang="ts">
    import type { BadgeVariant } from '$lib/domain/ui/badge/badge.svelte'

    import { Badge } from '$lib/domain/ui/badge'

    type Props = {
        caffeine: null | number
    }
    const { caffeine }: Props = $props()

    const variant = $derived.by((): BadgeVariant => {
        if (caffeine === null) {
            return 'outline'
        }

        if (caffeine < 30) {
            return 'info'
        }
        if (caffeine < 150) {
            return 'warn'
        }
        return 'destructive'
    })

    const label = $derived(caffeine !== null ? `${caffeine}mg` : '-')
</script>

{#if caffeine !== null}
    <Badge {variant}>{label}</Badge>
{:else}
    <span class="text-muted-foreground">{label}</span>
{/if}

