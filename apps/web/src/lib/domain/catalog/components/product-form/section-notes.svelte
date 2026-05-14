<script lang="ts">
    import { FieldError, FieldLabel, FieldRoot, FieldSeparator } from '$lib/domain/ui/field'

    import { getProductFormContext } from './context.svelte'

    const context = getProductFormContext()

    const onNotesInput = (e: Event) => {
        context.updateField('notes', (e.target as HTMLTextAreaElement).value)
    }
</script>

<FieldSeparator />

<FieldRoot data-invalid={!!context.errors.notes || undefined}>
    <FieldLabel for="notes">Notes</FieldLabel>
    <textarea
        class="flex min-h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
        id="notes"
        placeholder="Additional notes about this product..."
        rows="2"
        value={context.state.notes}
        oninput={onNotesInput}
        aria-invalid={!!context.errors.notes}
    ></textarea>
    <FieldError errors={context.errors.notes ? [{ message: context.errors.notes }] : undefined} />
</FieldRoot>
