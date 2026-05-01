<script lang="ts">
    import { createQuery } from '@tanstack/svelte-query'
    import { err, ok } from 'neverthrow'

    import {
        FavoritesSection,
        NextPlanCard,
        QuickActions,
        RecentPlansSection,
        WarningsPanel
    } from '$lib/domain/dashboard/components'
    import {
        favoriteProductsOptions,
        nextPlanOptions,
        recentPlansOptions
    } from '$lib/domain/dashboard/queries'
    import { PageHeader, PageScrollarea } from '$lib/domain/layout/components'
    import { getPrivateServicesContext } from '$lib/domain/services/context'
    import { useAthleteQuery } from '$lib/domain/settings/queries'

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
    <div class="flex flex-col gap-6 p-6">
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
    </div>
</PageScrollarea>
