# Research: Settings Dialog Foundation

## Decision 1: Build dialog shell with shadcn-svelte Dialog primitive
- Decision: Use the project-standard `shadcn-svelte` dialog primitive as the settings shell container.
- Rationale: The constitution requires `shadcn-svelte` + Tailwind for UI consistency, and the dialog primitive already covers keyboard/focus accessibility behaviors expected for modal UI.
- Alternatives considered:
  - Native `<dialog>` element: rejected due to style/system inconsistency risk and custom focus handling burden.
  - Custom modal implementation: rejected as unnecessary complexity and higher accessibility regression risk.

## Decision 2: Use single source of truth for dialog visibility
- Decision: Keep a single shared settings-dialog open state in frontend UI state so menubar and hotkey invoke the same open action.
- Rationale: Requirement FR-004/FR-005 demands single-instance behavior across multiple entry points.
- Alternatives considered:
  - Separate per-trigger handlers with local state: rejected because race conditions and duplicate-instance bugs become more likely.
  - Backend-managed state via Tauri command: rejected because this feature is frontend-only UI shell behavior.

## Decision 3: Define default hotkey as `Control+,` on Windows/Linux
- Decision: Register `Control+,` as the Settings shortcut for the initial foundation implementation.
- Rationale: It is a common settings shortcut in desktop applications and maps directly into the existing keyboard manager key normalization model.
- Alternatives considered:
  - `Control+.`: rejected because it is less conventional for opening app settings.
  - Platform-specific modifier split (`Meta+,` on macOS): deferred because current workspace target is Windows-first and macOS behavior is not in this feature scope.

## Decision 4: Integrate menubar action through existing menu definition object
- Decision: Add a concrete `Settings` item and action in `src/lib/components/app-menubar/menu-definition.ts` and dispatch to the shared open-settings action.
- Rationale: This matches existing menubar architecture where actions are declarative in `MENU_DEFINITION`.
- Alternatives considered:
  - Inline action wiring in `AppMenubar.svelte`: rejected because it bypasses existing menu-definition pattern and reduces maintainability.

## Decision 5: Keep feature frontend-only with no Tauri command changes
- Decision: Do not introduce any new Tauri commands, Rust modules, or FFmpeg interactions.
- Rationale: The requested feature is interaction and dialog foundation only; no backend processing is required.
- Alternatives considered:
  - Tauri command to toggle dialog from backend: rejected as unnecessary IPC and state coupling for UI-only behavior.
