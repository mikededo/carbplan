<script lang="ts">
    import { ChevronRightIcon } from '@lucide/svelte'

    import { Badge } from '$lib/domain/ui/badge'

    type Props = {
        isVisible: boolean
    }
    const { isVisible }: Props = $props()

    const stats = [
        { color: 'bg-blue-400/70', label: 'Carbs', max: 60, unit: 'g', value: 45 },
        { color: 'bg-amber-400/70', label: 'Sodium', max: 500, unit: 'mg', value: 320 },
        { color: 'bg-emerald-400/70', label: 'Caffeine', max: 200, unit: 'mg', value: 100 }
    ]

    const brands = [
        { brand: 'Maurten', color: 'bg-slate-500', products: 12, specialty: 'Hydrogel Tech' },
        { brand: 'SIS', color: 'bg-rose-400', products: 24, specialty: 'Electrolytes' },
        { brand: 'Precision Fuel', color: 'bg-sky-400', products: 18, specialty: 'Sweat Testing' },
        { brand: 'Skratch Labs', color: 'bg-emerald-400', products: 15, specialty: 'Real Food' }
    ]

    const filters = ['Gels', 'Bars', 'Drinks', 'Chews', 'Caffeine']
</script>

<div class="overflow-hidden rounded-xl bg-accent shadow-2xl">
    <span class="block pt-2 pb-1.5 pl-3 text-sm font-semibold uppercase">Supplements</span>

    <div class="rounded-xl border border-border bg-card">
        <div class="space-y-5 p-6">
            <div class="flex items-center justify-between">
                <span class="text-sm font-medium">Product Database</span>
                <Badge class="text-xs" variant="secondary">250+ products</Badge>
            </div>

            <div class="grid grid-cols-3 gap-3">
                {#each stats as stat, i (stat.label)}
                    <div
                        class="text-center transition-all duration-500"
                        style="opacity: {isVisible ? 1 : 0}; transform: translateY({isVisible
                            ? 0
                            : 10}px); transition-delay: {i * 100}ms;"
                    >
                        <div class="relative mb-2 h-20 w-full overflow-hidden rounded-lg bg-muted">
                            <div
                                class="absolute inset-x-0 bottom-0 transition-all duration-1000 {stat.color}"
                                style="height: {isVisible
                                    ? `${(stat.value / stat.max) * 100}%`
                                    : '0%'}; transition-delay: {i * 150}ms;"
                            ></div>
                            <div class="absolute inset-0 flex items-center justify-center">
                                <span class="text-lg font-bold">
                                    {stat.value}
                                    <span class="text-xs text-muted-foreground">{stat.unit}</span>
                                </span>
                            </div>
                        </div>
                        <span class="text-xs text-muted-foreground">{stat.label}</span>
                    </div>
                {/each}
            </div>

            <div class="space-y-2">
                {#each brands as brand, i (brand.brand)}
                    <div
                        class="group flex cursor-pointer items-center justify-between rounded-lg bg-muted/50 p-3 transition-all duration-300 hover:bg-muted"
                        style="opacity: {isVisible ? 1 : 0}; transform: translateX({isVisible
                            ? 0
                            : 20}px); transition-delay: {i * 100 + 200}ms;"
                    >
                        <div class="flex items-center gap-3">
                            <div
                                class="flex size-10 items-center justify-center rounded-lg text-sm font-bold text-white shadow-sm {brand.color}"
                            >
                                {brand.brand[0]}
                            </div>
                            <div>
                                <p class="text-sm font-medium">{brand.brand}</p>
                                <p class="text-xs text-muted-foreground">{brand.specialty}</p>
                            </div>
                        </div>
                        <div class="flex items-center gap-2">
                            <span class="text-sm text-muted-foreground">{brand.products}</span>
                            <ChevronRightIcon
                                class="size-4 text-muted-foreground transition-transform group-hover:translate-x-1"
                            />
                        </div>
                    </div>
                {/each}
            </div>

            <div class="flex flex-wrap gap-2">
                {#each filters as filter, i (filter)}
                    <Badge
                        class="cursor-pointer transition-all duration-300 hover:scale-105"
                        style="opacity: {isVisible ? 1 : 0}; transition-delay: {i * 50 + 400}ms;"
                        variant={i === 0 ? 'default' : 'outline'}
                    >
                        {filter}
                    </Badge>
                {/each}
            </div>
        </div>
    </div>
</div>
