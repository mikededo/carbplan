<script lang="ts">
    import type { SubmitFunction } from '@sveltejs/kit'

    import type { PageData } from './$types'

    import { BatteryFullIcon, BatteryLowIcon, Clock2Icon, Clock3Icon, Clock6Icon, HeartPlusIcon, HeartPulseIcon, InfoIcon, ZapIcon } from '@lucide/svelte'
    import ActivityIcon from '@lucide/svelte/icons/activity'
    import HeartIcon from '@lucide/svelte/icons/heart'
    import SaveIcon from '@lucide/svelte/icons/save'

    import { enhance } from '$app/forms'
    import { PageHeader } from '$lib/domain/layout/components'
    import PageScrollarea from '$lib/domain/layout/components/page-scrollarea.svelte'
    import { MetricCard, SettingsSection, ZonesPlaceholder } from '$lib/domain/settings/components'
    import SettingsSectionGroup from '$lib/domain/settings/components/settings-section-group.svelte'
    import { PROFILE_VALUES } from '$lib/domain/settings/constants'
    import { Alert, AlertDescription, AlertTitle } from '$lib/domain/ui/alert'
    import { Button } from '$lib/domain/ui/button'
    import { Input } from '$lib/domain/ui/input'
    import { Label } from '$lib/domain/ui/label'
    import * as RadioGroup from '$lib/domain/ui/radio-group'
    import { Slider } from '$lib/domain/ui/slider'

    type Props = { data: PageData }
    const { data }: Props = $props()

    const FORM_ID = 'settings'

    let saving = $state(false)

    let fullName = $state(data.athlete.full_name ?? '')
    let sex = $state(data.athlete.sex ?? '')
    let height = $state(data.athlete.height_cm ?? undefined)
    let weight = $state(data.athlete.weight_kg ?? undefined)

    let ftp = $state(data.athlete.ftp ?? undefined)

    let hrRest = $state(data.athlete.hr_rest ?? undefined)
    let hrMax = $state(data.athlete.hr_max ?? undefined)

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
    <Button class="ml-auto"
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
            <SettingsSection
                description="Your basic profile details used across the platform."
                title="Personal Information"
            >
                <SettingsSectionGroup>
                    <div class="space-y-2">
                        <Label for="fullName">Full Name</Label>
                        <Input
                            bind:value={fullName}
                            id="fullName"
                            name="fullName"
                            required
                        />
                    </div>
                    <div class="space-y-2">
                        <Label>Email</Label>
                        <Input value={data.athlete.email ?? ''} disabled />
                        <p class="text-xs text-muted-foreground">Used for login and notifications.</p>
                    </div>

                    <div class="space-y-3">
                        <Label>Sex</Label>
                        <RadioGroup.Root class="flex gap-4" bind:value={sex} name="sex">
                            <div class="flex items-center gap-2">
                                <RadioGroup.Item id="male" value="male" />
                                <Label class="cursor-pointer font-normal" for="male">Male</Label>
                            </div>
                            <div class="flex items-center gap-2">
                                <RadioGroup.Item id="female" value="female" />
                                <Label class="cursor-pointer font-normal" for="female">Female</Label>
                            </div>
                        </RadioGroup.Root>
                    </div>
                </SettingsSectionGroup>

                <SettingsSectionGroup>
                    <div class="space-y-2">
                        <Label for="height">Height (cm)</Label>
                        <Input
                            bind:value={height}
                            id="height"
                            max={PROFILE_VALUES.height.max}
                            min={PROFILE_VALUES.height.min}
                            name="height"
                            type="number"
                        />
                    </div>
                    <div class="space-y-2">
                        <Label for="weight">Weight (kg)</Label>
                        <Input
                            bind:value={weight}
                            id="weight"
                            max={PROFILE_VALUES.weight.max}
                            min={PROFILE_VALUES.weight.min}
                            name="weight"
                            step="0.1"
                            type="number"
                        />
                    </div>
                </SettingsSectionGroup>
            </SettingsSection>

            <SettingsSection
                description="Your cycling power metrics for intensity calculations."
                title="Power Data"
            >
                <div class="space-y-2">
                    <div class="flex items-center justify-between">
                        <Label for="ftp">FTP (Functional Threshold Power)</Label>
                        {#if ftp}
                            <span class="text-sm font-medium">{ftp}W</span>
                        {/if}
                    </div>
                    <Input
                        bind:value={ftp}
                        id="ftp"
                        max={PROFILE_VALUES.ftp.max}
                        min={PROFILE_VALUES.ftp.min}
                        name="ftp"
                        placeholder="Enter your FTP in watts"
                        type="number"
                    />
                    <p class="text-xs text-muted-foreground">
                        The maximum power you can sustain for approximately one hour.
                    </p>
                </div>

                <SettingsSectionGroup class="sm:grid-cols-3">
                    <MetricCard
                        Icon={ZapIcon}
                        label="Power to weight"
                        unit="W/kg"
                        value={ftp && weight ? (ftp / weight).toFixed(2) : '-'}
                    />
                    <MetricCard
                        class="[&_svg]:-rotate-90"
                        Icon={BatteryLowIcon}
                        label="Est. kJ/hour at LT1 (fatmax)"
                        unit="kJ"
                        value={ftp ? Math.round(ftp * 0.7 * 3.6) : '-'}
                    />
                    <MetricCard
                        class="[&_svg]:-rotate-90"
                        Icon={BatteryFullIcon}
                        label="Est. kJ/hour at FTP"
                        unit="kJ"
                        value={ftp ? Math.round(ftp * 3.6) : '-'}
                    />
                </SettingsSectionGroup>

                <ZonesPlaceholder
                    description="Automatically calculated based on your FTP."
                    icon={ActivityIcon}
                    title="Power Zones"
                />
            </SettingsSection>

            <SettingsSection
                description="Used for estimating training stress and recovery."
                title="Heart Rate Data"
            >
                <SettingsSectionGroup>
                    <div class="space-y-2">
                        <Label for="hrRest">Resting Heart Rate</Label>
                        <Input
                            bind:value={hrRest}
                            id="hrRest"
                            max={PROFILE_VALUES.hrRest.max}
                            min={PROFILE_VALUES.hrRest.min}
                            name="hrRest"
                            placeholder="e.g., 50"
                            type="number"
                        />
                    </div>
                    <div class="space-y-2">
                        <Label for="hrMax">Maximum Heart Rate</Label>
                        <Input
                            bind:value={hrMax}
                            id="hrMax"
                            max={PROFILE_VALUES.hrMax.max}
                            min={PROFILE_VALUES.hrMax.min}
                            name="hrMax"
                            placeholder="e.g., 185"
                            type="number"
                        />
                    </div>
                </SettingsSectionGroup>

                <SettingsSectionGroup>
                    <MetricCard
                        Icon={HeartPlusIcon}
                        label="Heart Rate Reserve"
                        unit="bpm"
                        value={hrMax && hrRest ? hrMax - hrRest : '-'}
                    />
                    <MetricCard
                        Icon={HeartPulseIcon}
                        label="Est. Threshold HR (85%)"
                        unit="bpm"
                        value={hrMax && hrRest ? Math.round(hrRest + (hrMax - hrRest) * 0.85) : '-'}
                    />
                </SettingsSectionGroup>

                <ZonesPlaceholder
                    description="Derived from your resting and max HR."
                    icon={HeartIcon}
                    title="Heart Rate Zones"
                />
            </SettingsSection>

            <SettingsSection
                description="Configure your fueling limits and ride targets."
                title="Nutrition Settings"
            >
                <div class="space-y-4">
                    <div class="flex items-center justify-between">
                        <div class="space-y-0.5">
                            <Label>Max Carbohydrate Intake</Label>
                            <p class="text-xs text-muted-foreground">Based on your gut training level.</p>
                        </div>
                        <span class="rounded-md px-2.5 py-1 text-sm font-bold text-primary tabular-nums">
                            {maxCarbIntake}g/hr
                        </span>
                    </div>
                    <input name="maxCarbIntake" type="hidden" value={maxCarbIntake} />
                    <Slider
                        bind:value={maxCarbIntake}
                        max={PROFILE_VALUES.maxCarbIntake.max}
                        min={PROFILE_VALUES.maxCarbIntake.min}
                        step={PROFILE_VALUES.maxCarbIntake.step}
                        type="single"
                    />
                    <div class="flex justify-between text-tiny font-medium tracking-tight text-muted-foreground uppercase">
                        <span>Beginner</span>
                        <span>Trained</span>
                        <span>Well-trained</span>
                        <span>Elite</span>
                    </div>
                </div>

                <Alert variant="info">
                    <InfoIcon />
                    <AlertTitle>About gut training</AlertTitle>
                    <AlertDescription>
                        The gut can be trained to tolerate and absorb more carbohydrates. Elite athletes handle 90-120g/hr using a glucose-fructose mix. Start conservatively.
                    </AlertDescription>
                </Alert>

                <div class="grid grid-cols-3 gap-4">
                    <MetricCard
                        Icon={Clock2Icon}
                        label="2hr Target"
                        unit="g"
                        value={maxCarbIntake * 2}
                    />
                    <MetricCard
                        Icon={Clock3Icon}
                        label="3hr Target"
                        unit="g"
                        value={maxCarbIntake * 3}
                    />
                    <MetricCard
                        Icon={Clock6Icon}
                        label="5hr Target"
                        unit="g"
                        value={maxCarbIntake * 5}
                    />
                </div>
            </SettingsSection>
        </div>
    </form>
</PageScrollarea>
