<script lang="ts">
    import PageHeader from '$lib/domain/layout/components/page-header.svelte'
    import PageScrollarea from '$lib/domain/layout/components/page-scrollarea.svelte'
    import PageSection from '$lib/domain/layout/components/page-section.svelte'
</script>

<svelte:head>
    <title>Creating a new plan... — Kilo</title>
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
