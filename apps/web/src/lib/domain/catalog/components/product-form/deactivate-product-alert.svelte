<script lang="ts">
    import { LoaderCircleIcon } from '@lucide/svelte'

    import AlertDialogCancel from '$lib/domain/ui/alert-dialog/alert-dialog-cancel.svelte'
    import AlertDialogContent from '$lib/domain/ui/alert-dialog/alert-dialog-content.svelte'
    import AlertDialogDescription from '$lib/domain/ui/alert-dialog/alert-dialog-description.svelte'
    import AlertDialogFooter from '$lib/domain/ui/alert-dialog/alert-dialog-footer.svelte'
    import AlertDialogHeader from '$lib/domain/ui/alert-dialog/alert-dialog-header.svelte'
    import AlertDialogTitle from '$lib/domain/ui/alert-dialog/alert-dialog-title.svelte'
    import AlertDialogRoot from '$lib/domain/ui/alert-dialog/alert-dialog.svelte'
    import Button from '$lib/domain/ui/button/button.svelte'

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
