<script lang="ts">
    import type { Icon } from '@lucide/svelte'
    import type { ComponentProps } from 'svelte'

    import { SquareChartGanttIcon } from '@lucide/svelte'

    type Props = ComponentProps<typeof Icon>
    const { ...props }: Props = $props()
</script>

<SquareChartGanttIcon {...props} />

