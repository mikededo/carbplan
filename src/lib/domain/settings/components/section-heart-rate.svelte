<script lang="ts">
    import { HeartPlusIcon, HeartPulseIcon } from '@lucide/svelte'
    import HeartIcon from '@lucide/svelte/icons/heart'

    import { PROFILE_VALUES } from '$lib/domain/settings/constants'
    import { Input } from '$lib/domain/ui/input'
    import { Label } from '$lib/domain/ui/label'

    import MetricCard from './metric-card.svelte'
    import SettingsSectionGroup from './settings-section-group.svelte'
    import SettingsSection from './settings-section.svelte'
    import ZonesPlaceholder from './zones-placeholder.svelte'

    type Props = {
        hrMax: number | undefined
        hrRest: number | undefined
    }
    let { hrMax = $bindable(), hrRest = $bindable() }: Props = $props()
</script>

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

