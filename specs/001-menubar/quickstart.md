# Quickstart: Menubar Foundation

**Branch**: `001-menubar` | **Date**: 2026-03-09

## Prerequisites

- Node/Bun environment: `bun --version` ≥ 1.0
- Tauri dev: `bun run tauri dev` (or `bun run dev` for browser-only)
- `components.json` is already configured at the repo root

## Implementation Steps

### Step 1 — Install the Menubar component

```sh
bun x shadcn-svelte@latest add menubar
```

This generates `src/lib/components/ui/menubar/` with all Menubar sub-component files.

### Step 2 — Create the menu definition module

Create `src/lib/components/app-menubar/menu-definition.ts`:

```ts
export type MenuItemDefinition = {
  label: string;
  disabled?: boolean;
  action?: () => void;
};

export type MenuGroupDefinition = {
  label: string;
  items: MenuItemDefinition[];
};

export const MENU_DEFINITION: MenuGroupDefinition[] = [
  {
    label: "File",
    items: [
      { label: "(No actions yet)", disabled: true },
    ],
  },
];
```

### Step 3 — Create the AppMenubar component

Create `src/lib/components/app-menubar/AppMenubar.svelte`:

```svelte
<script lang="ts">
  import * as Menubar from "$lib/components/ui/menubar/index.js";
  import { MENU_DEFINITION } from "./menu-definition.js";
</script>

<Menubar.Root>
  {#each MENU_DEFINITION as group}
    <Menubar.Menu>
      <Menubar.Trigger>{group.label}</Menubar.Trigger>
      <Menubar.Content>
        {#each group.items as item}
          <Menubar.Item
            disabled={item.disabled ?? false}
            onclick={item.action ?? (() => {})}
          >
            {item.label}
          </Menubar.Item>
        {/each}
      </Menubar.Content>
    </Menubar.Menu>
  {/each}
</Menubar.Root>
```

### Step 4 — Mount AppMenubar in the root layout

Edit `src/routes/+layout.svelte`:

```svelte
<script lang="ts">
  import './layout.css';
  import { ModeWatcher } from "mode-watcher";
  import AppMenubar from "$lib/components/app-menubar/AppMenubar.svelte";
  const { children } = $props();
</script>

<ModeWatcher />
<AppMenubar />
{@render children()}
```

### Step 5 — Verify

```sh
bun run check       # svelte-check — must produce 0 errors
bun run tauri dev   # smoke test: menubar visible, File menu opens/closes
```

## Adding New Menus (future features)

To add a new top-level menu (e.g., "Edit"), add an entry to `MENU_DEFINITION` in
`menu-definition.ts`. No changes to `+layout.svelte` or `AppMenubar.svelte` are needed:

```ts
export const MENU_DEFINITION: MenuGroupDefinition[] = [
  { label: "File", items: [ ... ] },
  { label: "Edit", items: [ { label: "Undo", action: handleUndo } ] },
];
```
