<script lang="ts">
    import * as Field from '$lib/domain/ui/field'

    import { getProductFormContext } from './context.svelte'

    const ctx = getProductFormContext()

    const onNotesInput = (e: Event) => {
        ctx.updateField('notes', (e.target as HTMLTextAreaElement).value)
    }
</script>

<Field.Separator />

<Field.Field data-invalid={!!ctx.errors.notes || undefined}>
    <Field.Label for="notes">Notes</Field.Label>
    <textarea
        class="flex min-h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
        id="notes"
        placeholder="Additional notes about this product..."
        rows="2"
        value={ctx.state.notes}
        oninput={onNotesInput}
        aria-invalid={!!ctx.errors.notes}
    ></textarea>
    <Field.Error errors={ctx.errors.notes ? [{ message: ctx.errors.notes }] : undefined} />
</Field.Field>
