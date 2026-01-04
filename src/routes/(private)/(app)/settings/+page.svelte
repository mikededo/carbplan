<script lang="ts">
    import type { SubmitFunction } from '@sveltejs/kit'

    import type { PageData } from './$types'

    import SaveIcon from '@lucide/svelte/icons/save'

    import { enhance } from '$app/forms'
    import { PageHeader } from '$lib/domain/layout/components'
    import PageScrollarea from '$lib/domain/layout/components/page-scrollarea.svelte'
    import {
        SectionHeartRate,
        SectionNutrition,
        SectionPersonal,
        SectionPower
    } from '$lib/domain/settings/components'
    import { PROFILE_VALUES } from '$lib/domain/settings/constants'
    import { Button } from '$lib/domain/ui/button'

    type Props = { data: PageData }
    const { data }: Props = $props()

    const FORM_ID = 'settings'

    let saving = $state(false)
    // svelte-ignore state_referenced_locally
    let fullName = $state(data.athlete.full_name ?? '')
    // svelte-ignore state_referenced_locally
    let sex = $state(data.athlete.sex ?? '')
    // svelte-ignore state_referenced_locally
    let height = $state(data.athlete.height_cm ?? undefined)
    // svelte-ignore state_referenced_locally
    let weight = $state(data.athlete.weight_kg ?? undefined)

    // svelte-ignore state_referenced_locally
    let ftp = $state(data.athlete.ftp ?? undefined)

    // svelte-ignore state_referenced_locally
    let hrRest = $state(data.athlete.hr_rest ?? undefined)
    // svelte-ignore state_referenced_locally
    let hrMax = $state(data.athlete.hr_max ?? undefined)

    // svelte-ignore state_referenced_locally
    let maxCarbIntake = $state(data.athlete.max_carb_intake_g_per_hr ?? PROFILE_VALUES.maxCarbIntake.default)

    const onSubmitForm: SubmitFunction = () => {
        saving = true
        return async ({ update }) => {
            await update()
            saving = false
        }
    }
</script>

<PageHeader crumbs={['Settings']}>
    <Button
        class="ml-auto"
        disabled={saving}
        form={FORM_ID}
        size="sm"
    >
        <SaveIcon />
        {saving ? 'Saving...' : 'Save changes'}
    </Button>
</PageHeader>

<PageScrollarea>
    <form
        class="relative mx-auto flex flex-col"
        use:enhance={onSubmitForm}
        id={FORM_ID}
        method="POST"
    >
        <div class="sticky top-0 z-10 flex items-center justify-between border-b bg-background px-6 py-4">
            <h2 class="font-medium">Profile settings</h2>
        </div>

        <div class="divide-y divide-border px-6">
            <SectionPersonal
                bind:fullName
                bind:height
                bind:sex
                bind:weight
                email={data.athlete.email ?? ''}
            />

            <SectionPower bind:ftp bind:weight />

            <SectionHeartRate bind:hrMax bind:hrRest />

            <SectionNutrition bind:maxCarbIntake />
        </div>
    </form>
</PageScrollarea>
