<script lang="ts">
    type Props = {
        description: string
        Icon: LucideIcon
    }
    const { description, Icon }: Props = $props()
</script>

<div class="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed p-6 text-center">
    <div class="flex size-8 items-center justify-center rounded-full bg-accent">
        <Icon class="size-5 text-muted-foreground" />
    </div>
    <p class="text-sm text-muted-foreground">
        {description}
    </p>
</div>
