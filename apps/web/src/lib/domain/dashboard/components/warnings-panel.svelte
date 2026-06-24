<script lang="ts">
    import type { CurrentAthleteResponse } from '$lib/api/endpoint-types'
    import type { DashboardPlan } from '$lib/domain/dashboard/types'

    import { CircleCheckBigIcon, CoffeeIcon, TriangleAlertIcon, ZapIcon } from '@lucide/svelte'

    import { AlertDescription, AlertRoot, AlertTitle } from '$lib/domain/ui/alert'

    type AthleteData = Pick<CurrentAthleteResponse, 'maxCarbIntakeGPerHr'>

    type Props = {
        athlete: AthleteData | null
        plan: DashboardPlan | null
    }
    const { athlete, plan }: Props = $props()

    const warnings = $derived.by(() => {
        const list: { icon: LucideIcon, message: string, type: 'caffeine' | 'carbs' }[] = []

        if (!plan || !athlete) {
            return list
        }

        if (athlete.maxCarbIntakeGPerHr && plan.nutrition.totalCarbsG && plan.durationMinutes) {
            const actualCarbsPerHour = (plan.nutrition.totalCarbsG / plan.durationMinutes) * 60
            if (actualCarbsPerHour > athlete.maxCarbIntakeGPerHr) {
                list.push({
                    icon: ZapIcon,
                    message: `Plan exceeds your max intake (${Math.round(actualCarbsPerHour)} g/hr vs ${athlete.maxCarbIntakeGPerHr} g/hr limit)`,
                    type: 'carbs'
                })
            }
        }

        if (plan.nutrition.totalCaffeineMg && plan.nutrition.totalCaffeineMg > 400) {
            list.push({
                icon: CoffeeIcon,
                message: `High caffeine total (${Math.round(plan.nutrition.totalCaffeineMg)} mg)`,
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
                <AlertRoot variant="destructive">
                    <TriangleAlertIcon class="size-4" />
                    <AlertTitle>Warning</AlertTitle>
                    <AlertDescription>{warning.message}</AlertDescription>
                </AlertRoot>
            {/each}
        {:else if plan.nutrition.itemCount && plan.nutrition.itemCount > 0}
            <AlertRoot class="border-green-500/20 bg-green-500/5 text-green-700 dark:text-green-400">
                <CircleCheckBigIcon class="size-4" />
                <AlertTitle>Plan looks good</AlertTitle>
                <AlertDescription>Your next plan is within your targets.</AlertDescription>
            </AlertRoot>
        {/if}
    </section>
{/if}
