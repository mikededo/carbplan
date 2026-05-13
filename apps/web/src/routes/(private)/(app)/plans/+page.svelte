<script lang="ts">
    import PageHeader from '$lib/domain/layout/components/page-header.svelte'
    import PageScrollarea from '$lib/domain/layout/components/page-scrollarea.svelte'
    import PageSection from '$lib/domain/layout/components/page-section.svelte'
</script>

<PageHeader crumbs={[{ href: '/dashboard', label: 'Dashboard' }, 'Plans']} />

<PageScrollarea>
    <PageSection header="Your plans">
        List of plans
    </PageSection>
</PageScrollarea>
