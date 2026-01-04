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

