# Research: Keyboard Shortcut Manager

**Branch**: `002-keyboard-manager` | **Date**: 2026-03-09

---

## Unknown 1: Svelte 5 Lifecycle — `onMount`/`onDestroy` vs. `$effect`

**Decision**: Use `$effect` with a cleanup return value.

**Rationale**: The project is on Svelte 5 (`^5.0.0`). `$effect` with a returned cleanup
function is the canonical Svelte 5 pattern for managing side effects that need teardown.
`onMount`/`onDestroy` remain supported but are the Svelte 4 idiom; new Svelte 5 code
should use runes throughout for consistency.

```svelte
// Svelte 5 idiomatic teardown
$effect(() => {
  const handler = (e: KeyboardEvent) => { ... };
  window.addEventListener('keydown', handler);
  return () => window.removeEventListener('keydown', handler);
});
```

**Alternatives considered**:
- `onMount` + `onDestroy`: Still works in Svelte 5 but is not idiomatic runes-based
  code. Mixing runes-style components with legacy lifecycle functions is discouraged by
  the Svelte 5 migration guide.

---

## Unknown 2: Testing Framework Availability

**Decision**: The project does not have a JS/TS unit test framework configured (no
`vitest`, `@testing-library/svelte`, or `playwright` in `package.json`). The
`KeyboardManager` will be tested **manually** for this foundation feature. A dedicated
task to configure `vitest` + `@testing-library/svelte` is out of scope here but recorded
as a follow-up concern.

**Rationale**: Introducing a test framework is infrastructure work that warrants its own
feature/task. Blocking this feature on test setup would delay the core value.

**Alternatives considered**:
- Install `vitest` inline: Rejected as scope creep. The KeyboardManager is simple enough
  to verify manually during integration into `+layout.svelte`.

---

## Unknown 3: keyMap Ownership — Internal vs. Exported Module

**Decision**: Export `keyMap` from a dedicated `keymap.ts` module alongside the
component. The component imports and uses it; consumers (future features) import and
mutate it before or after mount.

**Rationale**: SC-004 requires that adding a new shortcut touches exactly one location.
If the keyMap is private to the component, every new shortcut would require either prop
drilling or a separate store wiring. A plain exported `Record<string, () => void>` is
the simplest structure that satisfies SC-004 and allows any future feature file to
register a shortcut via a direct import — no store subscription or component API needed.

```ts
// keymap.ts — single source of truth
export const keyMap: Record<string, () => void> = {};
```

**Alternatives considered**:
- Svelte `$state` store: Adds reactivity overhead for a lookup table that does not need
  reactive rendering. The `KeyboardManager` reads `keyMap` on each keydown event; it does
  not need to react to the object reference changing.
- Prop passed into `<KeyboardManager keyMap={...} />`: Requires the parent to own and
  manage the registry, which re-centralizes shortcut registration in `+layout.svelte` and
  defeats the "one place" goal.

---

## Unknown 4: Shortcut String Normalization

**Decision**: Build a `shortcutKey()` helper that deterministically composes modifier
segments (`Control`, `Alt`, `Shift`) then appends `event.key`, joined with `+`.
Normalize `event.key` to lowercase for alphabetic keys to avoid case sensitivity issues
(`s` not `S`).

**Rationale**: `KeyboardEvent.key` for Ctrl+Shift+S reports `key = "S"` (uppercase)
because Shift was held. The shortcut string `Control+Shift+s` (lowercase) must be used
consistently in the keyMap; the helper normalizes before lookup.

```ts
function shortcutKey(e: KeyboardEvent): string {
  const mods: string[] = [];
  if (e.ctrlKey)  mods.push('Control');
  if (e.altKey)   mods.push('Alt');
  if (e.shiftKey) mods.push('Shift');
  const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
  return [...mods, key].join('+');
}
```

**Alternatives considered**:
- Use `event.code` (e.g., `KeyS`) instead of `event.key`: Position-based, not
  character-based. Breaks for non-QWERTY layouts and is wrong for special keys.
- Store-side normalization only: Requires all callers registering shortcuts to know the
  normalization rule. The helper centralizes it.
