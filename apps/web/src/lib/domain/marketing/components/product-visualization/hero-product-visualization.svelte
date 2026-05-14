<script lang="ts">
    import {
        BatteryChargingIcon,
        BikeIcon,
        BrainIcon,
        CalendarIcon,
        CircleCheckIcon,
        ClipboardListIcon,
        ClockIcon,
        FlameIcon,
        GaugeIcon,
        PillIcon,
        TargetIcon,
        TrophyIcon
    } from '@lucide/svelte'

    import { Badge } from '$lib/domain/ui/badge'
    import { cn } from '$lib/utils'

    import { entryStyles } from '../../helpers'

    type Props = { isVisible: boolean }
    const { isVisible }: Props = $props()

    let animatedProgress = $state(0)

    const PLANNED_WORKOUT = {
        duration: '4h',
        durationHours: 4,
        name: 'Tempo Endurance',
        targetIF: 0.80,
        targetKJ: 2900,
        targetTSS: 250
    }

    const NUTRITION_PLAN = [
        { carbs: 30, item: 'Pre-ride Gel', time: '0:00' },
        { carbs: 60, item: 'Drink Mix (750ml)', time: '0:30' },
        { carbs: 50, item: 'Energy Bar', time: '1:00' },
        { carbs: 40, item: 'Gel + Chews', time: '1:30' },
        { carbs: 60, item: 'Drink Mix (750ml)', time: '2:00' },
        { carbs: 30, item: 'Caffeine Gel', time: '2:30' },
        { carbs: 50, item: 'Energy Bar', time: '3:00' },
        { carbs: 40, item: 'Final Push Gel', time: '3:30' }
    ]
    const totalPlannedCarbs = NUTRITION_PLAN.reduce((sum, item) => sum + item.carbs, 0)

    const WORKOUT_BARS = [72]
    const METRICS = [
        { icon: TrophyIcon, label: 'Target TSS', value: PLANNED_WORKOUT.targetTSS.toString() },
        { icon: GaugeIcon, label: 'Target IF', value: PLANNED_WORKOUT.targetIF.toString() },
        {
            icon: BatteryChargingIcon,
            label: 'Carbs/hr',
            value: `${Math.round(totalPlannedCarbs / PLANNED_WORKOUT.durationHours)}g`
        },
        { icon: PillIcon, label: 'Items', value: NUTRITION_PLAN.length.toString() }
    ]

    const getZoneColor = (height: number) => {
        if (height < 50) {
            return 'bg-gray-200'
        }
        if (height < 60) {
            return 'bg-blue-300'
        }
        if (height < 70) {
            return 'bg-green-300'
        }

        return height < 80 ? 'bg-yellow-300' : 'bg-orange-300'
    }

    $effect(() => {
        if (!isVisible) {
            return
        }

        const progressInterval = setInterval(() => {
            if (animatedProgress < 100) {
                animatedProgress = Math.min(animatedProgress + 2, 100)
            }
        }, 30)

        return () => {
            clearInterval(progressInterval)
        }
    })
</script>

<div class="relative">
    <div class="absolute -top-8 -left-20 z-20">
        <div
            class="rounded-xl border border-border bg-card p-3 shadow-xl transition-all duration-500"
            style={entryStyles(isVisible, { delay: 200, offset: -20 })}
        >
            <div class="mb-1 flex items-center gap-2 text-xs text-muted-foreground">
                <CalendarIcon class="size-3" />
                Planned Workout
            </div>
            <p class="text-lg font-bold">{PLANNED_WORKOUT.name}</p>
            <div class="mt-1 flex items-center gap-2">
                <Badge class="text-xs" variant="secondary">{PLANNED_WORKOUT.duration}</Badge>
                <span class="text-xs text-muted-foreground">TSS {PLANNED_WORKOUT.targetTSS}</span>
            </div>
        </div>
    </div>

    <div class="absolute -top-8 -right-20 z-20">
        <div
            class="rounded-xl border border-border bg-card p-3 shadow-xl transition-all duration-500"
            style={entryStyles(isVisible, { delay: 400, offset: -20 })}
        >
            <div class="mb-1 flex items-center gap-2 text-xs text-muted-foreground">
                <TargetIcon class="size-3 text-primary" />
                Nutrition Targets
            </div>
            <p class="text-2xl font-bold tabular-nums">
                {totalPlannedCarbs}
                <span class="ml-1 text-sm text-muted-foreground">g carbs</span>
            </p>
            <div class="mt-1 flex items-center gap-1 text-xs text-primary">
                <CircleCheckIcon class="size-3" />
                {Math.round(totalPlannedCarbs / PLANNED_WORKOUT.durationHours)}g/hr average
            </div>
        </div>
    </div>

    <div class="absolute -bottom-8 -left-20 z-20">
        <div
            class="rounded-xl border border-border bg-card p-3 shadow-xl transition-all duration-500"
            style={entryStyles(isVisible, { delay: 600, offset: 20 })}
        >
            <div class="mb-1 flex items-center gap-2 text-xs text-muted-foreground">
                <FlameIcon class="size-3 text-orange-500" />
                Estimated Energy
            </div>
            <p class="text-2xl font-bold tabular-nums">
                {PLANNED_WORKOUT.targetKJ.toLocaleString()}
                <span class="ml-1 text-sm text-muted-foreground">kJ</span>
            </p>
            <div class="mt-2 h-1.5 w-24 overflow-hidden rounded-full bg-muted">
                <div
                    class="h-full rounded-full bg-orange-500 transition-all duration-1000"
                    style="width: {Math.min(animatedProgress, 100)}%;"
                ></div>
            </div>
            <p class="mt-1 text-xs text-muted-foreground">
                ~{Math.round(PLANNED_WORKOUT.targetKJ * 0.24)} calories
            </p>
        </div>
    </div>

    <div class="absolute -right-20 -bottom-8 z-20 max-w-50">
        <div
            class="rounded-xl border border-border bg-card p-3 shadow-xl transition-all duration-500"
            style={entryStyles(isVisible, { delay: 800, offset: 20 })}
        >
            <div class="mb-2 flex items-center gap-2">
                <div class="flex size-6 items-center justify-center rounded-full bg-primary/20">
                    <BrainIcon class="size-3 text-primary" />
                </div>
                <span class="text-xs font-medium">Plan Recommendation</span>
            </div>
            <p class="text-xs text-muted-foreground">
                Based on your <span class="font-medium text-primary">FTP of 250W</span>, your plan is
                optimized for 90g/hr — ideal for this intensity.
            </p>
        </div>
    </div>

    <div
        class="overflow-hidden rounded-2xl border border-border bg-card shadow-2xl transition-all duration-700"
        style={entryStyles(isVisible, { transform: 'scale' })}
    >
        <div class="flex items-center justify-between border-b border-border bg-muted/50 px-4 py-3">
            <div class="flex items-center gap-3">
                <div class="flex gap-1.5">
                    <div class="size-3 rounded-full bg-red-400"></div>
                    <div class="size-3 rounded-full bg-yellow-400"></div>
                    <div class="size-3 rounded-full bg-green-400"></div>
                </div>
                <span class="text-sm font-medium">CarbPlan - Nutrition Planner</span>
            </div>
            <Badge class="text-xs" variant="secondary">
                <ClipboardListIcon class="mr-1 size-3" />
                Plan Mode
            </Badge>
        </div>

        <div class="space-y-6 p-6">
            <div class="flex items-center justify-between">
                <div>
                    <div class="mb-1 flex items-center gap-2">
                        <BikeIcon class="size-4 text-primary" />
                        <span class="text-sm text-muted-foreground">Upcoming Ride</span>
                    </div>
                    <h3 class="text-xl font-bold">{PLANNED_WORKOUT.name}</h3>
                </div>
                <div class="text-right">
                    <p class="text-2xl font-bold text-primary">
                        {PLANNED_WORKOUT.targetKJ.toLocaleString()}
                    </p>
                    <p class="text-xs text-muted-foreground">Estimated kJ</p>
                </div>
            </div>

            <div class="rounded-md border border-border bg-muted/30 px-3 py-2">
                <div class="flex items-center justify-between">
                    <span class="text-sm font-medium">Planned workout</span>
                    <div class="flex items-center gap-1">
                        <Badge class="text-xs" variant="secondary">
                            <ClockIcon class="mr-1 size-3" />
                            {PLANNED_WORKOUT.duration}
                        </Badge>
                        <Badge class="text-xs" variant="secondary">IF {PLANNED_WORKOUT.targetIF}</Badge>
                    </div>
                </div>

                <div class="relative flex h-20 items-end gap-0.5">
                    {#each WORKOUT_BARS as height, i (i)}
                        <div
                            class={cn('flex-1 rounded-t transition-all duration-700', getZoneColor(height))}
                            style="height: {isVisible ? `${height}%` : '0%'}; transition-delay: {i * 40}ms;"
                        ></div>
                    {/each}
                </div>

                <div class="mt-2 flex justify-between text-xs text-muted-foreground">
                    <span>Start</span>
                    <span>Finish</span>
                </div>
            </div>

            <div class="space-y-3">
                <div class="flex items-center justify-between">
                    <span class="text-sm font-medium">Planned nutrition schedule</span>
                    <Badge variant="secondary">{totalPlannedCarbs}g total</Badge>
                </div>

                <div class="space-y-2">
                    {#each NUTRITION_PLAN.slice(0, 4) as item, i (item.time)}
                        <div
                            class="flex items-center gap-3 border-l-2 border-primary/50 bg-muted/50 px-3 py-2.5 transition-all duration-500"
                            style={entryStyles(isVisible, { delay: i * 100 + 500, offset: -20, transform: 'translateX' })}
                        >
                            <span class="w-10 font-mono text-xs text-muted-foreground">{item.time}</span>
                            <div class="flex-1">
                                <span class="text-sm font-medium">{item.item}</span>
                            </div>
                            <Badge class="text-xs" variant="secondary">{item.carbs}g</Badge>
                            <CircleCheckIcon class="size-4 text-muted-foreground" />
                        </div>
                    {/each}
                    <div
                        class="py-2 text-center text-xs text-muted-foreground transition-all duration-500"
                        style={entryStyles(isVisible, { delay: 900, offset: 0 })}
                    >
                        + {NUTRITION_PLAN.length - 4} more planned items
                    </div>
                </div>
            </div>

            <div class="grid grid-cols-4 gap-3 pt-2">
                {#each METRICS as metric, i (metric.label)}
                    <div
                        class="rounded-lg bg-muted/50 p-3 text-center transition-all duration-500"
                        style={entryStyles(isVisible, { delay: i * 100 + 1000, offset: 10 })}
                    >
                        <div
                            class="mb-1 flex items-center justify-center gap-1 text-xs text-muted-foreground"
                        >
                            <metric.icon class="size-3" />
                            {metric.label}
                        </div>
                        <p class="text-lg font-bold">{metric.value}</p>
                    </div>
                {/each}
            </div>
        </div>
    </div>

</div>
