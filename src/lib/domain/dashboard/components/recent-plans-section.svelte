<script lang="ts">
    import type { NutritionPlan } from '../types'

    import { FileText, Plus, Search } from '@lucide/svelte'

    import { ROUTES } from '$lib/constants/routes'
    import { Button } from '$lib/domain/ui/button'
    import * as Card from '$lib/domain/ui/card'

    type Props = { plans: NutritionPlan[] }
    const { plans }: Props = $props()

    const formatDuration = (minutes: number) => {
        if (minutes < 60) {
            return `${minutes} min`
        }
        const hours = Math.floor(minutes / 60)
        const mins = minutes % 60
        return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`
    }

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr)
        return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' })
    }
</script>

<section class="space-y-4">
    <h2 class="text-lg font-semibold">Recent nutrition plans</h2>

    {#if plans.length === 0}
        <Card.Root class="gap-2 rounded-md py-8">
            <Card.Content class="flex flex-col items-center justify-center px-4 text-center">
                <div class="mb-4 rounded-full bg-muted p-3">
                    <FileText class="size-6 text-muted-foreground" />
                </div>
                <h3 class="text-base font-medium">No plans yet</h3>
                <p class="mt-1 max-w-sm text-sm text-muted-foreground">
                    Create your first nutrition plan or browse supplements to get started.
                </p>
                <div class="mt-4 flex gap-2">
                    <Button class="gap-2" href={ROUTES.dashboard} size="sm">
                        <Plus class="size-4" />
                        Create plan
                    </Button>
                    <Button class="gap-2"
                        href={ROUTES.admin.supplements}
                        size="sm"
                        variant="outline"
                    >
                        <Search class="size-4" />
                        Browse supplements
                    </Button>
                </div>
            </Card.Content>
        </Card.Root>
    {:else}
        <div class="space-y-2">
            {#each plans as plan (plan.id)}
                <Card.Root class="gap-0 rounded-md py-3">
                    <Card.Content class="flex items-center justify-between px-4">
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
                            <p>{plan.targetCarbsPerHour} g/hr</p>
                        </div>
                    </Card.Content>
                </Card.Root>
            {/each}
        </div>
    {/if}
</section>
