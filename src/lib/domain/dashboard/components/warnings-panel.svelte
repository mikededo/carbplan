<script lang="ts">
    import type { PlanWithSummary } from '$lib/database/types.g'

    import { AlertTriangleIcon, CheckCircleIcon, CoffeeIcon, ZapIcon } from '@lucide/svelte'

    import * as Alert from '$lib/domain/ui/alert'

    type AthleteData = { max_carb_intake_g_per_hr: null | number }

    type Props = {
        athlete: AthleteData | null
        plan: null | PlanWithSummary
    }
    const { athlete, plan }: Props = $props()

    const warnings = $derived.by(() => {
        const list: Array<{ icon: typeof AlertTriangleIcon, message: string, type: 'caffeine' | 'carbs' }> = []

        if (!plan || !athlete) {
            return list
        }

        if (athlete.max_carb_intake_g_per_hr && plan.total_carbs_g && plan.duration_minutes) {
            const actualCarbsPerHour = (plan.total_carbs_g / plan.duration_minutes) * 60
            if (actualCarbsPerHour > athlete.max_carb_intake_g_per_hr) {
                list.push({
                    icon: ZapIcon,
                    message: `Plan exceeds your max intake (${Math.round(actualCarbsPerHour)} g/hr vs ${athlete.max_carb_intake_g_per_hr} g/hr limit)`,
                    type: 'carbs'
                })
            }
        }

        if (plan.total_caffeine_mg && plan.total_caffeine_mg > 400) {
            list.push({
                icon: CoffeeIcon,
                message: `High caffeine total (${Math.round(plan.total_caffeine_mg)} mg)`,
                type: 'caffeine'
            })
        }

        return list
    })

    const hasWarnings = $derived(warnings.length > 0)
</script>

{#if plan && athlete}
    <section class="space-y-3">
        {#if hasWarnings}
            {#each warnings as warning (warning.type)}
                <Alert.Root variant="destructive">
                    <AlertTriangleIcon class="size-4" />
                    <Alert.Title>Warning</Alert.Title>
                    <Alert.Description>{warning.message}</Alert.Description>
                </Alert.Root>
            {/each}
        {:else if plan.item_count && plan.item_count > 0}
            <Alert.Root class="border-green-500/20 bg-green-500/5 text-green-700 dark:text-green-400">
                <CheckCircleIcon class="size-4" />
                <Alert.Title>Plan looks good</Alert.Title>
                <Alert.Description>Your next plan is within your targets.</Alert.Description>
            </Alert.Root>
        {/if}
    </section>
{/if}
