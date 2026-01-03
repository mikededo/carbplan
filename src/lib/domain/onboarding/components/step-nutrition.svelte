<script lang="ts">
    import type { StepThreeData } from '$lib/domain/onboarding/types'

    import { ONBOARDING_VALUES } from '$lib/domain/onboarding/constants'
    import { Label } from '$lib/domain/ui/label'
    import { Slider } from '$lib/domain/ui/slider'

    type Props = Partial<StepThreeData>
    let { maxCarbIntake = $bindable() }: Props = $props()
</script>

<div class="flex flex-col gap-4">
    <div class="flex flex-col gap-3">
        <div class="flex items-center justify-between">
            <Label for="maxCarbIntake">Max carb intake</Label>
            <span class="text-sm font-medium">{maxCarbIntake} g/hr</span>
        </div>
        <Slider
            bind:value={maxCarbIntake}
            id="maxCarbIntake"
            max={ONBOARDING_VALUES.maxCarbIntake.max}
            min={ONBOARDING_VALUES.maxCarbIntake.min}
            step={ONBOARDING_VALUES.maxCarbIntake.step}
            type="single"
        />
        <p class="text-xs text-muted-foreground">
            Most athletes tolerate 60-90g/hr. Start lower if unsure.
        </p>
    </div>
</div>
