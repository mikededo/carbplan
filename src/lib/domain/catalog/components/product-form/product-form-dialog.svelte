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

    const context = createProductFormContext(() => ({ onOpenChange, open, product }))

    const onSubmit = (e: SubmitEvent) => {
        e.preventDefault()
        context.submit()
    }
</script>

<Dialog.Root {open} {onOpenChange}>
    <Dialog.Content class="max-h-[90vh] sm:max-w-2xl">
        <Dialog.Header>
            <Dialog.Title>
                {context.isEditing ? 'Edit Product' : 'Add Product'}
            </Dialog.Title>
            <Dialog.Description>
                {context.isEditing ? 'Update the product details below.' : 'Fill in the product details below.'}
            </Dialog.Description>
        </Dialog.Header>

        <ScrollArea class="-mx-6 max-h-[60vh] border-y">
            <form class="flex flex-col gap-4 p-6 [&_input]:placeholder:text-sm" onsubmit={onSubmit}>
                <SectionBasic />
                <SectionServing />
                <SectionNutrition />
                <SectionNotes />

                {#if context.error}
                    <Alert variant="destructive">
                        <AlertDescription>
                            {context.error.message}
                        </AlertDescription>
                    </Alert>
                {/if}
            </form>
        </ScrollArea>

        <Dialog.Footer class="flex-row justify-end">
            <Button disabled={context.isPending} variant="ghost" onclick={context.close}>
                Cancel
            </Button>
            <Button
                disabled={context.isPending}
                type="submit"
                onclick={context.submit}
            >
                {#if context.isPending}
                    <LoaderCircleIcon class="animate-spin" />
                    Saving...
                {:else}
                    <SaveIcon />
                    {context.isEditing ? 'Update Product' : 'Add Product'}
                {/if}
            </Button>
        </Dialog.Footer>
    </Dialog.Content>
</Dialog.Root>
