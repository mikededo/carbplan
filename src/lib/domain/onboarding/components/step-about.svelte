<script lang="ts">
    import type { StepOneData } from '$lib/domain/onboarding/types'

    import { Input } from '$lib/domain/ui/input'
    import { Label } from '$lib/domain/ui/label'
    import { RadioGroup, RadioGroupItem } from '$lib/domain/ui/radio-group'

    type Props = {
        // Allow sex to be an empty string since radiogroup expects the binded
        // value not to be undefined
        sex?: '' | StepOneData['sex']
    } & Omit<Partial<StepOneData>, 'sex'>
    let {
        fullName = $bindable(),
        height = $bindable(),
        sex = $bindable(''),
        weight = $bindable()
    }: Props = $props()
</script>

<div class="flex flex-col gap-4">
    <div class="flex flex-col gap-2">
        <Label for="fullName">Full name</Label>
        <Input
            bind:value={fullName}
            id="fullName"
            placeholder="John Doe"
            type="text"
            required
        />
    </div>

    <div class="flex flex-col gap-2">
        <Label>Sex</Label>
        <RadioGroup bind:value={sex}>
            <div class="flex gap-4">
                <div class="flex items-center gap-2">
                    <RadioGroupItem id="male" value="male" />
                    <Label class="font-normal" for="male">Male</Label>
                </div>
                <div class="flex items-center gap-2">
                    <RadioGroupItem id="female" value="female" />
                    <Label class="font-normal" for="female">Female</Label>
                </div>
            </div>
        </RadioGroup>
    </div>

    <div class="grid grid-cols-2 gap-4">
        <div class="flex flex-col gap-2">
            <Label for="height">Height (cm)</Label>
            <Input
                bind:value={height}
                id="height"
                placeholder="175"
                type="number"
                required
            />
        </div>
        <div class="flex flex-col gap-2">
            <Label for="weight">Weight (kg)</Label>
            <Input
                bind:value={weight}
                id="weight"
                placeholder="70"
                step="0.1"
                type="number"
                required
            />
        </div>
    </div>
</div>

