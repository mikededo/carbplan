<script lang="ts">
    import type { PageData } from './$types'

    import { PageHeader } from '$lib/domain/layout/components'

    type Props = { data: PageData }

    const { data }: Props = $props()
</script>

<PageHeader crumbs={['Dashboard']} />

<p>{JSON.stringify(data.athlete)}</p>
