<script lang="ts">
    import { Button } from '@kilo/ui/button'
    import { Logo } from '@kilo/ui/logo'
    import {
        NavigationMenuContent,
        NavigationMenuItem,
        NavigationMenuLink,
        NavigationMenuList,
        NavigationMenuRoot,
        NavigationMenuTrigger
    } from '@kilo/ui/navigation-menu'
    import { CalculatorIcon } from '@lucide/svelte'

    import { resolve } from '$app/paths'
    import { ROUTES } from '$lib/constants/routes'
    import { m } from '$lib/domain/i18n/messages.js'
    import { STATIC_TOOLS } from '$lib/domain/tools/tools'

    const featuredTools = STATIC_TOOLS.filter((tool) => tool.featured)
</script>

<nav class="fixed inset-x-0 top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
    <div class="mx-auto grid h-16 max-w-6xl grid-cols-2 items-center justify-between px-6 md:grid-cols-3">
        <a class="flex items-center gap-2" href={resolve(ROUTES.landing)}>
            <div class="flex size-8 items-center justify-center rounded-lg bg-primary">
                <Logo class="size-5 text-primary-foreground" />
            </div>
            <span class="text-lg font-bold">Kilo</span>
        </a>

        <NavigationMenuRoot class="hidden justify-self-center md:flex" viewport={false}>
            <NavigationMenuList class="gap-2">
                <NavigationMenuItem>
                    <NavigationMenuLink
                        href={resolve(`${ROUTES.landing}#features`)}
                    >
                        {m.nav_features()}
                    </NavigationMenuLink>
                </NavigationMenuItem>

                <NavigationMenuItem>
                    <NavigationMenuTrigger>
                        {m.nav_tools()}
                    </NavigationMenuTrigger>

                    <NavigationMenuContent class="-translate-x-2/5 p-0">
                        <div class="grid grid-cols-[0.75fr_1fr]">
                            <div class="flex w-50 flex-col gap-2 border-r border-border bg-muted/50 p-3">
                                <div class="mr-auto rounded-lg border bg-white p-2">
                                    <CalculatorIcon class="size-3" />
                                </div>
                                <Button class="mr-auto text-sm font-semibold text-foreground" href={resolve(ROUTES.tools)} variant="link">
                                    {m.nav_tools_title()}
                                </Button>
                                <p class="text-xs text-muted-foreground">
                                    {m.nav_tools_description()}
                                </p>

                                <Button
                                    class="mt-auto mr-auto h-auto p-0 text-xs"
                                    href={ROUTES.auth.signup}
                                    variant="link"
                                >
                                    {m.nav_tools_cta()}
                                </Button>
                            </div>

                            <ul class="grid w-md grid-cols-2 gap-1.5 p-2">
                                {#each featuredTools as tool (tool.id)}
                                    <li>
                                        <NavigationMenuLink class="rounded-md p-1.5" href={resolve(ROUTES.tools)}>
                                            <p class="flex items-center gap-2 text-foreground">
                                                <tool.Icon class="size-4 text-primary" />
                                                {tool.title}
                                            </p>
                                            <p class="line-clamp-2 text-xs text-kilo-gray-500">
                                                {tool.description}
                                            </p>
                                        </NavigationMenuLink>
                                    </li>
                                {/each}
                            </ul>

                        </div>
                    </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                    <NavigationMenuLink href={resolve(`${ROUTES.landing}#product`)}>
                        {m.nav_product()}
                    </NavigationMenuLink>
                </NavigationMenuItem>

                <NavigationMenuItem>
                    <NavigationMenuLink href={resolve(`${ROUTES.landing}#pricing`)}>
                        {m.nav_pricing()}
                    </NavigationMenuLink>
                </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenuRoot>

        <div class="flex items-center justify-end gap-3">
            <Button href={ROUTES.auth.signin} size="sm" variant="ghost">{m.nav_sign_in()}</Button>
            <Button href={ROUTES.auth.signup} size="sm">{m.nav_get_started()}</Button>
        </div>
    </div>
</nav>
