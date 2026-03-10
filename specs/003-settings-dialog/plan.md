# Implementation Plan: Settings Dialog Foundation

**Branch**: `003-settings-dialog` | **Date**: 2026-03-09 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/003-settings-dialog/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Implement the settings dialog foundation as a frontend-only feature with one shared
open/close state and two entry points: menubar action and keyboard shortcut
(`Control+,`). The design ensures single-instance behavior, accessible dialog semantics,
focus containment, and deterministic focus return on close.

## Technical Context

**Language/Version**: TypeScript ~5.6.2, Svelte 5, Rust 1.75+ (unchanged)  
**Primary Dependencies**: SvelteKit (SSG), shadcn-svelte, Tailwind CSS, existing keyboard manager  
**Storage**: N/A (no persistence in this feature)  
**Testing**: `bun run quality` + manual Tauri interaction validation  
**Target Platform**: Tauri v2 desktop app (Windows primary)  
**Project Type**: Desktop application (Tauri + SvelteKit frontend)  
**Performance Goals**: Dialog opens within one interaction frame from either trigger path  
**Constraints**: No duplicate dialogs; focus trap and focus return required; no new Tauri commands  
**Scale/Scope**: Small UI foundation slice; menubar update, hotkey registration, dialog shell component

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] Heavy computation and filesystem-intensive operations are assigned to Rust
  (`src-tauri/`), not frontend Svelte code. ✓ No heavy processing in scope.
- [x] Every new/changed Tauri command has a typed TS contract planned under
  `src/lib/types`. ✓ No Tauri command changes.
- [x] UI work uses `shadcn-svelte` components and Tailwind utility classes; any
  exception is explicitly justified. ✓ Settings dialog shell uses shadcn-svelte dialog
  primitives and Tailwind utilities.
- [x] State ownership is declared: Svelte stores for global UI state, Tauri `State`
  for backend-managed persistence/runtime state. ✓ Dialog visibility state is frontend
  UI state only; no backend state change.
- [x] FFmpeg work is isolated to a dedicated Rust module and exposed only via Tauri
  command handlers. ✓ No FFmpeg involvement.
- [x] Tooling commands for JS/TS use Bun; `bun run lint` and `bun run format:check`
  pass for all JS/TS/Svelte changes. ✓ Bun tooling mandated for implementation.
- [x] Rust changes pass `bun run lint:rust` (clippy -D warnings) and
  `bun run format:rust:check` (cargo fmt --check). ✓ No Rust changes planned.
- [x] `bun run quality` gate is green before marking the feature complete.

## Project Structure

### Documentation (this feature)

```text
specs/003-settings-dialog/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── settings-dialog-ui-contract.md
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```text
src/
├── lib/
│   └── components/
│       ├── app-menubar/
│       │   ├── AppMenubar.svelte         # existing
│       │   └── menu-definition.ts        # update: add Settings action
│       ├── keyboard-manager/
│       │   ├── KeyboardManager.svelte    # existing listener host
│       │   └── keymap.ts                 # update: add Control+, handler
│       ├── settings-dialog/              # new
│       │   └── SettingsDialog.svelte
│       └── ui/                           # existing shadcn-svelte primitives
└── routes/
    └── +layout.svelte                    # mount SettingsDialog container
```

**Structure Decision**: Single-project desktop app layout; feature extends existing
component directories under `src/lib/components/`.

## Complexity Tracking

No constitution violations or complexity exceptions are required.

## Phase 0: Research Summary

All unknowns are resolved and documented in [research.md](research.md).

| Topic | Decision |
|-------|----------|
| Dialog primitive | Use `shadcn-svelte` dialog for accessibility + consistency |
| Shared visibility model | Single source of truth for dialog open state |
| Hotkey | `Control+,` for app-window scope |
| Menubar wiring | Add action in `menu-definition.ts` and dispatch shared open action |
| Backend impact | None (frontend-only; no Tauri/Rust changes) |

## Phase 1: Design Artifacts

### Data Model

See [data-model.md](data-model.md).

Primary entities:
- `SettingsDialogState`
- `SettingsEntryPoint`
- `SettingsHotkeyBinding`

### Contracts

See [contracts/settings-dialog-ui-contract.md](contracts/settings-dialog-ui-contract.md).

Contract type: UI interaction contract for desktop user-facing behavior.

### Quickstart

See [quickstart.md](quickstart.md) for implementation sequence and validation steps.

## Constitution Check (Post-Design)

All gates remain passing after design artifact generation:
- No new backend command contracts required.
- UI design stays in shadcn-svelte + Tailwind lane.
- State ownership remains frontend-local for dialog visibility.
- No FFmpeg or Rust changes introduced.
- Validation plan includes `bun run quality` before completion.
