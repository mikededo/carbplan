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
    import { useAthlete, useMutateAthlete } from '$lib/domain/settings/queries'
    import { Button } from '$lib/domain/ui/button'

    type Props = { data: PageData }
    const { data }: Props = $props()

    const athlete = useAthlete()
    const mutation = $derived(useMutateAthlete(data.session?.user.id))
    const isPending = $derived(!!mutation?.isPending)

    let fullName = $state(athlete?.data?.full_name ?? '')
    let sex = $state<'' | 'female' | 'male'>(athlete?.data?.sex ?? '')
    let height = $state(athlete?.data?.height_cm ?? undefined)
    let weight = $state(athlete?.data?.weight_kg ?? undefined)
    let ftp = $state(athlete?.data?.ftp ?? undefined)
    let hrRest = $state(athlete?.data?.hr_rest ?? undefined)
    let hrMax = $state(athlete?.data?.hr_max ?? undefined)
    let maxCarbIntake = $state(athlete?.data?.max_carb_intake_g_per_hr ?? PROFILE_VALUES.maxCarbIntake.default)

    const hasChanged = $derived.by(() => {
        const data = athlete?.data
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
        <div class="sticky top-0 z-10 flex items-center justify-between border-b bg-background px-6 py-4">
            <h2 class="font-medium">Profile settings</h2>
        </div>

        <div class="divide-y divide-border px-6">
            <SectionPersonal
                bind:fullName
                bind:height
                bind:sex
                bind:weight
                email={athlete?.data?.email ?? ''}
            />

            <SectionPower bind:ftp bind:weight />

            <SectionHeartRate bind:hrMax bind:hrRest />

            <SectionNutrition bind:maxCarbIntake />
        </div>
    </div>
</PageScrollarea>
