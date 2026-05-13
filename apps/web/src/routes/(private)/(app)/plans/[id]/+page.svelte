<script lang="ts">
    import type { PageProps } from './$types'

    import PageHeader from '$lib/domain/layout/components/page-header.svelte'
    import PageScrollarea from '$lib/domain/layout/components/page-scrollarea.svelte'
    import PageSection from '$lib/domain/layout/components/page-section.svelte'

    const { params }: PageProps = $props()
</script>

<PageHeader
    crumbs={[
        { href: '/dashboard', label: 'Dashboard' },
        { href: '/plans', label: 'Plans' }
    // TODO: Fill with plan name
    ]}
/>

<PageScrollarea>
    <PageSection header={params.id}>
        {params.id}
    </PageSection>
</PageScrollarea>
