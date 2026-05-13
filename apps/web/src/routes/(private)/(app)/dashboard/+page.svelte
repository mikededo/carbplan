<script lang="ts">
    import { createQuery } from '@tanstack/svelte-query'
    import { err, ok } from 'neverthrow'

    import FavoritesSection from '$lib/domain/dashboard/components/favorites-section.svelte'
    import NextPlanCard from '$lib/domain/dashboard/components/next-plan-card.svelte'
    import QuickActions from '$lib/domain/dashboard/components/quick-actions.svelte'
    import RecentPlansSection from '$lib/domain/dashboard/components/recent-plans-section.svelte'
    import WarningsPanel from '$lib/domain/dashboard/components/warnings-panel.svelte'
    import { favoriteProductsOptions } from '$lib/domain/dashboard/queries/favorites'
    import { nextPlanOptions, recentPlansOptions } from '$lib/domain/dashboard/queries/plans'
    import PageHeader from '$lib/domain/layout/components/page-header.svelte'
    import PageScrollarea from '$lib/domain/layout/components/page-scrollarea.svelte'
    import { getPrivateServicesContext } from '$lib/domain/services/context'
    import { useAthleteQuery } from '$lib/domain/settings/queries/use-athlete.svelte'

    const servicesResult = getPrivateServicesContext()
    const dashboardService = servicesResult.isOk() ? ok(servicesResult.value.dashboard) : err()

    const athleteQuery = useAthleteQuery()
    const nextPlanQuery = createQuery(() => nextPlanOptions(dashboardService))
    const recentPlansQuery = createQuery(() => recentPlansOptions(dashboardService, 5))
    const favoritesQuery = createQuery(() => favoriteProductsOptions(dashboardService, 6))
</script>

<svelte:head>
    <title>Dashboard — CarbPlan</title>
</svelte:head>

<PageHeader crumbs={['Dashboard']} />

<PageScrollarea>
    <NextPlanCard plan={nextPlanQuery.data ?? null} />
    <WarningsPanel
        athlete={athleteQuery?.data ?? null}
        plan={nextPlanQuery.data ?? null}
    />
    <QuickActions />
    <div class="grid gap-6 lg:grid-cols-2">
        <RecentPlansSection plans={recentPlansQuery.data ?? []} />
        <FavoritesSection products={favoritesQuery.data ?? []} />
    </div>
</PageScrollarea>
