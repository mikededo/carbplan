<script lang="ts">
    import type { Icon } from '@lucide/svelte'

    import {
        CircleCheckIcon,
        CoffeeIcon,
        DropletIcon,
        DumbbellIcon,
        FlameIcon,
        ZapIcon
    } from '@lucide/svelte'

    import { Badge } from '$lib/domain/ui/badge'

    type Props = {
        isVisible: boolean
    }
    const { isVisible }: Props = $props()

    const workoutBars = [40, 60, 55, 80, 95, 75, 85, 70, 90, 60, 75, 85, 55, 65, 45]

    type NutritionItem = {
        carbs: number
        icon: typeof Icon
        name: string
        time: string
    }

    const NUTRITION_ITEMS: NutritionItem[] = [
        { carbs: 25, icon: FlameIcon, name: 'Pre-ride Gel', time: '0:00' },
        { carbs: 45, icon: DropletIcon, name: 'Drink Mix', time: '0:45' },
        { carbs: 40, icon: ZapIcon, name: 'Energy Bar', time: '1:30' },
        { carbs: 25, icon: CoffeeIcon, name: 'Caffeine Gel', time: '2:15' }
    ]

    const getBarColor = (height: number) => {
        if (height < 50) {
            return 'bg-blue-300'
        }
        if (height < 65) {
            return 'bg-green-300'
        }
        if (height < 80) {
            return 'bg-yellow-300'
        }
        return 'bg-orange-300'
    }
</script>

<div class="overflow-hidden rounded-xl bg-accent shadow-2xl">
    <span class="block pt-2 pb-1.5 pl-3 text-sm font-semibold uppercase">Plan Builder</span>

    <div class="rounded-xl border border-border bg-card">
        <div class="space-y-5 p-6">
            <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                    <DumbbellIcon class="size-4 text-primary" />
                    <span class="text-sm font-medium">Workout Profile</span>
                </div>
                <Badge class="text-xs" variant="secondary">4hr Ride</Badge>
            </div>

            <div class="rounded-xl border border-primary/20 bg-gradient-to-r from-primary/5 via-transparent to-transparent p-4">
                <div class="mb-3 flex items-center justify-between">
                    <span class="text-xs text-muted-foreground">Power distribution</span>
                    <span class="text-xs text-muted-foreground">IF: 0.85</span>
                </div>
                <div class="flex h-16 items-end gap-1">
                    {#each workoutBars as height, i (i)}
                        <div
                            class="flex-1 rounded-t transition-all duration-500 {getBarColor(height)}"
                            style="height: {isVisible ? `${height}%` : '0%'}; transition-delay: {i * 50}ms;"
                        ></div>
                    {/each}
                </div>
                <div class="mt-2 flex justify-between text-xs text-muted-foreground">
                    <span>0:00</span>
                    <span>2:00</span>
                    <span>4:00</span>
                </div>
            </div>

            <div class="space-y-3">
                <div class="flex items-center justify-between text-sm">
                    <span class="text-muted-foreground">Carb Loading Schedule</span>
                    <span class="font-semibold text-primary">90g/hr target</span>
                </div>
                <div class="relative h-3 overflow-hidden rounded-full bg-muted">
                    <div
                        class="absolute inset-y-0 left-0 rounded-full bg-primary transition-all duration-1000"
                        style="width: {isVisible ? '78%' : '0%'};"
                    ></div>
                    {#each [25, 50, 75] as pos (pos)}
                        <div
                            class="absolute top-0 bottom-0 w-0.5 bg-background/50"
                            style="left: {pos}%;"
                        ></div>
                    {/each}
                </div>
                <div class="flex justify-between text-xs text-muted-foreground">
                    <span>280g total</span>
                    <span>78% planned</span>
                </div>
            </div>

            <div class="space-y-2">
                {#each NUTRITION_ITEMS as item, i (item.time)}
                    <div
                        class="flex items-center gap-3 border-l-2 border-primary/50 bg-muted/50 px-3 py-2.5 transition-all duration-500"
                        style="opacity: {isVisible ? 1 : 0}; transform: translateX({isVisible ? 0 : -20}px); transition-delay: {i * 100 + 300}ms;"
                    >
                        <span class="w-10 font-mono text-xs text-muted-foreground">{item.time}</span>
                        <item.icon class="size-4 text-muted-foreground" />
                        <span class="flex-1 text-sm font-medium">{item.name}</span>
                        <Badge class="text-xs" variant="secondary">{item.carbs}g</Badge>
                        <CircleCheckIcon class="size-4 text-muted-foreground" />
                    </div>
                {/each}
            </div>
        </div>
    </div>
</div>
