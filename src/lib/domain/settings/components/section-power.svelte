<script lang="ts">
    import { BatteryFullIcon, BatteryLowIcon, ZapIcon } from '@lucide/svelte'
    import ActivityIcon from '@lucide/svelte/icons/activity'

    import { PROFILE_VALUES } from '$lib/domain/settings/constants'
    import { Input } from '$lib/domain/ui/input'
    import { Label } from '$lib/domain/ui/label'

    import MetricCard from './metric-card.svelte'
    import SettingsSectionGroup from './settings-section-group.svelte'
    import SettingsSection from './settings-section.svelte'
    import ZonesPlaceholder from './zones-placeholder.svelte'

    type Props = {
        ftp: number | undefined
        weight: number | undefined
    }
    let { ftp = $bindable(), weight = $bindable() }: Props = $props()
</script>

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

