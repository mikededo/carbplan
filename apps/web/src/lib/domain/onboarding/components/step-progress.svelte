<script lang="ts">
    import { tv } from 'tailwind-variants'

    import { ONBOARDING_STEPS } from '$lib/domain/onboarding/types'

    type Props = { current: number }
    const { current }: Props = $props()

    const stepClasses = tv({
        base: 'flex h-1 w-full flex-1 items-center justify-center rounded-full text-sm font-medium',
        variants: {
            lt: {
                false: 'bg-muted-foreground/10 text-muted-foreground',
                true: 'border-primary bg-primary text-primary-foreground'
            }
        }
    })
</script>

<div class="mb-2 flex justify-center gap-2">
    {#each ONBOARDING_STEPS as _, i}
        <div class={stepClasses({ lt: i < current })}></div>
    {/each}
</div>

