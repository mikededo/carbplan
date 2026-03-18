<script lang="ts">
    import { PageHeader, PageScrollarea, PageSection } from '$lib/domain/layout/components'
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
    <PageSection header="New plan">
        New plan form
    </PageSection>
</PageScrollarea>
