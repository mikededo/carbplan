<script lang="ts">
    import type { StepTwoData } from '$lib/domain/onboarding/types'

    import { Input } from '$lib/domain/ui/input'
    import { Label } from '$lib/domain/ui/label'

    type Props = Partial<StepTwoData>
    let {
        ftp = $bindable(),
        hrMax = $bindable(),
        hrRest = $bindable()
    }: Props = $props()
</script>

<div class="flex flex-col gap-4">
    <div class="flex flex-col gap-2">
        <Label for="ftp">FTP (watts)</Label>
        <Input
            bind:value={ftp}
            id="ftp"
            placeholder="250"
            type="number"
        />
        <p class="text-xs text-muted-foreground">
            Functional Threshold Power - your max sustainable power for 1 hour
        </p>
    </div>

    <div class="grid grid-cols-2 gap-4">
        <div class="flex flex-col gap-2">
            <Label for="hrRest">Resting HR (bpm)</Label>
            <Input
                bind:value={hrRest}
                id="hrRest"
                placeholder="60"
                type="number"
            />
        </div>
        <div class="flex flex-col gap-2">
            <Label for="hrMax">Max HR (bpm)</Label>
            <Input
                bind:value={hrMax}
                id="hrMax"
                placeholder="185"
                type="number"
            />
        </div>
    </div>
</div>
