<script lang="ts">
    import type { ScheduledEvent } from '../types'

    import { CalendarDays, Clock } from '@lucide/svelte'

    import * as Card from '$lib/domain/ui/card'

    type Props = {
        todayEvents: ScheduledEvent[]
        upcomingEvents: ScheduledEvent[]
    }
    const { todayEvents, upcomingEvents }: Props = $props()

    const formatDuration = (minutes: number) => {
        if (minutes < 60) {
            return `${minutes} min`
        }
        const hours = Math.floor(minutes / 60)
        const mins = minutes % 60
        return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`
    }
</script>

<section class="space-y-4">
    <h2 class="text-lg font-semibold">Schedule</h2>

    <div class="grid gap-4 md:grid-cols-2">
        <Card.Root class="gap-3 rounded-md py-4">
            <Card.Header class="px-4 pb-0">
                <Card.Title class="flex items-center gap-2 text-base font-medium">
                    <Clock class="size-4 text-muted-foreground" />
                    Today
                </Card.Title>
            </Card.Header>
            <Card.Content class="px-4">
                {#if todayEvents.length === 0}
                    <p class="text-sm text-muted-foreground">No events scheduled for today</p>
                {:else}
                    <ul class="space-y-2">
                        {#each todayEvents as event (event.id)}
                            <li class="flex items-center justify-between rounded-md bg-muted/50 px-3 py-2 text-sm">
                                <div>
                                    <span class="font-medium">{event.time}</span>
                                    <span class="mx-2 text-muted-foreground">•</span>
                                    <span>{event.name}</span>
                                </div>
                                <div class="text-muted-foreground">
                                    {formatDuration(event.durationMinutes)} — {event.targetCarbsPerHour} g/hr
                                </div>
                            </li>
                        {/each}
                    </ul>
                {/if}
            </Card.Content>
        </Card.Root>

        <Card.Root class="gap-3 rounded-md py-4">
            <Card.Header class="px-4 pb-0">
                <Card.Title class="flex items-center gap-2 text-base font-medium">
                    <CalendarDays class="size-4 text-muted-foreground" />
                    Upcoming
                </Card.Title>
            </Card.Header>
            <Card.Content class="px-4">
                {#if upcomingEvents.length === 0}
                    <p class="text-sm text-muted-foreground">No upcoming events</p>
                {:else}
                    <ul class="space-y-2">
                        {#each upcomingEvents as event (event.id)}
                            <li class="flex items-center justify-between rounded-md bg-muted/50 px-3 py-2 text-sm">
                                <div>
                                    <span class="font-medium">{event.time}</span>
                                    <span class="mx-2 text-muted-foreground">•</span>
                                    <span>{event.name}</span>
                                </div>
                                <div class="text-muted-foreground">
                                    {formatDuration(event.durationMinutes)} — {event.targetCarbsPerHour} g/hr
                                </div>
                            </li>
                        {/each}
                    </ul>
                {/if}
            </Card.Content>
        </Card.Root>
    </div>
</section>
