# Quickstart: Keyboard Shortcut Manager

**Branch**: `002-keyboard-manager` | **Date**: 2026-03-09

---

## What Gets Built

Two files:

| File | Purpose |
|------|---------|
| `src/lib/components/keyboard-manager/keymap.ts` | Exports the shared `keyMap` registry and the `shortcutKey()` helper |
| `src/lib/components/keyboard-manager/KeyboardManager.svelte` | Invisible component that attaches the window keydown listener |

One integration change:

| File | Change |
|------|--------|
| `src/routes/+layout.svelte` | Mount `<KeyboardManager />` alongside existing root components |

---

## File Summaries

### `keymap.ts`

```ts
export type KeyMap = Record<string, () => void>;

export const keyMap: KeyMap = {};

export function shortcutKey(e: KeyboardEvent): string {
  const mods: string[] = [];
  if (e.ctrlKey)  mods.push('Control');
  if (e.altKey)   mods.push('Alt');
  if (e.shiftKey) mods.push('Shift');
  const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
  return [...mods, key].join('+');
}
```

### `KeyboardManager.svelte`

```svelte
<script lang="ts">
  import { keyMap, shortcutKey } from './keymap.js';

  $effect(() => {
    function handleKeydown(e: KeyboardEvent) {
      const target = e.target as HTMLElement;
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) return;

      const key = shortcutKey(e);
      const handler = keyMap[key];
      if (handler) {
        e.preventDefault();
        handler();
      }
    }

    window.addEventListener('keydown', handleKeydown);
    return () => window.removeEventListener('keydown', handleKeydown);
  });
</script>
```

### `+layout.svelte` integration

```svelte
<script lang="ts">
  import './layout.css';
  import { ModeWatcher } from "mode-watcher";
  import AppMenubar from "$lib/components/app-menubar/AppMenubar.svelte";
  import KeyboardManager from "$lib/components/keyboard-manager/KeyboardManager.svelte";
  const { children } = $props();
</script>

<ModeWatcher />
<AppMenubar />
<KeyboardManager />
{@render children()}
```

---

## How to Register a Shortcut (Future Features)

```ts
// In any feature file, import the shared registry and register:
import { keyMap } from '$lib/components/keyboard-manager/keymap.js';

keyMap['Control+s'] = () => {
  // save logic
};
```

One import. One assignment. That is the entire API surface for consumers.

---

## Manual Verification Steps

1. Run `bun run tauri:dev`.
2. Open the app — confirm the window loads without errors.
3. Temporarily register `keyMap['Control+k'] = () => console.log('shortcut fired');`
   in `+layout.svelte`.
4. Press Ctrl+K — confirm "shortcut fired" appears in the console.
5. Click into a text input, press Ctrl+K — confirm nothing fires.
6. Press F12 — confirm DevTools open normally.
7. Remove the test registration.
8. Run `bun run quality` — confirm all gates pass.
