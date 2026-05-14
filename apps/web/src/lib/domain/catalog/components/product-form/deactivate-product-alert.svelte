<script lang="ts">
    import { LoaderCircleIcon } from '@lucide/svelte'

    import { AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogRoot, AlertDialogTitle } from '$lib/domain/ui/alert-dialog'
    import { Button } from '$lib/domain/ui/button'

    import { getProductFormContext } from './context.svelte'

    type Props = {
        open: boolean
        onConfirm: () => void
    }
    let { onConfirm, open = $bindable(false) }: Props = $props()

    const context = getProductFormContext()

    const onCloseDialog = () => {
        open = false
    }
</script>

<AlertDialogRoot bind:open>
    <AlertDialogContent>
        <AlertDialogHeader>
            <AlertDialogTitle>Deactivate Product</AlertDialogTitle>
            <AlertDialogDescription>
                Are you sure you want to deactivate this product? It will no longer appear in the catalog, but historical data will be preserved.
            </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
            <AlertDialogCancel onclick={onCloseDialog}>Cancel</AlertDialogCancel>
            <Button
                disabled={context.isDeactivating}
                variant="destructive"
                onclick={onConfirm}
            >
                {#if context.isDeactivating}
                    <LoaderCircleIcon class="animate-spin" />
                    Deactivating...
                {:else}
                    Deactivate
                {/if}
            </Button>
        </AlertDialogFooter>
    </AlertDialogContent>
</AlertDialogRoot>
