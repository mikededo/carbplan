<script lang="ts">
    import { Clock2Icon, Clock3Icon, Clock6Icon, InfoIcon } from '@lucide/svelte'

    import { PROFILE_VALUES } from '$lib/domain/settings/constants'
    import { Alert, AlertDescription, AlertTitle } from '$lib/domain/ui/alert'
    import { Label } from '$lib/domain/ui/label'
    import { Slider } from '$lib/domain/ui/slider'

    import MetricCard from './metric-card.svelte'
    import SettingsSection from './settings-section.svelte'

    type Props = {
        maxCarbIntake: number
    }
    let { maxCarbIntake = $bindable() }: Props = $props()
</script>

<SettingsSection
    description="Configure your fueling limits and ride targets."
    title="Nutrition"
>
    <div class="space-y-4">
        <div class="flex items-center justify-between">
            <div class="space-y-0.5">
                <Label>Max carbohydrate intake</Label>
                <p class="text-sm text-muted-foreground">Based on your gut training level.</p>
            </div>
            <span class="rounded-md bg-accent px-2.5 py-1 text-sm font-medium text-muted-foreground tabular-nums">
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
        <ul class="flex justify-between font-mono text-tiny font-medium text-muted-foreground uppercase">
            <li>Beginner</li>
            <li>Trained</li>
            <li>Well-trained</li>
            <li>Elite</li>
        </ul>
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

