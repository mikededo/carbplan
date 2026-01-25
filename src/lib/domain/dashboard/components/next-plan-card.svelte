<script lang="ts">
    import type { PlanWithSummary } from '$lib/database/types.g'

    import { CalendarIcon, ClockIcon, Edit2Icon, ZapIcon } from '@lucide/svelte'

    import { ROUTES } from '$lib/constants/routes'
    import { Button } from '$lib/domain/ui/button'
    import * as Card from '$lib/domain/ui/card'

    type Props = { plan: null | PlanWithSummary }
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

    const formatDate = (dateStr: null | string) => {
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

<section class="space-y-4">
    <h2 class="text-lg font-semibold">Next plan</h2>

    {#if plan}
        <Card.Root class="gap-0 rounded-md border-primary/20 bg-primary/5 py-4">
            <Card.Header class="flex-row items-start justify-between space-y-0 px-4 pb-3">
                <div>
                    <Card.Title class="text-lg">{plan.name}</Card.Title>
                    <div class="mt-1 flex items-center gap-4 text-sm text-muted-foreground">
                        <span class="flex items-center gap-1.5">
                            <CalendarIcon class="size-3.5" />
                            {formatDate(plan.date)}
                        </span>
                        <span class="flex items-center gap-1.5">
                            <ClockIcon class="size-3.5" />
                            {formatDuration(plan.duration_minutes)}
                        </span>
                    </div>
                </div>
                <Button href={plan.id ? ROUTES.plans.edit(plan.id) : ROUTES.plans.new} size="sm" variant="outline">
                    <Edit2Icon class="size-3.5" />
                    Edit
                </Button>
            </Card.Header>
            <Card.Content class="px-4">
                <div class="flex flex-wrap gap-4">
                    {#if plan.target_carbs_per_hour}
                        <div class="flex items-center gap-2 rounded-md bg-background px-3 py-2">
                            <ZapIcon class="size-4 text-primary" />
                            <div>
                                <p class="text-xs text-muted-foreground">Target</p>
                                <p class="font-medium">{plan.target_carbs_per_hour} g/hr</p>
                            </div>
                        </div>
                    {/if}
                    {#if plan.total_carbs_g}
                        <div class="flex items-center gap-2 rounded-md bg-background px-3 py-2">
                            <div>
                                <p class="text-xs text-muted-foreground">Total carbs</p>
                                <p class="font-medium">{Math.round(plan.total_carbs_g)} g</p>
                            </div>
                        </div>
                    {/if}
                    {#if plan.item_count}
                        <div class="flex items-center gap-2 rounded-md bg-background px-3 py-2">
                            <div>
                                <p class="text-xs text-muted-foreground">Items</p>
                                <p class="font-medium">{plan.item_count}</p>
                            </div>
                        </div>
                    {/if}
                </div>
            </Card.Content>
        </Card.Root>
    {:else}
        <Card.Root class="gap-2 rounded-md border-dashed py-6">
            <Card.Content class="flex flex-col items-center justify-center px-4 text-center">
                <p class="text-sm text-muted-foreground">
                    No upcoming plans. Create one to see it here.
                </p>
            </Card.Content>
        </Card.Root>
    {/if}
</section>
