<script lang="ts">
    import { Avatar as AvatarPrimitive } from 'bits-ui'

    import { cn } from '$lib/utils.js'

    let {
        class: className,
        loadingStatus = $bindable('loading'),
        ref = $bindable(null),
        ...restProps
    }: AvatarPrimitive.RootProps = $props()
</script>

<AvatarPrimitive.Root
    class={cn('relative flex size-8 shrink-0 overflow-hidden rounded-full', className)}
    bind:loadingStatus
    bind:ref
    data-slot="avatar"
    {...restProps}
/>
