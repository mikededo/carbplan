<script lang="ts">
    import { PageHeader, PageScrollarea } from '$lib/domain/layout/components'
</script>

<svelte:head>
    <title>Creating a new plan... — CarbPlan</title>
</svelte:head>

<PageHeader
    crumbs={[
        { href: '/dashboard', label: 'Dashboard' },
        { href: '/plans', label: 'Plans' },
        'New plan'
    ]}
/>

<PageScrollarea>
    <div class="flex flex-col gap-6 p-6">
        new plan
    </div>
</PageScrollarea>
