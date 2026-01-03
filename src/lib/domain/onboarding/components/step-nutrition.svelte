<script lang="ts">
    import type { StepThreeData } from '$lib/domain/onboarding/types'

    import { Input } from '$lib/domain/ui/input'
    import { Label } from '$lib/domain/ui/label'

    type Props = Partial<StepThreeData>
    let { maxCarbIntake = $bindable() }: Props = $props()
</script>

<div class="flex flex-col gap-4">
    <div class="flex flex-col gap-2">
        <Label for="maxCarbIntake">Max carb intake (g/hr)</Label>
        <Input
            bind:value={maxCarbIntake}
            id="maxCarbIntake"
            placeholder="60"
            type="number"
        />
        <p class="text-xs text-muted-foreground">
            Most athletes tolerate 60-90g/hr. Start lower if unsure.
        </p>
    </div>
</div>
