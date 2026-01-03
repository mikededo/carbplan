<script lang="ts">
    import type { SubmitFunction } from '@sveltejs/kit'

    import type { ActionData, PageData } from './$types'

    import { CircleCheckBigIcon, MoveLeftIcon, MoveRightIcon } from '@lucide/svelte'
    import { sineOut } from 'svelte/easing'
    import { fade } from 'svelte/transition'

    import { enhance } from '$app/forms'
    import {
        StepAbout,
        StepNutrition,
        StepProgress,
        StepTraining
    } from '$lib/domain/onboarding/components'
    import { ONBOARDING_VALUES } from '$lib/domain/onboarding/constants'
    import { ONBOARDING_STEPS } from '$lib/domain/onboarding/types'
    import { Button } from '$lib/domain/ui/button'
    import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '$lib/domain/ui/card'

    type Props = { data: PageData, form: ActionData }
    const { data, form }: Props = $props()

    const STEP_DESCRIPTIONS = [
        'Let\'s start with some basic information',
        'These help us estimate your energy needs (optional)',
        'Set your nutrition preferences (optional)'
    ] as const

    let step = $state(data.previous?.step ?? 0)
    const formData = $state({
        ftp: data.previous?.ftp,
        fullName: data.previous?.fullName,
        height: data.previous?.height,
        hrMax: data.previous?.hrMax,
        hrRest: data.previous?.hrRest,
        maxCarbIntake: data.previous?.maxCarbIntake ?? ONBOARDING_VALUES.maxCarbIntake.default,
        sex: data.previous?.sex ?? ('' as const),
        weight: data.previous?.weight
    })

    const canProceedStepZero = $derived(
        formData.fullName?.trim() !== '' &&
        formData.sex &&
        formData.height &&
        formData.weight
    )

    const onBack = () => {
        step--
    }

    const onSave: SubmitFunction = () => async ({ update }) => {
        step++
        await update()
    }
</script>

<main class="mx-auto flex min-h-screen justify-center bg-muted px-4">
    <div class="flex w-full max-w-lg flex-col items-center justify-center gap-4">
        <h1 class="text-2xl font-semibold">Welcome!</h1>

        <Card class="w-full">
            <CardHeader>
                <StepProgress current={step} />
                {#key step}
                    <div in:fade={{ duration: 250, easing: sineOut }}>
                        <CardTitle>{ONBOARDING_STEPS[step]}</CardTitle>
                        <CardDescription>{STEP_DESCRIPTIONS[step]}</CardDescription>
                    </div>
                {/key}
            </CardHeader>
            {#key step}
                <div in:fade={{ duration: 250, easing: sineOut }}>
                    <CardContent>
                        {#if form?.message}
                            <p class="mb-4 text-sm text-destructive">{form.message}</p>
                        {/if}

                        {@render content()}
                    </CardContent>
                </div>
            {/key}

            <CardFooter>
                {@render footer()}
            </CardFooter>
        </Card>
    </div>
</main>

{#snippet content()}
    {#if step === 0}
        <StepAbout
            bind:fullName={formData.fullName}
            bind:height={formData.height}
            bind:sex={formData.sex}
            bind:weight={formData.weight}
        />
    {:else if step === 1}
        <StepTraining
            bind:ftp={formData.ftp}
            bind:hrMax={formData.hrMax}
            bind:hrRest={formData.hrRest}
        />
    {:else}
        <StepNutrition
            bind:maxCarbIntake={formData.maxCarbIntake}
        />
    {/if}
{/snippet}

{#snippet footer()}
    {#if step > 0}
        <Button variant="ghost" onclick={onBack}>
            <MoveLeftIcon />
            Back
        </Button>
    {/if}

    {#if step < ONBOARDING_STEPS.length - 1}
        <form
            class="ml-auto"
            use:enhance={onSave}
            action="?/save"
            method="POST"
        >
            <input name="step" type="hidden" value={step + 1} />
            <input name="data" type="hidden" value={JSON.stringify(formData)} />
            <Button
                disabled={step === 0 && !canProceedStepZero}
                type="submit"
            >
                Next
                <MoveRightIcon />
            </Button>
        </form>
    {:else}
        <form
            class="ml-auto"
            use:enhance
            action="?/complete"
            method="POST"
        >
            <input name="data" type="hidden" value={JSON.stringify(formData)} />
            <Button type="submit">
                Complete
                <CircleCheckBigIcon />
            </Button>
        </form>
    {/if}
{/snippet}
