# Tasks: Menubar Foundation

**Input**: Design documents from `specs/001-menubar/`
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, quickstart.md ✅

**Tests**: No automated unit tests — this feature contains no business logic to test.
Validation is performed via `bun run check` (svelte-check) after each story phase.
Manual smoke test defined in quickstart.md is the acceptance gate.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this belongs to (US1, US2)
- Exact file paths included in every task description

---

## Phase 1: Setup

**Purpose**: Install the shadcn-svelte Menubar primitives — prerequisite for all implementation work.

- [X] T001 Install shadcn-svelte Menubar component: `bun x shadcn-svelte@latest add menubar` — generates `src/lib/components/ui/menubar/`

**Checkpoint**: `src/lib/components/ui/menubar/index.ts` exists and exports Menubar primitives

---

## Phase 2: User Story 1 — Menubar Renders in App Layout (Priority: P1) 🎯 MVP

**Goal**: Mount a visible, persistent menubar at the top of the application on every route.

**Independent Test**: Run `bun run tauri dev`, navigate between any two routes, confirm the menubar bar element is rendered above page content on both and does not flicker.

### Implementation for User Story 1

- [X] T002 [US1] Create `src/lib/components/app-menubar/AppMenubar.svelte` — Menubar.Root shell that imports from `$lib/components/ui/menubar/index.js` (empty, no menu groups yet)
- [X] T003 [US1] Mount `<AppMenubar />` at the top of `src/routes/+layout.svelte` above `{@render children()}` with import from `$lib/components/app-menubar/AppMenubar.svelte`
- [X] T004 [US1] Run `bun run check` — verify 0 type errors after layout change

**Checkpoint**: App launches, a menubar bar is visible at the top of the window on every route, `bun run check` passes with 0 errors

---

## Phase 3: User Story 2 — Menubar Contains at Least One Menu Group (Priority: P2)

**Goal**: Wire a typed menu definition into AppMenubar so the "File" menu group renders, opens on click, shows a disabled placeholder item, and closes on Escape or outside-click.

**Independent Test**: Click "File" in the menubar — a dropdown opens with at least one item (disabled placeholder). Press Escape — dropdown closes. Both dark and light mode render without console errors.

### Implementation for User Story 2

- [X] T005 [P] [US2] Create `src/lib/components/app-menubar/menu-definition.ts` — export `MenuItemDefinition`, `MenuGroupDefinition` types and `MENU_DEFINITION` constant with one "File" group containing a single `{ label: "(No actions yet)", disabled: true }` item
- [X] T006 [US2] Update `src/lib/components/app-menubar/AppMenubar.svelte` to import `MENU_DEFINITION` and iterate over groups/items using `Menubar.Menu`, `Menubar.Trigger`, `Menubar.Content`, `Menubar.Item` primitives (depends on T005)
- [X] T007 [US2] Run `bun run check` — verify 0 type errors after full component wiring
- [X] T007a [US2] Launch app via `bun run tauri dev` with system dark mode active; verify menubar renders with correct theme colors and produces no console errors; repeat with light mode (covers FR-006, SC-003)

**Checkpoint**: "File" menu opens and closes via click and Escape; disabled item renders without errors; `bun run check` passes; both light and dark mode validated explicitly

---

## Phase 4: Polish & Cross-Cutting Concerns

**Purpose**: Final validation and confirm extensibility contract holds.

- [X] T008 Verify SC-004 extensibility: add a second group entry to `MENU_DEFINITION` in `src/lib/components/app-menubar/menu-definition.ts`, confirm it appears in the menubar with zero changes to `+layout.svelte` or `AppMenubar.svelte`, then revert
- [X] T009 Run `bun run check` for final clean-slate validation — must produce 0 errors and 0 warnings

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies — start immediately
- **Phase 2 (US1)**: Depends on Phase 1 (T001 must be complete)
- **Phase 3 (US2)**: Depends on Phase 2 completion (T002, T003 must be complete before T006)
- **Phase 4 (Polish)**: Depends on Phase 3 completion

### User Story Dependencies

- **US1 (P1)**: Blocked only by Phase 1 setup (T001)
- **US2 (P2)**: Depends on US1 — `AppMenubar.svelte` must exist before it can be updated (T006 depends on T002)

### Within Each User Story

- US1: T002 → T003 → T004 (sequential; each step builds on the last)
- US2: T005 can run in parallel with T002/T003 during US1 if desired; T006 requires T002 and T005 both complete

### Parallel Opportunities

- **T005 [P]**: `menu-definition.ts` has no dependencies on any other task — can be written in parallel with T002/T003 during US1 if desired

### Implementation Strategy (MVP First)

- **MVP = Phase 3 (US1) complete**: App has a visible, persistent menubar bar — qualifies as a deliverable increment
- **Full feature = Phase 4 (US2) complete**: Menubar is interactive with the File group foundation — ready for future features to wire in menu items
- **Suggested order**: T001 → T002 → T003 → T004 → T005+T006 → T007 → T007a → T008 → T009

### Task Count Summary

| Phase | Story | Tasks | Notes |
|-------|-------|-------|-------|
| Phase 1 | Setup | 1 | T001 |
| Phase 2 | US1 (P1) | 3 | T002–T004 |
| Phase 3 | US2 (P2) | 4 | T005–T007, T007a |
| Phase 4 | Polish | 2 | T008–T009 |
| **Total** | | **10** | |
