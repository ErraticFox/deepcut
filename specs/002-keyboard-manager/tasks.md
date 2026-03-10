---
description: "Task list for Keyboard Shortcut Manager"
---

# Tasks: Keyboard Shortcut Manager

**Branch**: `002-keyboard-manager`  
**Input**: `specs/002-keyboard-manager/` — plan.md, spec.md, research.md, data-model.md, quickstart.md  
**Tests**: No test framework configured in this project. Manual verification per quickstart.md.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no unresolved dependencies)
- **[Story]**: User story label (US1, US2, US3)
- Exact file paths included in every task description

---

## Phase 1: Setup

**Purpose**: Create the directory structure and barrel file for the new component.

- [ ] T001 Create directory `src/lib/components/keyboard-manager/`

---

## Phase 2: Foundational — keymap module

**Purpose**: The `keymap.ts` module is a shared prerequisite — both the component (Phase 3) and the layout integration (Phase 5) depend on it. Must be complete before US1 implementation.

**⚠️ CRITICAL**: T002 must be complete before T003 and T005 can begin.

- [ ] T002 Implement `KeyMap` type, exported `keyMap` singleton, and `shortcutKey()` helper in `src/lib/components/keyboard-manager/keymap.ts`

**Checkpoint**: `keymap.ts` exports `KeyMap`, `keyMap`, and `shortcutKey` — ready for component and consumer use.

---

## Phase 3: User Story 1 — Shortcut Executes Registered Action (Priority: P1) 🎯 MVP

**Goal**: A registered shortcut fires its handler when pressed outside a form element.

**Independent Test**: Temporarily add `keyMap['Control+k'] = () => console.log('fired');` in `+layout.svelte`, press Ctrl+K, confirm log output, remove the test registration.

- [ ] T003 [US1] Implement `KeyboardManager.svelte` with `$effect` keydown listener and `keyMap` dispatch in `src/lib/components/keyboard-manager/KeyboardManager.svelte` (depends on T002)
- [ ] T004 [US1] Mount `<KeyboardManager />` in `src/routes/+layout.svelte` alongside `<ModeWatcher />` and `<AppMenubar />`

**Checkpoint**: App runs without errors; a test keyMap entry fires on the matching key combination.

---

## Phase 4: User Story 2 — Shortcuts Suppressed During Text Input (Priority: P2)

**Goal**: No shortcut handler fires when an `input`, `textarea`, or `select` element has focus.

**Independent Test**: Focus any `<input>` in the app, press a registered shortcut combination, confirm no handler fires. Repeat with `<textarea>` and `<select>`.

**Note**: This story is implemented as part of `KeyboardManager.svelte` — the `tagName` guard in `handleKeydown` covers it. If T003 was implemented correctly per the quickstart, this story is already satisfied. The task below is an explicit verification and hardening pass.

- [ ] T005 [US2] Verify and harden input-guard logic in `src/lib/components/keyboard-manager/KeyboardManager.svelte`: confirm `['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)` guard is present and covers all three element types (depends on T003)

**Checkpoint**: Shortcut handlers are silent while any of the three form element types has focus.

---

## Phase 5: User Story 3 — Unregistered Keys Pass Through Unaffected (Priority: P3)

**Goal**: Key combinations absent from the keyMap produce no handler call and no `preventDefault()`.

**Independent Test**: Press F12 — DevTools open. Press any unregistered combination — no console output and no event suppression observed in DevTools event listener panel.

**Note**: Like US2, correct US1 implementation already satisfies this story structurally (the `if (handler)` guard means `preventDefault` only fires on match). The task is an explicit correctness audit.

- [ ] T006 [US3] Audit `handleKeydown` in `src/lib/components/keyboard-manager/KeyboardManager.svelte`: confirm `e.preventDefault()` is called only inside the `if (handler)` branch, with no unconditional invocation before the lookup (depends on T003)

**Checkpoint**: F12 opens DevTools normally; no unregistered key combination is intercepted.

---

## Phase 6: Polish & Quality Gate

**Purpose**: Ensure code quality gates pass and the temporary test registration (if added during verification) is removed.

- [ ] T007 [P] Remove any temporary shortcut registrations added during manual testing in `src/routes/+layout.svelte`
- [ ] T008 Run `bun run quality` (`svelte-check` + ESLint + Prettier check + clippy + cargo fmt check) and fix any reported issues across all changed files

**Checkpoint**: `bun run quality` exits 0. Feature is complete and ready for merge.

---

## Dependencies & Execution Order

### Phase Dependencies

```
T001 (create dir)
  └─► T002 (keymap.ts)
        └─► T003 (KeyboardManager.svelte)
              ├─► T004 (layout integration)   [US1 complete]
              ├─► T005 (input guard audit)     [US2 complete]
              └─► T006 (pass-through audit)   [US3 complete]
                    └─► T007, T008            [Polish complete]
```

### Parallel Opportunities

- T004, T005, T006 all modify or audit different things but all depend on T003. Once T003 is merged, they can proceed in parallel.
- T007 and T008 can run in parallel once T004–T006 are complete.

### Within Each Story

- Core implementation (T003) before layout wiring (T004)
- Core implementation (T003) before guard audits (T005, T006)

---

## Parallel Example: After T003 is Complete

```
Parallel batch 1 (all depend only on T003):
  Task T004: Mount <KeyboardManager /> in src/routes/+layout.svelte
  Task T005: Verify input-guard in KeyboardManager.svelte
  Task T006: Audit preventDefault placement in KeyboardManager.svelte

Parallel batch 2 (after T004–T006):
  Task T007: Remove test registrations from +layout.svelte
  Task T008: Run bun run quality
```

---

## Implementation Strategy

### MVP (User Story 1 only)

1. T001 → T002 → T003 → T004
2. **STOP and VALIDATE**: register a test shortcut, confirm it fires, confirm layout loads cleanly
3. Demo-ready: the shortcut system is functional

### Full Delivery

1. T001 → T002 → T003 (sequential, foundational)
2. T004 + T005 + T006 (parallel once T003 done)
3. T007 + T008 (parallel, final gate)

### Total Task Count

| Phase | Tasks | Count |
|-------|-------|-------|
| Setup | T001 | 1 |
| Foundational | T002 | 1 |
| US1 (P1) | T003, T004 | 2 |
| US2 (P2) | T005 | 1 |
| US3 (P3) | T006 | 1 |
| Polish | T007, T008 | 2 |
| **Total** | | **8** |

---

## Notes

- US2 and US3 correctness is structural — if T003 is implemented per quickstart.md, both are satisfied by default. T005 and T006 are explicit verification passes, not new implementation work.
- No Rust changes. `bun run lint:rust` and `bun run format:rust:check` will be no-ops but are included in `bun run quality`.
- No new npm dependencies required.
