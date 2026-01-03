<script lang="ts">
    import type { Snippet } from 'svelte'

    import type { LayoutData } from './$types'

    import { AppSidebar } from '$lib/domain/layout/components'
    import * as Sidebar from '$lib/domain/ui/sidebar'

    type Props = { children: Snippet, data: LayoutData }
    const { children, data }: Props = $props()
</script>

<Sidebar.Provider>
    <AppSidebar athlete={data.athlete} />
    <Sidebar.Inset>
        {@render children()}
    </Sidebar.Inset>
</Sidebar.Provider>

