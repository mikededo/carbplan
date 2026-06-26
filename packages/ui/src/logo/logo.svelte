<script lang="ts">
    import type { Icon } from '@lucide/svelte'
    import type { ComponentProps } from 'svelte'

    import { ZapIcon } from '@lucide/svelte'

    type Props = ComponentProps<typeof Icon>
    const { ...props }: Props = $props()
</script>

<ZapIcon {...props} />

