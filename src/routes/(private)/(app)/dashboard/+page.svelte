<script lang="ts">
    import type { NutritionPlan, ScheduledEvent } from '$lib/domain/dashboard/types'

    import {
        QuickActions,
        RecentPlansSection,
        ScheduleSection
    } from '$lib/domain/dashboard/components'
    import { PageHeader, PageScrollarea } from '$lib/domain/layout/components'

    // Placeholder data - will be replaced with real queries once plans table exists
    const recentPlans: NutritionPlan[] = []
    const todayEvents: ScheduledEvent[] = []
    const upcomingEvents: ScheduledEvent[] = []
</script>

<svelte:head>
    <title>Dashboard — CarbPlan</title>
</svelte:head>

<PageHeader crumbs={['Dashboard']} />

<PageScrollarea>
    <div class="flex flex-col gap-6 p-6">
        <QuickActions />
        <ScheduleSection {todayEvents} {upcomingEvents} />
        <RecentPlansSection plans={recentPlans} />
    </div>
</PageScrollarea>
