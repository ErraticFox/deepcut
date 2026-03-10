# Implementation Plan: Keyboard Shortcut Manager

**Branch**: `002-keyboard-manager` | **Date**: 2026-03-09 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/002-keyboard-manager/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Introduce a centralized, invisible Svelte 5 component (`KeyboardManager`) that attaches
a single `window` keydown listener and dispatches to a shared `keyMap` registry. The
keyMap is a plain exported `Record<string, () => void>` in a companion `keymap.ts`
module; future features import and populate it. Listener teardown is handled by a
`$effect` cleanup. Input fields (input, textarea, select) are automatically excluded
from shortcut interception. `preventDefault()` is called only for matched shortcuts.

## Technical Context

**Language/Version**: TypeScript ~5.6.2 + Svelte 5 (`^5.0.0`)
**Primary Dependencies**: SvelteKit (SSG), Svelte 5 runes, Tailwind CSS, shadcn-svelte
**Storage**: N/A — no persistence; the keyMap is an in-memory module singleton
**Testing**: No unit test framework configured in the project (no vitest/playwright).
Manual integration verification via `bun run tauri:dev`. Test infra setup is a
separate follow-up concern outside this feature's scope.
**Target Platform**: Tauri v2 desktop app (Windows primary)
**Project Type**: Desktop application (Tauri + SvelteKit SSG frontend)
**Performance Goals**: Handler dispatch within one animation frame of keydown event
**Constraints**: Zero listener leaks after component unmount; zero extraneous
`preventDefault()` calls for unregistered shortcuts
**Scale/Scope**: Single component; two new files; one layout integration change

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] Heavy computation and filesystem-intensive operations are assigned to Rust
  (`src-tauri/`), not frontend Svelte code. ✓ No Rust work in this feature.
- [x] Every new/changed Tauri command has a typed TS contract planned under
  `src/lib/types`. ✓ No Tauri commands introduced.
- [x] UI work uses `shadcn-svelte` components and Tailwind utility classes; any
  exception is explicitly justified. ✓ No visible UI; exception explicitly noted in spec
  (KeyboardManager renders nothing).
- [x] State ownership is declared: Svelte stores for global UI state, Tauri `State`
  for backend-managed persistence/runtime state. ✓ keyMap is a module-level singleton
  (plain object); no Svelte store or Tauri state required.
- [x] FFmpeg work is isolated to a dedicated Rust module and exposed only via Tauri
  command handlers. ✓ No FFmpeg involvement.
- [x] Tooling commands for JS/TS use Bun; `bun run lint` and `bun run format:check`
  pass for all JS/TS/Svelte changes. ✓ All commands use Bun. No new dependencies added.
- [x] Rust changes pass `bun run lint:rust` (clippy -D warnings) and
  `bun run format:rust:check` (cargo fmt --check). ✓ No Rust changes.
- [x] `bun run quality` gate is green before marking the feature complete.

**Post-design re-check**: All gates remain clear. No violations to justify.

## Project Structure

### Documentation (this feature)

```text
specs/002-keyboard-manager/
├── plan.md              ← this file
├── research.md          ← Phase 0 output
├── data-model.md        ← Phase 1 output
├── quickstart.md        ← Phase 1 output
└── tasks.md             ← Phase 2 output (/speckit.tasks — not yet created)
```

No `contracts/` directory — this feature introduces no external interfaces (no Tauri
commands, no public APIs, no CLI surface). The only consumer interface is the `keyMap`
import documented in `quickstart.md`.

### Source Code (repository root)

```text
src/
├── lib/
│   └── components/
│       ├── keyboard-manager/          ← NEW
│       │   ├── keymap.ts              ← keyMap registry + shortcutKey() helper
│       │   └── KeyboardManager.svelte ← invisible listener component
│       └── app-menubar/               (existing, unchanged)
└── routes/
    └── +layout.svelte                 ← ADD: mount <KeyboardManager />
```

**Structure Decision**: Single-project layout (Option 1). The keyboard manager follows
the existing `src/lib/components/<feature>/` convention established by `app-menubar/`.

## Complexity Tracking

No Constitution Check violations. No complexity justification required.

## Phase 0: Research Summary

All unknowns resolved. See [research.md](research.md) for full decision records.

| Unknown | Decision |
|---------|----------|
| Svelte 5 lifecycle idiom | Use `$effect` with cleanup return — canonical Svelte 5 runes pattern |
| Testing framework | None configured; manual verification for this feature; test infra is a future follow-up |
| keyMap ownership | Exported module-level `Record<string, () => void>` in `keymap.ts` — simplest structure satisfying SC-004 |
| Shortcut string normalization | `shortcutKey()` helper: modifiers in fixed order, alphabetic keys lowercased, `event.key` for specials |

## Phase 1: Design Artifacts

### Data Model

See [data-model.md](data-model.md).

**Key entities**:
- `KeyMap` — `Record<string, () => void>`, module singleton exported from `keymap.ts`
- `ShortcutString` — normalized string format: `[Control+][Alt+][Shift+]<key>`
- `shortcutKey(e: KeyboardEvent): string` — pure normalization helper

**State ownership**:
| State | Owner |
|-------|-------|
| `keyMap` registry | `keymap.ts` module singleton |
| `keydown` listener ref | `KeyboardManager.svelte` `$effect` |

### Contracts

No contracts file. This feature has no external interface (no Tauri commands, no CLI,
no public API surface). Consumer usage is documented in [quickstart.md](quickstart.md).

### Implementation Sketch

See [quickstart.md](quickstart.md) for concrete file contents.

**`keymap.ts`** — exports `keyMap: KeyMap` and `shortcutKey()`:
```ts
export type KeyMap = Record<string, () => void>;
export const keyMap: KeyMap = {};
export function shortcutKey(e: KeyboardEvent): string { ... }
```

**`KeyboardManager.svelte`** — invisible; uses `$effect` for listener lifecycle:
```svelte
<script lang="ts">
  import { keyMap, shortcutKey } from './keymap.js';
  $effect(() => {
    function handleKeydown(e: KeyboardEvent) {
      const target = e.target as HTMLElement;
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) return;
      const handler = keyMap[shortcutKey(e)];
      if (handler) { e.preventDefault(); handler(); }
    }
    window.addEventListener('keydown', handleKeydown);
    return () => window.removeEventListener('keydown', handleKeydown);
  });
</script>
```

**`+layout.svelte`** — add `<KeyboardManager />` alongside existing root components.

## Constitution Check (Post-Design)

All gates verified clean after Phase 1 design. No new violations introduced:
- No Tauri commands, no Rust changes, no FFmpeg involvement.
- No visible UI surface; shadcn-svelte/Tailwind not applicable.
- keyMap is a module singleton — not frontend state that bleeds into backend.
- All tooling uses Bun; `bun run quality` will be run as the final implementation gate.

