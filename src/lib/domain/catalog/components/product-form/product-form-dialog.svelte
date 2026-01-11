<script lang="ts">
    import type { Product } from '$lib/database/types.g'

    import { LoaderCircleIcon, SaveIcon } from '@lucide/svelte'

    import { Alert, AlertDescription } from '$lib/domain/ui/alert'
    import { Button } from '$lib/domain/ui/button'
    import * as Dialog from '$lib/domain/ui/dialog'
    import { ScrollArea } from '$lib/domain/ui/scroll-area'

    import { createProductFormContext } from './context.svelte'
    import SectionBasic from './section-basic.svelte'
    import SectionNotes from './section-notes.svelte'
    import SectionNutrition from './section-nutrition.svelte'
    import SectionServing from './section-serving.svelte'

    type Props = {
        onOpenChange: (open: boolean) => void
        open: boolean
        product?: Product
    }
    const { onOpenChange, open, product }: Props = $props()

    const state = createProductFormContext(() => ({ onOpenChange, open, product }))

    const onSubmit = (e: SubmitEvent) => {
        e.preventDefault()
        state.submit()
    }
</script>

<Dialog.Root {open} {onOpenChange}>
    <Dialog.Content class="max-h-[90vh] sm:max-w-2xl">
        <Dialog.Header>
            <Dialog.Title>
                {state.isEditing ? 'Edit Product' : 'Add Product'}
            </Dialog.Title>
            <Dialog.Description>
                {state.isEditing ? 'Update the product details below.' : 'Fill in the product details below.'}
            </Dialog.Description>
        </Dialog.Header>

        <ScrollArea class="-mx-6 max-h-[60vh] border-y">
            <form class="flex flex-col gap-4 p-6 [&_input]:placeholder:text-sm" onsubmit={onSubmit}>
                <SectionBasic />
                <SectionServing />
                <SectionNutrition />
                <SectionNotes />

                {#if state.error}
                    <Alert variant="destructive">
                        <AlertDescription>
                            {state.error.message}
                        </AlertDescription>
                    </Alert>
                {/if}
            </form>
        </ScrollArea>

        <Dialog.Footer class="flex-row justify-end">
            <Button disabled={state.isPending} variant="ghost" onclick={state.close}>
                Cancel
            </Button>
            <Button
                disabled={state.isPending}
                type="submit"
                onclick={state.submit}
            >
                {#if state.isPending}
                    <LoaderCircleIcon class="animate-spin" />
                    Saving...
                {:else}
                    <SaveIcon />
                    {state.isEditing ? 'Update Product' : 'Add Product'}
                {/if}
            </Button>
        </Dialog.Footer>
    </Dialog.Content>
</Dialog.Root>
