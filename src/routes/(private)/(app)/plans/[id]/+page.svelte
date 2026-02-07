<script lang="ts">
    import type { PageProps } from './$types'

    import { PageHeader, PageScrollarea } from '$lib/domain/layout/components'

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
    <div class="flex flex-col gap-6 p-6">
        {params.id}
    </div>
</PageScrollarea>
