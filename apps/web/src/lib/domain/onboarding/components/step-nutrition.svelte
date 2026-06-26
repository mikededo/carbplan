<script lang="ts">
    import type { StepThreeData } from '$lib/domain/onboarding/types'

    import { PROFILE_FIELD_CONSTRAINTS } from '@carbplan/domain/profile'
    import { Label } from '@carbplan/ui/label'
    import { Slider } from '@carbplan/ui/slider'

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
            max={PROFILE_FIELD_CONSTRAINTS.maxCarbIntake.max}
            min={PROFILE_FIELD_CONSTRAINTS.maxCarbIntake.min}
            step={PROFILE_FIELD_CONSTRAINTS.maxCarbIntake.step}
            type="single"
        />
        <p class="text-xs text-muted-foreground">
            Most athletes tolerate 60-90g/hr. Start lower if unsure.
        </p>
    </div>
</div>
