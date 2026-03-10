<script lang="ts">
  import "./layout.css";
  import { ModeWatcher } from "mode-watcher";
  import AppMenubar from "$lib/components/app-menubar/AppMenubar.svelte";
  import KeyboardManager from "$lib/components/keyboard-manager/KeyboardManager.svelte";
  import SettingsDialog from "$lib/components/settings-dialog/SettingsDialog.svelte";
  const { children } = $props();
</script>

<ModeWatcher />
<AppMenubar />
<KeyboardManager />
<SettingsDialog />
{@render children()}
