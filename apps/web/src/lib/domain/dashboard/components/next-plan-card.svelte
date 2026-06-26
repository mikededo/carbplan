<script lang="ts">
    import type { DashboardPlan } from '$lib/domain/dashboard/types'

    import { Button } from '@kilo/ui/button'
    import { CardContent, CardHeader, CardRoot, CardTitle } from '@kilo/ui/card'
    import { CalendarIcon, ClockIcon, PenIcon, ZapIcon } from '@lucide/svelte'

    import { ROUTES } from '$lib/constants/routes'
    import PageSection from '$lib/domain/layout/components/page-section.svelte'

    type Props = { plan: DashboardPlan | null }
    const { plan }: Props = $props()

    const formatDuration = (minutes: null | number) => {
        if (!minutes) {
            return '-'
        }
        if (minutes < 60) {
            return `${minutes} min`
        }
        const hours = Math.floor(minutes / 60)
        const mins = minutes % 60
        return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`
    }

    const formatDate = (dateStr: Date | null | string) => {
        if (!dateStr) {
            return '-'
        }
        const date = new Date(dateStr)
        const today = new Date()
        const tomorrow = new Date(today)
        tomorrow.setDate(tomorrow.getDate() + 1)

        if (date.toDateString() === today.toDateString()) {
            return 'Today'
        }
        if (date.toDateString() === tomorrow.toDateString()) {
            return 'Tomorrow'
        }
        return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', weekday: 'short' })
    }
</script>

<PageSection header="Next plan">
    {#if plan}
        <CardRoot class="gap-0 rounded-md border-primary/20 bg-primary/5 py-4">
            <CardHeader class="flex-row items-start justify-between space-y-0 px-4 pb-3">
                <div>
                    <CardTitle class="text-lg">{plan.name}</CardTitle>
                    <div class="mt-1 flex items-center gap-4 text-sm text-muted-foreground">
                        <span class="flex items-center gap-1.5">
                            <CalendarIcon class="size-3.5" />
                            {formatDate(plan.date)}
                        </span>
                        <span class="flex items-center gap-1.5">
                            <ClockIcon class="size-3.5" />
                            {formatDuration(plan.durationMinutes)}
                        </span>
                    </div>
                </div>
                <Button href={plan.id ? ROUTES.plans.edit(plan.id) : ROUTES.plans.new} size="sm" variant="outline">
                    <PenIcon class="size-3.5" />
                    Edit
                </Button>
            </CardHeader>
            <CardContent class="px-4">
                <div class="flex flex-wrap gap-4">
                    {#if plan.targetCarbsPerHour}
                        <div class="flex items-center gap-2 rounded-md bg-background px-3 py-2">
                            <ZapIcon class="size-4 text-primary" />
                            <div>
                                <p class="text-xs text-muted-foreground">Target</p>
                                <p class="font-medium">{plan.targetCarbsPerHour} g/hr</p>
                            </div>
                        </div>
                    {/if}
                    {#if plan.nutrition.totalCarbsG}
                        <div class="flex items-center gap-2 rounded-md bg-background px-3 py-2">
                            <div>
                                <p class="text-xs text-muted-foreground">Total carbs</p>
                                <p class="font-medium">{Math.round(plan.nutrition.totalCarbsG)} g</p>
                            </div>
                        </div>
                    {/if}
                    {#if plan.nutrition.itemCount}
                        <div class="flex items-center gap-2 rounded-md bg-background px-3 py-2">
                            <div>
                                <p class="text-xs text-muted-foreground">Items</p>
                                <p class="font-medium">{plan.nutrition.itemCount}</p>
                            </div>
                        </div>
                    {/if}
                </div>
            </CardContent>
        </CardRoot>
    {:else}
        <CardRoot class="gap-2 rounded-md border-dashed py-6">
            <CardContent class="flex flex-col items-center justify-center px-4 text-center">
                <p class="text-sm text-muted-foreground">
                    No upcoming plans. Create one to see it here.
                </p>
            </CardContent>
        </CardRoot>
    {/if}
</PageSection>
