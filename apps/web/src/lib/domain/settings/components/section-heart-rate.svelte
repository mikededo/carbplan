<script lang="ts">

    import type { Athlete } from '$lib/database/types.g'
    import type { HRZoneModel, HRZonesData } from '$lib/domain/zones/hr/schemas'

    import { HeartIcon, HeartPlusIcon, HeartPulseIcon, LoaderCircleIcon } from '@lucide/svelte'

    import { PROFILE_VALUES } from '$lib/domain/settings/constants'
    import { Button } from '$lib/domain/ui/button'
    import { Input } from '$lib/domain/ui/input'
    import { Label } from '$lib/domain/ui/label'
    import { HRZonesCard } from '$lib/domain/zones/hr/components'
    import { createAthleteHRZonesMutation } from '$lib/domain/zones/hr/queries'

    import MetricCard from './metric-card.svelte'
    import SettingsSectionGroup from './settings-section-group.svelte'
    import SettingsSection from './settings-section.svelte'

    type Props = {
        athleteId?: Athlete['id']
        hrMax?: number
        hrRest?: number
        hrZones?: HRZonesData
    }
    let {
        athleteId,
        hrMax = $bindable(),
        hrRest = $bindable(),
        hrZones: initialHRZones
    }: Props = $props()

    // svelte-ignore state_referenced_locally
    let hrZones = $state<HRZonesData | undefined>(initialHRZones)

    const mutate = $derived(createAthleteHRZonesMutation(athleteId))

    const onModelChange = (data: HRZonesData) => {
        hrZones = data
    }

    const onSaveZones = () => {
        if (!hrZones || !mutate) {
            return
        }

        // TODO: Show confirmation/toast
        mutate.mutate(hrZones)
    }

    $effect(() => {
        hrZones = initialHRZones
    })
</script>

<SettingsSection
    description="Used for estimating training stress and recovery."
    title="Heart rate data"
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

    <hr class="bg-muted" />

    <!-- TODO: Cleanup custom model -->
    <!-- TODO: Add pending state when no athleteId -->
    <HRZonesCard
        model={hrZones?.model as Exclude<HRZoneModel, 'custom'> | undefined}
        {hrMax}
        {hrRest}
        onHRZonesChange={onModelChange}
    />

    <div class="-mt-2 flex">
        <Button
            class="ml-auto"
            disabled={mutate?.isPending}
            size="sm"
            variant="secondary"
            onclick={onSaveZones}
        >
            {#if mutate?.isPending}
                <LoaderCircleIcon class="animate-spin" />
            {:else}
                <HeartIcon />
            {/if}
            Save zones
        </Button>
    </div>
</SettingsSection>
