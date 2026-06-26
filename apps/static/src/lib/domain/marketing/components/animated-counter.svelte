<script lang="ts">
    import { InView } from '$lib/hooks/in-view.svelte'

    type Props = {
        value: number
        duration?: number
        suffix?: string
    }
    const { duration = 2000, suffix = '', value }: Props = $props()

    const inView = new InView({ triggerOnce: true })

    let count = $state(0)
    let hasAnimated = $state(false)

    $effect(() => {
        if (!inView.isInView || hasAnimated) {
            return
        }

        hasAnimated = true
        let startTime: null | number = null

        const animate = (timestamp: number) => {
            if (!startTime) {
                startTime = timestamp
            }

            const progress = Math.min((timestamp - startTime) / duration, 1)
            count = Math.floor(progress * value)

            if (progress < 1) {
                requestAnimationFrame(animate)
            }
        }

        requestAnimationFrame(animate)
    })
</script>

<span bind:this={inView.ref}>
    {count}{suffix}
</span>
