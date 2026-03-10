# Feature Specification: Settings Dialog Foundation

**Feature Branch**: `003-settings-dialog`  
**Created**: 2026-03-09  
**Status**: Draft  
**Input**: User description: "Settings Dialog: This should be the foundation for the settings dialog. Requirements: 1. It MUST be accessible via menubar 2. It MUST be accessible via hotkey"

## Constitution Alignment *(mandatory)*

- This feature does not introduce or modify Tauri commands.
- This feature does not require new or changed command payload/response types in `src/lib/types`.
- Heavy processing and file I/O remain in Rust; this feature is UI navigation and dialog presentation only.
- UI implementation will use project-standard `shadcn-svelte` and Tailwind utility classes.
- This feature introduces no FFmpeg behavior.

## User Scenarios & Testing *(mandatory)*

<!--
  IMPORTANT: User stories should be PRIORITIZED as user journeys ordered by importance.
  Each user story/journey must be INDEPENDENTLY TESTABLE - meaning if you implement just ONE of them,
  you should still have a viable MVP (Minimum Viable Product) that delivers value.
  
  Assign priorities (P1, P2, P3, etc.) to each story, where P1 is the most critical.
  Think of each story as a standalone slice of functionality that can be:
  - Developed independently
  - Tested independently
  - Deployed independently
  - Demonstrated to users independently
-->

### User Story 1 - Open Settings From Menubar (Priority: P1)

As an app user, I can open the Settings dialog from the menubar so I can discover and access configuration options through standard desktop navigation.

**Why this priority**: Menubar access is a core desktop expectation and is explicitly required.

**Independent Test**: Can be fully tested by launching the app, selecting the Settings menu action, and verifying the dialog opens and receives focus.

**Acceptance Scenarios**:

1. **Given** the app is running and the main window is visible, **When** the user selects the Settings action from the menubar, **Then** the Settings dialog opens.
2. **Given** the Settings dialog is already open, **When** the user selects the Settings action from the menubar again, **Then** no duplicate dialog instance is created and the existing dialog is focused.

---

### User Story 2 - Open Settings From Hotkey (Priority: P1)

As an app user, I can open the Settings dialog with a keyboard shortcut so I can access settings quickly without leaving the keyboard.

**Why this priority**: Hotkey access is explicitly required and improves speed and accessibility.

**Independent Test**: Can be fully tested by launching the app, triggering the assigned hotkey, and verifying the dialog opens and receives keyboard focus.

**Acceptance Scenarios**:

1. **Given** the app window is focused and the Settings dialog is closed, **When** the user presses the Settings hotkey, **Then** the Settings dialog opens.
2. **Given** the app window is focused and the Settings dialog is open, **When** the user presses the Settings hotkey, **Then** the existing dialog remains single-instance and is focused.

---

### User Story 3 - Use Accessible Dialog Shell (Priority: P2)

As an app user relying on keyboard and assistive technologies, I can interact with a properly labeled Settings dialog shell so future settings can be added without reworking accessibility basics.

**Why this priority**: This establishes the requested foundation while preventing future rework and accessibility regressions.

**Independent Test**: Can be fully tested by opening the dialog and verifying keyboard focus behavior, dialog labeling, and keyboard-based close behavior.

**Acceptance Scenarios**:

1. **Given** the dialog is opened by any entry point, **When** focus moves into the dialog, **Then** keyboard focus is contained within the dialog until it is closed.
2. **Given** the dialog is open, **When** the user closes it via standard keyboard interaction, **Then** focus returns to the UI element that triggered opening it.

---

### Edge Cases

- Menubar and hotkey are triggered nearly simultaneously; the app still results in one focused Settings dialog.
- Hotkey is pressed while a text-input control is focused; if the app reserves this hotkey globally in-app, it must still produce a consistent open/focus behavior.
- Trigger is invoked when modal UI is already active; app behavior should remain consistent and not leave focus in an unreachable state.
- Trigger is invoked during initial app load before UI is fully ready; action should fail gracefully without crash and should become available when ready.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST provide a Settings action in the menubar that is visible and enabled when the main app window is active.
- **FR-002**: Selecting the menubar Settings action MUST open the Settings dialog.
- **FR-003**: The system MUST provide a keyboard shortcut that opens the Settings dialog when the app window is focused.
- **FR-004**: Both menubar and hotkey entry points MUST target the same dialog instance.
- **FR-005**: The system MUST prevent duplicate Settings dialog instances from being opened from repeated or concurrent triggers.
- **FR-006**: When the dialog opens, keyboard focus MUST move into the dialog and remain contained until the dialog is closed.
- **FR-007**: When the dialog closes, keyboard focus MUST return to the control or context that triggered it.
- **FR-008**: The dialog MUST expose an accessible title and semantics so assistive technologies can identify it as a settings surface.
- **FR-009**: The initial implementation MUST provide a stable, reusable dialog shell suitable for adding settings categories and controls in later features.
- **FR-010**: If a trigger occurs before the UI is ready to display the dialog, the app MUST handle it without crash and without leaving the UI in an inconsistent state.

### Assumptions

- The existing keyboard manager can register a new Settings hotkey without introducing a conflicting global shortcut policy change.
- The Settings dialog in this feature is a foundation shell and does not need complete setting fields yet.
- Menubar structure supports adding a new Settings action within the existing app menu organization.

### Key Entities *(include if feature involves data)*

- **SettingsDialog**: Represents the user-visible settings surface; key attributes include open/closed state, accessible title, and current focus scope.
- **SettingsEntryPoint**: Represents an invocation source for opening settings; key attributes include source type (menubar or hotkey) and trigger context for focus return.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: In acceptance testing, 100% of users can open the Settings dialog from the menubar in a single interaction.
- **SC-002**: In acceptance testing, 100% of users can open the Settings dialog using the designated hotkey on first attempt.
- **SC-003**: Across repeated trigger tests (10 consecutive invocations per entry point), zero duplicate dialog instances are observed.
- **SC-004**: In keyboard-only accessibility testing, 100% of dialog sessions keep focus contained while open and return focus to the origin when closed.
