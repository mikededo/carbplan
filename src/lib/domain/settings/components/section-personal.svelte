<script lang="ts">
    import { PROFILE_VALUES } from '$lib/domain/settings/constants'
    import { Input } from '$lib/domain/ui/input'
    import { Label } from '$lib/domain/ui/label'
    import * as RadioGroup from '$lib/domain/ui/radio-group'

    import SettingsSectionGroup from './settings-section-group.svelte'
    import SettingsSection from './settings-section.svelte'

    type Props = {
        email: string
        fullName: string
        height: number | undefined
        sex: string
        weight: number | undefined
    }
    let {
        email,
        fullName = $bindable(),
        height = $bindable(),
        sex = $bindable(),
        weight = $bindable()
    }: Props = $props()
</script>

<SettingsSection
    description="Your basic profile details used across the platform."
    title="Personal information"
>
    <SettingsSectionGroup>
        <div class="space-y-2">
            <Label for="fullName">Full Name</Label>
            <Input
                bind:value={fullName}
                id="fullName"
                name="fullName"
                required
            />
        </div>
        <div class="space-y-2">
            <Label>Email</Label>
            <Input value={email} disabled />
            <p class="text-xs text-muted-foreground">Used for login and notifications.</p>
        </div>

        <div class="space-y-3">
            <Label>Sex</Label>
            <RadioGroup.Root class="flex gap-4" bind:value={sex} name="sex">
                <div class="flex items-center gap-2">
                    <RadioGroup.Item id="male" value="male" />
                    <Label class="cursor-pointer font-normal" for="male">Male</Label>
                </div>
                <div class="flex items-center gap-2">
                    <RadioGroup.Item id="female" value="female" />
                    <Label class="cursor-pointer font-normal" for="female">Female</Label>
                </div>
            </RadioGroup.Root>
        </div>
    </SettingsSectionGroup>

    <SettingsSectionGroup>
        <div class="space-y-2">
            <Label for="height">Height (cm)</Label>
            <Input
                bind:value={height}
                id="height"
                max={PROFILE_VALUES.height.max}
                min={PROFILE_VALUES.height.min}
                name="height"
                type="number"
            />
        </div>
        <div class="space-y-2">
            <Label for="weight">Weight (kg)</Label>
            <Input
                bind:value={weight}
                id="weight"
                max={PROFILE_VALUES.weight.max}
                min={PROFILE_VALUES.weight.min}
                name="weight"
                step="0.1"
                type="number"
            />
        </div>
    </SettingsSectionGroup>
</SettingsSection>

