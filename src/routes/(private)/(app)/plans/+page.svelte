<script lang="ts">
    import { PageHeader, PageScrollarea, PageSection } from '$lib/domain/layout/components'
</script>

<PageHeader crumbs={[{ href: '/dashboard', label: 'Dashboard' }, 'Plans']} />

<PageScrollarea>
    <PageSection header="Your plans">
        List of plans
    </PageSection>
</PageScrollarea>
