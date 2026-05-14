<script lang="ts">
    import type { AthleteId } from '@carbplan/domain/athlete'
    import type { PowerZoneModel, PowerZonesData } from '@carbplan/domain/power'
    import type { Maybe } from '@carbplan/domain/utils'

    import { PROFILE_FIELD_CONSTRAINTS } from '@carbplan/domain/profile'
    import { ActivityIcon, BatteryFullIcon, BatteryLowIcon, LoaderCircleIcon, ZapIcon } from '@lucide/svelte'

    import Button from '$lib/domain/ui/button/button.svelte'
    import Input from '$lib/domain/ui/input/input.svelte'
    import Label from '$lib/domain/ui/label/label.svelte'
    import PowerZonesCard from '$lib/domain/zones/power/components/power-zones-card.svelte'
    import { createAthletePowerZonesMutation } from '$lib/domain/zones/power/queries/use-mutate-power-zones'

    import MetricCard from './metric-card.svelte'
    import SettingsSectionGroup from './settings-section-group.svelte'
    import SettingsSection from './settings-section.svelte'

    type Props = {
        athleteId?: AthleteId
        ftp?: number
        powerZones?: Maybe<PowerZonesData>
        weight?: number
    }
    let {
        athleteId,
        ftp = $bindable(),
        powerZones: initialPowerZones,
        weight = $bindable()
    }: Props = $props()

    let powerZones = $derived<Maybe<PowerZonesData>>(initialPowerZones)
    const mutate = $derived(createAthletePowerZonesMutation(athleteId))

    const onModelChange = (data: PowerZonesData) => {
        powerZones = data
    }

    const onSaveZones = () => {
        if (!powerZones || !mutate) {
            return
        }

        // TODO: Show confirmation/toast
        mutate.mutate(powerZones)
    }

    $effect(() => {
        powerZones = initialPowerZones
    })
</script>

<SettingsSection
    description="Your cycling power metrics for intensity calculations."
    title="Power data"
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
            max={PROFILE_FIELD_CONSTRAINTS.ftp.max}
            min={PROFILE_FIELD_CONSTRAINTS.ftp.min}
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

    <hr class="bg-muted" />

    <!-- TODO: Cleanup custom model -->
    <!-- TODO: Add pending state when no athleteId -->
    <PowerZonesCard
        model={powerZones?.model as Exclude<PowerZoneModel, 'custom'> | undefined}
        {ftp}
        onPowerZonesChange={onModelChange}
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
                <ActivityIcon />
            {/if}
            Save zones
        </Button>
    </div>
</SettingsSection>
