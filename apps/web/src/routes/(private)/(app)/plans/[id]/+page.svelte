<script lang="ts">
    import type { PageProps } from './$types'

    import { PageHeader, PageScrollarea, PageSection } from '$lib/domain/layout/components'

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
