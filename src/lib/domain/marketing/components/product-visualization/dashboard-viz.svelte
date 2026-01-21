<script lang="ts">
    import {
        BikeIcon,
        FlameIcon,
        GaugeIcon,
        HeartIcon,
        TimerIcon,
        TrendingUpIcon,
        TrophyIcon
    } from '@lucide/svelte'

    type Props = {
        isVisible: boolean
    }
    const { isVisible }: Props = $props()

    let activeZone = $state(2)
    let animatedPower = $state(0)
    let heartRate = $state(142)

    const powerZones = [
        { color: 'bg-gray-400', name: 'Recovery', watts: '< 137W', zone: 1 },
        { color: 'bg-blue-500', name: 'Endurance', watts: '137-187W', zone: 2 },
        { color: 'bg-green-500', name: 'Tempo', watts: '187-225W', zone: 3 },
        { color: 'bg-yellow-500', name: 'Threshold', watts: '225-262W', zone: 4 },
        { color: 'bg-orange-500', name: 'VO2max', watts: '262-300W', zone: 5 },
        { color: 'bg-red-500', name: 'Anaerobic', watts: '> 300W', zone: 6 }
    ]

    $effect(() => {
        if (!isVisible) {
            return
        }

        const powerInterval = setInterval(() => {
            const target = 245
            if (animatedPower < target) {
                animatedPower = Math.min(animatedPower + 5, target)
            }
        }, 30)

        const hrInterval = setInterval(() => {
            heartRate = 140 + Math.floor(Math.random() * 8)
        }, 1000)

        return () => {
            clearInterval(powerInterval)
            clearInterval(hrInterval)
        }
    })
</script>

<div class="overflow-hidden rounded-xl bg-accent shadow-2xl">
    <span class="block pt-2 pb-1.5 pl-3 text-sm font-semibold uppercase">Dashboard</span>

    <div class="rounded-xl border border-border bg-card">
        <div class="space-y-5 p-6">
            <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                    <div class="relative">
                        <div
                            class="flex size-14 items-center justify-center rounded-full border-4 border-primary/20"
                        >
                            <div
                                class="absolute inset-0 rounded-full border-4 border-primary transition-all duration-1000"
                                style="clip-path: {isVisible ? 'inset(0 0 0 0)' : 'inset(0 100% 0 0)'};"
                            ></div>
                            <BikeIcon class="size-6 text-primary" />
                        </div>
                    </div>
                    <div>
                        <p class="text-sm text-muted-foreground">Weekly Summary</p>
                        <p class="text-xl font-bold text-foreground">5 rides completed</p>
                    </div>
                </div>
                <div class="flex items-center gap-1 text-sm font-medium text-green-500">
                    <TrendingUpIcon class="size-4" />
                    +8 TSS/day
                </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
                <div class="space-y-2 rounded-xl bg-muted/50 p-4">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-2 text-xs text-muted-foreground">
                            <GaugeIcon class="size-3.5" />
                            Power
                        </div>
                        <span class="text-xs text-muted-foreground">FTP: 250W</span>
                    </div>
                    <p class="text-3xl font-bold tabular-nums">{animatedPower}W</p>
                    <div class="h-2 overflow-hidden rounded-full bg-muted">
                        <div
                            class="h-full rounded-full bg-gradient-to-r from-blue-500 via-green-500 to-yellow-500 transition-all duration-500"
                            style="width: {isVisible ? `${(animatedPower / 300) * 100}%` : '0%'};"
                        ></div>
                    </div>
                </div>

                <div class="space-y-2 rounded-xl bg-muted/50 p-4">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-2 text-xs text-muted-foreground">
                            <HeartIcon class="size-3.5 text-red-500" />
                            Heart Rate
                        </div>
                        <span class="text-xs text-muted-foreground">Max: 185</span>
                    </div>
                    <p class="text-3xl font-bold tabular-nums">
                        {heartRate}
                        <span class="ml-1 text-lg text-muted-foreground">bpm</span>
                    </p>
                    <div class="flex gap-0.5">
                        {#each Array.from({ length: 5 }) as _, i (i)}
                            <div
                                class="h-2 flex-1 rounded-sm transition-all duration-300 {i < 3
                                    ? 'bg-red-500'
                                    : 'bg-muted'}"
                                style="transition-delay: {i * 100}ms;"
                            ></div>
                        {/each}
                    </div>
                </div>
            </div>

            <div class="space-y-3">
                <div class="flex items-center justify-between text-sm">
                    <span class="text-muted-foreground">Training Zones</span>
                    <span class="font-medium text-primary">Zone {activeZone + 1}</span>
                </div>
                <div class="flex h-12 gap-1">
                    {#each powerZones as zone, i (zone.zone)}
                        <button
                            class="flex-1 cursor-pointer rounded-lg transition-all duration-300 {zone.color} {activeZone ===
                                i
                                ? 'scale-y-100 opacity-100'
                                : 'scale-y-75 opacity-40'}"
                            onmouseenter={() => (activeZone = i)}
                            aria-label="Zone {zone.zone}: {zone.name}"
                            style="transition-delay: {isVisible ? `${i * 50}ms` : '0ms'}; transform: scaleY({isVisible
                                ? activeZone === i
                                    ? 1
                                    : 0.75
                                : 0});"
                        ></button>
                    {/each}
                </div>
                <div class="flex justify-between text-xs text-muted-foreground">
                    <span>{powerZones[activeZone].name}</span>
                    <span>{powerZones[activeZone].watts}</span>
                </div>
            </div>

            <div class="grid grid-cols-3 gap-3 pt-2">
                <div class="rounded-lg bg-muted p-3 text-center">
                    <div class="mb-1 flex items-center justify-center gap-1 text-xs text-muted-foreground">
                        <FlameIcon class="size-3" />
                        kJ
                    </div>
                    <p class="text-lg font-bold">8,450</p>
                </div>
                <div class="rounded-lg bg-muted p-3 text-center">
                    <div class="mb-1 flex items-center justify-center gap-1 text-xs text-muted-foreground">
                        <TimerIcon class="size-3" />
                        Time
                    </div>
                    <p class="text-lg font-bold">9h 45m</p>
                </div>
                <div class="rounded-lg bg-muted p-3 text-center">
                    <div class="mb-1 flex items-center justify-center gap-1 text-xs text-muted-foreground">
                        <TrophyIcon class="size-3" />
                        TSS
                    </div>
                    <p class="text-lg font-bold">485</p>
                </div>
            </div>
        </div>
    </div>
</div>
