<script lang="ts">
    import type { NutritionPlan, ScheduledEvent } from '$lib/domain/dashboard/types'

    import {
        QuickActions,
        RecentPlansSection,
        ScheduleSection
    } from '$lib/domain/dashboard/components'
    import { PageHeader } from '$lib/domain/layout/components'

    // Placeholder data - will be replaced with real queries once plans table exists
    const recentPlans: NutritionPlan[] = []
    const todayEvents: ScheduledEvent[] = []
    const upcomingEvents: ScheduledEvent[] = []
</script>

<svelte:head>
    <title>Dashboard — CarbPlan</title>
</svelte:head>

<PageHeader crumbs={['Dashboard']} />

<div class="flex flex-1 flex-col gap-6 p-4 pt-0">
    <QuickActions />
    <ScheduleSection {todayEvents} {upcomingEvents} />
    <RecentPlansSection plans={recentPlans} />
</div>
