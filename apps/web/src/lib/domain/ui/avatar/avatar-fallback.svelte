<script lang="ts">
    import { Avatar as AvatarPrimitive } from 'bits-ui'

    import { cn } from '$lib/utils.js'

    let {
        class: className,
        ref = $bindable(null),
        ...restProps
    }: AvatarPrimitive.FallbackProps = $props()
</script>

<AvatarPrimitive.Fallback
    class={cn('bg-muted flex size-full items-center justify-center rounded-full', className)}
    bind:ref
    data-slot="avatar-fallback"
    {...restProps}
/>
