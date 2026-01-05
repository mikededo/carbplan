<script lang="ts">

    import type { PageData } from './$types'

    import { LoaderCircleIcon } from '@lucide/svelte'
    import SaveIcon from '@lucide/svelte/icons/save'

    import { PageHeader } from '$lib/domain/layout/components'
    import PageScrollarea from '$lib/domain/layout/components/page-scrollarea.svelte'
    import {
        SectionHeartRate,
        SectionNutrition,
        SectionPersonal,
        SectionPower
    } from '$lib/domain/settings/components'
    import { PROFILE_VALUES } from '$lib/domain/settings/constants'
    import { createAthleteMutation, useAthleteQuery } from '$lib/domain/settings/queries'
    import { Button } from '$lib/domain/ui/button'

    type Props = { data: PageData }
    const { data }: Props = $props()

    const athleteQuery = useAthleteQuery()
    const mutation = $derived(createAthleteMutation(data.session?.user.id))
    const isPending = $derived(!!mutation?.isPending)

    let fullName = $derived(athleteQuery.data?.full_name ?? '')
    let sex = $derived<'' | 'female' | 'male'>(athleteQuery?.data?.sex ?? '')
    let height = $derived(athleteQuery.data?.height_cm ?? undefined)
    let weight = $derived(athleteQuery.data?.weight_kg ?? undefined)
    let ftp = $derived(athleteQuery.data?.ftp ?? undefined)
    let hrRest = $derived(athleteQuery.data?.hr_rest ?? undefined)
    let hrMax = $derived(athleteQuery.data?.hr_max ?? undefined)
    const hrZones = $derived(athleteQuery.data?.hr_zones)
    const powerZones = $derived(athleteQuery.data?.power_zones)
    let maxCarbIntake = $derived(athleteQuery.data?.max_carb_intake_g_per_hr ?? PROFILE_VALUES.maxCarbIntake.default)

    const hasChanged = $derived.by(() => {
        const data = athleteQuery.data
        if (!data) {
            return false
        }

        return ftp !== data.ftp ||
            fullName !== data.full_name ||
            height !== data.height_cm ||
            hrMax !== data.hr_max ||
            hrRest !== data.hr_rest ||
            maxCarbIntake !== data.max_carb_intake_g_per_hr ||
            sex !== data.sex ||
            weight !== data.weight_kg
    }
    )

    const onSave = () => {
        if (!mutation) {
            return
        }

        mutation.mutate({
            ftp,
            fullName,
            height,
            hrMax,
            hrRest,
            maxCarbIntake,
            sex: sex === '' ? undefined : sex,
            weight
        })
    }
</script>

<svelte:head>
    <title>Settings — CarbPlan</title>
</svelte:head>

<PageHeader crumbs={['Settings']}>
    <Button
        class="ml-auto"
        disabled={isPending || !hasChanged}
        size="sm"
        type="button"
        onclick={onSave}
    >
        {#if isPending}
            <LoaderCircleIcon class="animate-spin" />
        {:else}
            <SaveIcon />
        {/if}
        {isPending ? 'Saving' : 'Save changes'}
    </Button>
</PageHeader>

<PageScrollarea>
    <div class="relative mx-auto flex flex-col">
        <div class="sticky top-0 z-10 flex items-center justify-between border-b bg-background px-8 py-4">
            <h2 class="font-semibold">Profile settings</h2>
        </div>

        <div class="divide-y divide-border px-8">
            <SectionPersonal
                bind:fullName
                bind:height
                bind:sex
                bind:weight
                email={athleteQuery.data?.email ?? ''}
            />

            <SectionPower
                bind:ftp
                bind:weight
                athleteId={athleteQuery.data?.id ?? undefined}
                {powerZones}
            />

            <SectionHeartRate
                bind:hrMax
                bind:hrRest
                athleteId={athleteQuery.data?.id ?? undefined}
                {hrZones}
            />

            <SectionNutrition bind:maxCarbIntake />
        </div>
    </div>
</PageScrollarea>
