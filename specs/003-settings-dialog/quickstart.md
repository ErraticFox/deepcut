# Quickstart: Settings Dialog Foundation

## Goal
Implement the first Settings dialog shell that can be opened from both menubar and hotkey, with accessible modal behavior and single-instance guarantees.

## Prerequisites
- Branch: `003-settings-dialog`
- Bun installed
- Tauri desktop app runs locally (`bun run tauri:dev`)

## Implementation Steps
1. Add dialog state and open/close actions.
- Introduce a shared frontend state location for settings dialog visibility.
- Ensure open action is idempotent and records trigger context for focus return.

2. Add menubar integration.
- Update `src/lib/components/app-menubar/menu-definition.ts` to include `Settings` action.
- Wire action to shared open-settings behavior.

3. Add hotkey integration.
- Register `Control+,` in `src/lib/components/keyboard-manager/keymap.ts`.
- Map handler to shared open-settings behavior.

4. Render dialog shell.
- Add a Settings dialog component under `src/lib/components/` using `shadcn-svelte` dialog primitives and Tailwind utilities.
- Include accessible title and keyboard-close behavior.

5. Mount dialog container.
- Ensure the dialog shell is mounted at app layout level so both entry points can open it.

6. Verify focus behavior.
- Confirm focus enters dialog on open, remains trapped while open, and returns to invoking element/context on close.

## Validation
- Run quality gates:
```bash
bun run quality
```

## Settings Invocation Notes
- Both menubar (`File -> Settings`) and `Control+,` invoke the same shared controller.
- Repeated invocation while already open is idempotent and re-focuses the existing dialog.
- If an open request arrives before UI mount readiness, the request is queued and applied once the dialog host is ready.

- Manual verification:
1. Launch app.
2. Open Settings via menubar.
3. Close and verify focus return.
4. Open Settings via `Control+,`.
5. Trigger open repeatedly from both paths and verify only one dialog exists.

## Validation Notes
- 2026-03-09: Automated quality gate passed with `bun run quality` after settings-dialog implementation.
- 2026-03-09: Manual desktop interaction validation pending in an interactive Tauri session.

## Expected Outcome
A reusable Settings dialog foundation is in place, accessible from both required entry points, and ready for future settings content features.
