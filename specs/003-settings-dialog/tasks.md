# Tasks: Settings Dialog Foundation

**Input**: Design documents from `/specs/003-settings-dialog/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: No automated test tasks are included because the specification does not explicitly request TDD or new automated test coverage; validation is performed through the independent manual test criteria per story and final quality gates.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Create the feature module skeleton used by all stories.

- [ ] T001 Create settings dialog component directory and barrel export in `src/lib/components/settings-dialog/index.ts`
- [ ] T002 Create settings dialog constants for dialog id and default shortcut in `src/lib/components/settings-dialog/constants.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Shared dialog state and root mounting required before story-specific entry points.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [ ] T003 Create shared settings dialog controller with single-instance open/close actions in `src/lib/components/settings-dialog/controller.ts`
- [ ] T004 [P] Add trigger source and focus-return tracking types in `src/lib/components/settings-dialog/types.ts`
- [ ] T005 Create baseline `SettingsDialog` shell bound to controller open state in `src/lib/components/settings-dialog/SettingsDialog.svelte`
- [ ] T006 Mount `SettingsDialog` at app layout level in `src/routes/+layout.svelte`

**Checkpoint**: Foundation ready; user stories can now be implemented.

---

## Phase 3: User Story 1 - Open Settings From Menubar (Priority: P1) 🎯 MVP

**Goal**: User can open Settings from menubar and always reach the same dialog instance.

**Independent Test**: Launch app, select Settings in menubar, verify dialog opens and repeated selection focuses existing dialog.

- [ ] T007 [US1] Add a `Settings` menubar item definition in `src/lib/components/app-menubar/menu-definition.ts`
- [ ] T008 [US1] Wire the menubar Settings action to controller `open` with source `menubar` in `src/lib/components/app-menubar/menu-definition.ts`
- [ ] T009 [US1] Ensure repeated menubar invocation is idempotent and re-focuses existing dialog in `src/lib/components/settings-dialog/controller.ts`

**Checkpoint**: User Story 1 is independently functional.

---

## Phase 4: User Story 2 - Open Settings From Hotkey (Priority: P1)

**Goal**: User can open Settings via `Control+,` using the same dialog instance as menubar.

**Independent Test**: Launch app, press `Control+,`, verify dialog opens and repeated keypress does not create duplicates.

- [ ] T010 [US2] Register `Control+,` settings hotkey handler in `src/lib/components/keyboard-manager/keymap.ts`
- [ ] T011 [US2] Wire hotkey handler to controller `open` with source `hotkey` in `src/lib/components/keyboard-manager/keymap.ts`
- [ ] T012 [US2] Preserve keyboard-manager input-field exclusion behavior while adding settings hotkey in `src/lib/components/keyboard-manager/KeyboardManager.svelte`

**Checkpoint**: User Story 2 is independently functional.

---

## Phase 5: User Story 3 - Use Accessible Dialog Shell (Priority: P2)

**Goal**: Dialog shell is accessible, properly labeled, keyboard-usable, and restores focus on close.

**Independent Test**: Open dialog from either entry point, verify title/semantics, focus trap, keyboard close, and focus return.

- [ ] T013 [US3] Implement accessible dialog title and description using shadcn-svelte dialog primitives in `src/lib/components/settings-dialog/SettingsDialog.svelte`
- [ ] T014 [US3] Implement focus capture on open and focus restore on close in `src/lib/components/settings-dialog/controller.ts`
- [ ] T015 [US3] Connect dialog close events to controller focus-return workflow in `src/lib/components/settings-dialog/SettingsDialog.svelte`
- [ ] T016 [US3] Add guard handling for open requests before UI readiness in `src/lib/components/settings-dialog/controller.ts`

**Checkpoint**: User Story 3 is independently functional.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final integration validation and documentation alignment.

- [ ] T017 [P] Update settings invocation behavior notes in `specs/003-settings-dialog/quickstart.md`
- [ ] T018 Run full quality gate and resolve issues with `bun run quality` from `D:\repos\deepcut`
- [ ] T019 Run manual quickstart validation scenarios and record completion notes in `specs/003-settings-dialog/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies.
- **Phase 2 (Foundational)**: Depends on Phase 1 and blocks all user stories.
- **Phase 3 (US1)**: Depends on Phase 2.
- **Phase 4 (US2)**: Depends on Phase 2.
- **Phase 5 (US3)**: Depends on Phase 2 and can proceed after or alongside US1/US2 when merge conflicts are managed.
- **Phase 6 (Polish)**: Depends on completion of all targeted user stories.

### User Story Dependencies

- **US1 (P1)**: No dependency on other user stories.
- **US2 (P1)**: No dependency on other user stories.
- **US3 (P2)**: No strict dependency on US1/US2, but validates behavior that spans both entry points.

### Within Each User Story

- Implement state/action wiring before final behavior validation.
- Complete story-level behavior checks before advancing to polish.

### Parallel Opportunities

- Setup task `T002` can run in parallel with `T001` after directory creation starts.
- Foundational task `T004` can run in parallel with `T003`.
- After Phase 2, US1 and US2 can be implemented in parallel by different developers.
- Polish task `T017` can run in parallel with technical verification prep before `T018`.

---

## Parallel Example: User Story 1

```bash
# US1 is mostly single-file work in menu-definition.ts.
# Parallelism is limited within the story to avoid merge conflicts.
Task: "T007 [US1] Add a Settings menubar item definition in src/lib/components/app-menubar/menu-definition.ts"
Task: "T009 [US1] Ensure repeated menubar invocation is idempotent and re-focuses existing dialog in src/lib/components/settings-dialog/controller.ts"
```

## Parallel Example: User Story 2

```bash
# Implement hotkey registration while preserving keyboard-manager behavior.
Task: "T010 [US2] Register Control+, settings hotkey handler in src/lib/components/keyboard-manager/keymap.ts"
Task: "T012 [US2] Preserve keyboard-manager input-field exclusion behavior while adding settings hotkey in src/lib/components/keyboard-manager/KeyboardManager.svelte"
```

## Parallel Example: User Story 3

```bash
# Accessibility shell and focus-return logic can be developed concurrently.
Task: "T013 [US3] Implement accessible dialog title and description in src/lib/components/settings-dialog/SettingsDialog.svelte"
Task: "T014 [US3] Implement focus capture on open and focus restore on close in src/lib/components/settings-dialog/controller.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1 and Phase 2.
2. Complete Phase 3 (US1).
3. Validate menubar-only flow as a releasable MVP.

### Incremental Delivery

1. Deliver US1 (menubar) after foundation.
2. Deliver US2 (hotkey) using same dialog controller.
3. Deliver US3 (accessibility shell hardening).
4. Complete polish and quality gates.

### Parallel Team Strategy

1. Developer A: US1 (`menu-definition.ts`).
2. Developer B: US2 (`keymap.ts`, `KeyboardManager.svelte`).
3. Developer C: US3 (`SettingsDialog.svelte`, `controller.ts`).
4. Merge to Phase 6 for full validation.
