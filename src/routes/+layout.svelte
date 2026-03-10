<script lang="ts">
	import './layout.css';
	import { ModeWatcher } from "mode-watcher";
	import AppMenubar from "$lib/components/app-menubar/AppMenubar.svelte";
	const { children } = $props();
</script>

<ModeWatcher />
<AppMenubar />
{@render children()}
