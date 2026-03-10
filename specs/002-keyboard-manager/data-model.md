# Data Model: Keyboard Shortcut Manager

**Branch**: `002-keyboard-manager` | **Date**: 2026-03-09

---

## Entities

### `KeyMap`

The central registry of all application keyboard shortcuts. There is a single shared
instance exported from `keymap.ts`.

| Field | Type | Description |
|-------|------|-------------|
| `[shortcut: string]` | `() => void` | Maps a canonical shortcut string to a zero-argument handler function |

**Type definition**:
```ts
type KeyMap = Record<string, () => void>;
```

**Notes**:
- The object is exported as a mutable plain record; callers add entries directly.
- There is no schema enforcement on the shortcut string format at the type level — the
  format convention (`Control+Alt+Shift+key`) is documented and enforced by the
  `shortcutKey()` helper.
- The initial export is an empty object `{}`. Population is deferred to individual
  features.

---

### `ShortcutString`

A normalized string key used to identify a keyboard combination in the `KeyMap`.

**Format**: `[Control+][Alt+][Shift+]<key>`

- Modifiers always appear in the fixed order: `Control`, `Alt`, `Shift`.
- `<key>` is the `KeyboardEvent.key` value: single alphabetic characters are lowercased;
  special keys (`F12`, `Escape`, `Enter`, etc.) retain their canonical casing.
- Examples:
  - `Control+s` — Ctrl+S
  - `Control+Shift+z` — Ctrl+Shift+Z (redo)
  - `Control+Alt+Delete` — Ctrl+Alt+Delete
  - `F12` — F12 alone (no modifiers)
  - `Escape` — Escape alone

---

### `shortcutKey(e: KeyboardEvent): string`

A pure helper function. Accepts a `KeyboardEvent` and returns the normalized
`ShortcutString` for that event. Used inside `KeyboardManager.svelte` on every
`keydown` event to build the lookup key.

**Validation rules**:
- `ctrlKey` → prepend `Control`
- `altKey` → prepend `Alt`
- `shiftKey` → prepend `Shift`
- single alphabetic character keys → lowercase
- all other keys → pass `event.key` through as-is

---

## State Ownership

| State | Owner | Scope |
|-------|-------|-------|
| `keyMap` registry | `keymap.ts` module | Application global (module singleton) |
| `keydown` event listener ref | `KeyboardManager.svelte` `$effect` | Component lifecycle |

No Svelte stores are required. No Tauri state is required. No persistence is required.

---

## Validation Rules

- None at the data layer. The `keyMap` is an internal construct; it does not accept
  user input and requires no sanitization.
- If a handler function throws, the error propagates naturally — no swallowing occurs,
  consistent with the edge case requirement in the spec.
