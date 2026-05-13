<script lang="ts">
    import type { PageData } from './$types'

    import { PROFILE_FIELD_CONSTRAINTS } from '@carbplan/domain/profile'
    import { LoaderCircleIcon, SaveIcon } from '@lucide/svelte'

    import PageHeader from '$lib/domain/layout/components/page-header.svelte'
    import PageScrollarea from '$lib/domain/layout/components/page-scrollarea.svelte'
    import SectionHeartRate from '$lib/domain/settings/components/section-heart-rate.svelte'
    import SectionNutrition from '$lib/domain/settings/components/section-nutrition.svelte'
    import SectionPersonal from '$lib/domain/settings/components/section-personal.svelte'
    import SectionPower from '$lib/domain/settings/components/section-power.svelte'
    import { createAthleteMutation, useAthleteQuery } from '$lib/domain/settings/queries/use-athlete.svelte'
    import Button from '$lib/domain/ui/button/button.svelte'

    type Props = { data: PageData }
    const { data }: Props = $props()

    const athleteQuery = useAthleteQuery()
    const mutation = $derived(createAthleteMutation(data.user?.id))
    const isPending = $derived(!!mutation?.isPending)

    let fullName = $derived(athleteQuery.data?.fullName ?? '')
    let sex = $derived<'' | 'female' | 'male'>(athleteQuery?.data?.sex ?? '')
    let heightCm = $derived(athleteQuery.data?.heightCm ?? undefined)
    let weightKg = $derived(athleteQuery.data?.weightKg ?? undefined)
    let ftp = $derived(athleteQuery.data?.ftp ?? undefined)
    let hrRest = $derived(athleteQuery.data?.hrRest ?? undefined)
    let hrMax = $derived(athleteQuery.data?.hrMax ?? undefined)
    const hrZones = $derived(athleteQuery.data?.hrZones)
    const powerZones = $derived(athleteQuery.data?.powerZones)
    let maxCarbIntakeGPerHr = $derived(athleteQuery.data?.maxCarbIntakeGPerHr ?? PROFILE_FIELD_CONSTRAINTS.maxCarbIntake.default)

    const hasChanged = $derived.by(() => {
        const data = athleteQuery.data
        if (!data) {
            return false
        }

        return ftp !== data.ftp ||
            fullName !== data.fullName ||
            heightCm !== data.heightCm ||
            hrMax !== data.hrMax ||
            hrRest !== data.hrRest ||
            maxCarbIntakeGPerHr !== data.maxCarbIntakeGPerHr ||
            sex !== data.sex ||
            weightKg !== data.weightKg
    })

    const onSave = () => {
        if (!mutation) {
            return
        }

        mutation.mutate({
            ftp,
            fullName,
            heightCm,
            hrMax,
            hrRest,
            maxCarbIntakeGPerHr,
            sex: sex === '' ? undefined : sex,
            weightKg
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
    <section class="mx-auto max-w-6xl space-y-4 divide-y divide-border px-8">
        <SectionPersonal
            bind:fullName
            bind:height={heightCm}
            bind:sex
            bind:weight={weightKg}
            email={athleteQuery.data?.email ?? ''}
        />

        <SectionPower
            bind:ftp
            bind:weight={weightKg}
            athleteId={athleteQuery.data?.id ?? undefined}
            {powerZones}
        />

        <SectionHeartRate
            bind:hrMax
            bind:hrRest
            athleteId={athleteQuery.data?.id ?? undefined}
            {hrZones}
        />

        <SectionNutrition bind:maxCarbIntake={maxCarbIntakeGPerHr} />
    </section>
</PageScrollarea>
