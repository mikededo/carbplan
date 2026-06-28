<script lang="ts">
    import { Avatar as AvatarPrimitive } from 'bits-ui'

    import { cn } from '../../../utils.js'

    let {
        class: className,
        ref = $bindable(null),
        ...restProps
    }: AvatarPrimitive.FallbackProps = $props()
</script>

<AvatarPrimitive.Fallback
    class={cn('flex size-full items-center justify-center rounded-full bg-muted', className)}
    bind:ref
    data-slot="avatar-fallback"
    {...restProps}
/>
