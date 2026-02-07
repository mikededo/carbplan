<script lang="ts">
    import { PageHeader, PageScrollarea } from '$lib/domain/layout/components'
</script>

<PageHeader crumbs={[{ href: '/dashboard', label: 'Dashboard' }, 'Plans']} />

<PageScrollarea>
    <div class="flex flex-col gap-6 p-6">
        <h1>List of plans</h1>
    </div>
</PageScrollarea>
