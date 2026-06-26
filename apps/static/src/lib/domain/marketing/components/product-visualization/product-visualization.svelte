<script lang="ts">
    import DashboardViz from './dashboard-viz.svelte'
    import PlannerViz from './planner-viz.svelte'
    import SupplementsViz from './supplements-viz.svelte'

    type Props = {
        isVisible: boolean
        type: 'dashboard' | 'planner' | 'supplements'
    }
    const { isVisible, type }: Props = $props()

    const translateY = $derived(isVisible ? 0 : 20)
    const opacity = $derived(isVisible ? 1 : 0)
    const scale = $derived(isVisible ? 1 : 0.95)
</script>

<div
    class="relative transition-all duration-700 ease-out"
    style="transform: translateY({translateY}px) scale({scale}); opacity: {opacity};"
>
    {#if type === 'dashboard'}
        <DashboardViz {isVisible} />
    {:else if type === 'planner'}
        <PlannerViz {isVisible} />
    {:else if type === 'supplements'}
        <SupplementsViz {isVisible} />
    {/if}
</div>
