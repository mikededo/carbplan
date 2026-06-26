<script lang="ts">
    import { PROFILE_FIELD_CONSTRAINTS, SexEnum } from '@carbplan/domain/profile'
    import { Input } from '@carbplan/ui/input'
    import { Label } from '@carbplan/ui/label'
    import { RadioGroupItem, RadioGroupRoot } from '@carbplan/ui/radio-group'

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
            <RadioGroupRoot class="flex gap-4" bind:value={sex} name="sex">
                <div class="flex items-center gap-2">
                    <RadioGroupItem id="male" value={SexEnum.male} />
                    <Label class="cursor-pointer font-normal" for="male">Male</Label>
                </div>
                <div class="flex items-center gap-2">
                    <RadioGroupItem id="female" value={SexEnum.female} />
                    <Label class="cursor-pointer font-normal" for="female">Female</Label>
                </div>
            </RadioGroupRoot>
        </div>
    </SettingsSectionGroup>

    <SettingsSectionGroup>
        <div class="space-y-2">
            <Label for="height">Height (cm)</Label>
            <Input
                bind:value={height}
                id="height"
                max={PROFILE_FIELD_CONSTRAINTS.height.max}
                min={PROFILE_FIELD_CONSTRAINTS.height.min}
                name="height"
                type="number"
            />
        </div>
        <div class="space-y-2">
            <Label for="weight">Weight (kg)</Label>
            <Input
                bind:value={weight}
                id="weight"
                max={PROFILE_FIELD_CONSTRAINTS.weight.max}
                min={PROFILE_FIELD_CONSTRAINTS.weight.min}
                name="weight"
                step="0.1"
                type="number"
            />
        </div>
    </SettingsSectionGroup>
</SettingsSection>
