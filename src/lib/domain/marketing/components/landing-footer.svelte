<script lang="ts">
    import { ROUTES } from '$lib/constants/routes'
    import { Logo } from '$lib/domain/ui/logo'

    import { FOOTER_LINKS } from '../constants'
</script>

<footer class="border-t border-border px-6 py-12">
    <div class="mx-auto max-w-6xl">
        <div class="grid gap-8 md:grid-cols-3">
            <div class="space-y-4">
                <a class="flex items-center gap-2" href={ROUTES.landing}>
                    <div class="flex size-8 items-center justify-center rounded-lg bg-primary">
                        <Logo class="size-5 text-primary-foreground" />
                    </div>
                    <span class="font-bold">CarbPlan</span>
                </a>
                <p class="text-sm text-muted-foreground">
                    Precision nutrition planning for endurance athletes.
                </p>
            </div>

            <div>
                <h4 class="mb-4 font-semibold">Product</h4>
                <ul class="space-y-2 text-sm text-muted-foreground">
                    {#each FOOTER_LINKS.product as link (link.label)}
                        <li>
                            <a class="transition-colors hover:text-foreground" href={link.href}>
                                {link.label}
                            </a>
                        </li>
                    {/each}
                </ul>
            </div>

            <div>
                <h4 class="mb-4 font-semibold">Legal</h4>
                <ul class="space-y-2 text-sm text-muted-foreground">
                    {#each FOOTER_LINKS.legal as link (link.label)}
                        <li>
                            <a class="transition-colors hover:text-foreground" href={link.href}>
                                {link.label}
                            </a>
                        </li>
                    {/each}
                </ul>
            </div>
        </div>

        <div class="mt-12 border-t border-border pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} CarbPlan. All rights reserved.</p>
        </div>
    </div>
</footer>
