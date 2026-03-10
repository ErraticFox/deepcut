<script lang="ts">
  import { Dialog } from "bits-ui";
  import {
    closeSettingsDialog,
    onSettingsDialogOpenChange,
    registerSettingsDialogNode,
    setSettingsDialogUiReady,
    settingsDialogState,
  } from "./controller.js";
  import {
    SETTINGS_DIALOG_DESCRIPTION_ID,
    SETTINGS_DIALOG_ID,
    SETTINGS_DIALOG_TITLE_ID,
  } from "./constants.js";

  let dialogContentEl = $state<HTMLElement | null>(null);

  $effect(() => {
    registerSettingsDialogNode(dialogContentEl);
  });

  $effect(() => {
    setSettingsDialogUiReady(true);

    return () => {
      setSettingsDialogUiReady(false);
      registerSettingsDialogNode(null);
    };
  });
</script>

<Dialog.Root open={$settingsDialogState.isOpen} onOpenChange={onSettingsDialogOpenChange}>
  <Dialog.Portal>
    <Dialog.Overlay class="fixed inset-0 z-50 bg-black/40" />
    <Dialog.Content
      id={SETTINGS_DIALOG_ID}
      aria-labelledby={SETTINGS_DIALOG_TITLE_ID}
      aria-describedby={SETTINGS_DIALOG_DESCRIPTION_ID}
      class="fixed left-1/2 top-1/2 z-50 w-[min(92vw,32rem)] -translate-x-1/2 -translate-y-1/2 rounded-lg border bg-background p-6 shadow-xl outline-none"
      bind:ref={dialogContentEl}
      tabindex={-1}
    >
      <Dialog.Title id={SETTINGS_DIALOG_TITLE_ID} class="text-lg font-semibold">
        Settings
      </Dialog.Title>
      <Dialog.Description
        id={SETTINGS_DIALOG_DESCRIPTION_ID}
        class="mt-2 text-sm text-muted-foreground"
      >
        Settings are not available yet. This dialog is the foundation for future settings sections.
      </Dialog.Description>

      <div class="mt-6 flex justify-end">
        <button
          type="button"
          class="inline-flex items-center rounded-md border px-3 py-2 text-sm font-medium hover:bg-muted"
          onclick={closeSettingsDialog}
        >
          Close
        </button>
      </div>
    </Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>
