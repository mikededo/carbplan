<script lang="ts">
    import type { DashboardPlan } from '$lib/domain/dashboard/types'

    import { FileText, Plus } from '@lucide/svelte'

    import { ROUTES } from '$lib/constants/routes'
    import PageSection from '$lib/domain/layout/components/page-section.svelte'
    import Button from '$lib/domain/ui/button/button.svelte'
    import CardContent from '$lib/domain/ui/card/card-content.svelte'
    import CardRoot from '$lib/domain/ui/card/card.svelte'

    type Props = { plans: DashboardPlan[] }
    const { plans }: Props = $props()

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
        return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' })
    }
</script>

<PageSection header="Recent plans">
    {#if plans.length === 0}
        <CardRoot class="gap-2 rounded-md py-8">
            <CardContent class="flex flex-col items-center justify-center px-4 text-center">
                <div class="mb-4 rounded-full bg-muted p-3">
                    <FileText class="size-6 text-muted-foreground" />
                </div>
                <h3 class="text-base font-medium">No plans yet</h3>
                <p class="mt-1 max-w-sm text-sm text-muted-foreground">
                    Create your first fueling plan to start optimizing your nutrition strategy.
                </p>
                <div class="mt-4">
                    <Button class="gap-2" href={ROUTES.plans.new} size="sm">
                        <Plus class="size-4" />
                        Create plan
                    </Button>
                </div>
            </CardContent>
        </CardRoot>
    {:else}
        <div class="space-y-2">
            {#each plans as plan (plan.id)}
                <CardRoot class="gap-0 rounded-md py-3 transition-colors hover:bg-muted/50">
                    <CardContent class="flex items-center justify-between px-4">
                        <div class="flex items-center gap-3">
                            <div class="rounded-md bg-muted p-2">
                                <FileText class="size-4 text-muted-foreground" />
                            </div>
                            <div>
                                <p class="font-medium">{plan.name}</p>
                                <p class="text-sm text-muted-foreground">{formatDate(plan.date)}</p>
                            </div>
                        </div>
                        <div class="text-right text-sm text-muted-foreground">
                            <p>{formatDuration(plan.durationMinutes)}</p>
                            {#if plan.targetCarbsPerHour}
                                <p>{plan.targetCarbsPerHour} g/hr</p>
                            {/if}
                        </div>
                    </CardContent>
                </CardRoot>
            {/each}
        </div>
    {/if}
</PageSection>
