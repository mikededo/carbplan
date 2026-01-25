<script lang="ts">
    import { createQuery } from '@tanstack/svelte-query'

    import { getSupabaseClient } from '$lib/database/context'
    import {
        FavoritesSection,
        NextPlanCard,
        QuickActions,
        RecentPlansSection
    } from '$lib/domain/dashboard/components'
    import {
        favoriteProductsOptions,
        nextPlanOptions,
        recentPlansOptions
    } from '$lib/domain/dashboard/queries'
    import { PageHeader, PageScrollarea } from '$lib/domain/layout/components'

    const supabaseResult = getSupabaseClient()
    const supabase = supabaseResult.isOk() ? supabaseResult.value : undefined

    const nextPlanQuery = createQuery(() => nextPlanOptions(supabase))
    const recentPlansQuery = createQuery(() => recentPlansOptions(supabase, 5))
    const favoritesQuery = createQuery(() => favoriteProductsOptions(supabase, 6))
</script>

<svelte:head>
    <title>Dashboard — CarbPlan</title>
</svelte:head>

<PageHeader crumbs={['Dashboard']} />

<PageScrollarea>
    <div class="flex flex-col gap-6 p-6">
        <NextPlanCard plan={nextPlanQuery.data ?? null} />
        <QuickActions />
        <div class="grid gap-6 lg:grid-cols-2">
            <RecentPlansSection plans={recentPlansQuery.data ?? []} />
            <FavoritesSection products={favoritesQuery.data ?? []} />
        </div>
    </div>
</PageScrollarea>
