<script lang="ts" module>
    type LinkCrumb = { href: string, label: string }
    export type Crumb = LinkCrumb | string
</script>

<script lang="ts">
    import type { Snippet } from 'svelte'

    import {
        Breadcrumb,
        BreadcrumbItem,
        BreadcrumbLink,
        BreadcrumbList,
        BreadcrumbPage,
        BreadcrumbSeparator
    } from '$lib/domain/ui/breadcrumb'
    import { Separator } from '$lib/domain/ui/separator'
    import * as Sidebar from '$lib/domain/ui/sidebar'

    type Props = {
        crumbs: Crumb[]
        actions?: Snippet
        children?: Snippet
    }
    const { actions, children, crumbs }: Props = $props()

    const isLink = (crumb: Crumb): crumb is LinkCrumb => typeof crumb !== 'string'
</script>

<header
    class="flex h-16 w-full shrink-0 items-center gap-2 border-b transition-[width,height] ease-out group-has-data-[collapsible=icon]/sidebar-wrapper:h-12"
>
    <div class="flex w-full items-center gap-2 px-4">
        <Sidebar.Trigger class="-ms-1" />
        <Separator class="me-2 data-[orientation=vertical]:h-4" orientation="vertical" />
        <Breadcrumb>
            <BreadcrumbList>
                {#each crumbs as crumb, i (i)}
                    {#if i > 0}
                        <BreadcrumbSeparator class="hidden md:block" />
                    {/if}
                    <BreadcrumbItem class="hidden md:block">
                        {#if isLink(crumb)}
                            <BreadcrumbLink href={crumb.href}>{crumb.label}</BreadcrumbLink>
                        {:else if i === crumbs.length - 1}
                            <BreadcrumbPage>{crumb}</BreadcrumbPage>
                        {:else}
                            {crumb}
                        {/if}
                    </BreadcrumbItem>
                {/each}
            </BreadcrumbList>
        </Breadcrumb>

        {#if actions}
            <div class="ml-auto flex items-center gap-2">
                {@render actions()}
            </div>
        {/if}

        {@render children?.()}
    </div>
</header>

