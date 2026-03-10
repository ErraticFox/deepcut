# Feature Specification: Keyboard Shortcut Manager

**Feature Branch**: `002-keyboard-manager`  
**Created**: 2026-03-09  
**Status**: Draft  
**Input**: User description: "Foundation for the keyboard shortcuts. Future features will have keybinds, this will be the centralized manager."

## Constitution Alignment *(mandatory)*

- This feature introduces no Tauri commands; it is a pure frontend component.
- No payload/response types are required in `src/lib/types` for this foundation layer; future shortcut-bound commands will add their own types when implemented.
- No heavy processing or file I/O is introduced; all logic is event-driven UI code.
- The component carries no visible UI; shadcn-svelte and Tailwind are not applicable to this component. Any future visible shortcut indicator UI must use shadcn-svelte and Tailwind utility classes.
- No FFmpeg behavior is introduced or modified.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Shortcut Executes Registered Action (Priority: P1)

A user presses a registered keyboard shortcut (e.g., Ctrl+S) while the main application view is focused, and the correct application action fires immediately without any browser default behavior interfering.

**Why this priority**: This is the primary value of the system — without it, no other shortcut feature can be built. All future keybind work depends on this working correctly.

**Independent Test**: Can be fully tested by registering a test handler in the keyMap, focusing the app window, pressing the mapped key combination, and confirming the handler was called and the browser default was suppressed.

**Acceptance Scenarios**:

1. **Given** the app is open with a shortcut registered for `Control+s`, **When** the user presses Ctrl+S with no form element focused, **Then** the registered handler fires.
2. **Given** a shortcut registered for `Control+Shift+z`, **When** the user presses Ctrl+Shift+Z, **Then** the correct handler fires.

---

### User Story 2 - Shortcuts Suppressed During Text Input (Priority: P2)

A user is actively typing in a text field, search box, or dropdown. Pressing key combinations that happen to match registered shortcuts does not trigger those shortcuts, preserving the user's ability to type normally.

**Why this priority**: Without this protection, registered shortcuts would constantly fire while users type, making text input unusable.

**Independent Test**: Can be fully tested by focusing an input element and pressing a registered shortcut key combination, confirming no handler fires.

**Acceptance Scenarios**:

1. **Given** a shortcut registered for `Control+s` and an input field is focused, **When** the user presses Ctrl+S, **Then** the shortcut handler does NOT fire.
2. **Given** a textarea element is focused, **When** the user presses any registered shortcut combination, **Then** no shortcut handler fires.
3. **Given** a select dropdown is focused, **When** the user presses a registered shortcut combination, **Then** no shortcut handler fires.
4. **Given** a non-input element (e.g., a div or button) is focused, **When** the user presses a registered shortcut, **Then** the shortcut handler fires normally.

---

### User Story 3 - Unregistered Keys Pass Through Unaffected (Priority: P3)

Key combinations that are not in the keyMap are completely ignored by the shortcut system and pass through without any interference, preserving OS-level and application-default behaviors the app has not explicitly owned.

**Why this priority**: Selective interception is a correctness guarantee; calling `preventDefault()` on unregistered keys would silently break behaviors the app did not intend to control.

**Independent Test**: Can be fully tested by pressing any key combination absent from the keyMap and confirming that no handler fires and no `preventDefault()` is called on the event.

**Acceptance Scenarios**:

1. **Given** a key combination is not present in the keyMap, **When** the user presses that combination, **Then** no handler fires and the event is not prevented.
2. **Given** a shortcut IS registered for `Control+z`, **When** the user presses Ctrl+Z, **Then** the registered handler fires and the event is prevented.
3. **Given** a shortcut is removed from the keyMap at runtime, **When** the user presses that combination, **Then** it is treated as unregistered and passes through.
4. **Given** F12 is not in the keyMap, **When** the developer presses F12 during development, **Then** the DevTools open normally and the event is not prevented.

---

### Edge Cases

- What happens when two shortcuts share a prefix but differ in modifiers (e.g., `Control+s` and `Control+Shift+s`)? Both must be independently resolved and dispatched correctly.
- What happens when the app component is unmounted and remounted? The window listener must be removed on destroy and re-added on mount with no duplicate listeners.
- What happens if a registered shortcut handler throws an error? The error must not crash the shortcut system or swallow the event silently — errors should propagate normally.
- What happens when `event.key` differs by platform (e.g., some browsers report `Control` vs `Ctrl`)? The keyMap format must use a consistent canonical representation.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST provide a single, reusable Svelte component (`KeyboardManager`) that can be mounted once at the application root without rendering any visible UI.
- **FR-002**: The component MUST attach a `keydown` event listener to the `window` object on mount and remove it on destroy, leaving no listener leaks.
- **FR-003**: The component MUST expose or internally define a `keyMap` — a registry that maps canonical shortcut strings (format: `Modifier+Key`, e.g., `Control+s`) to handler functions.
- **FR-004**: The system MUST support shortcut strings with one or more modifiers from the set: `Control`, `Shift`, `Alt`, applied in a consistent, deterministic order.
- **FR-005**: The system MUST call `event.preventDefault()` exclusively when the pressed key combination matches a registered entry in the `keyMap`.
- **FR-006**: The system MUST silently ignore all keydown events when the event target is an `input`, `textarea`, or `select` element.
- **FR-007**: The system MUST use Bun for all JS/TS package management and task execution.

### Key Entities

- **keyMap**: The central shortcut registry. Maps a canonical shortcut string (e.g., `Control+s`) to a zero-argument handler function. This is the single source of truth for all registered shortcuts in the application.
- **Shortcut String**: A normalized string representing a key combination. Modifiers appear first in the order `Control`, `Alt`, `Shift`, followed by the primary key, separated by `+`. Example: `Control+Shift+z`.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Registered shortcuts execute their associated handler within one animation frame of the keydown event, with no perceptible delay under normal conditions.
- **SC-002**: Zero registered shortcut handlers fire while any `input`, `textarea`, or `select` element holds focus, across all registered shortcut combinations.
- **SC-003**: Zero `preventDefault()` calls occur for any key combination not explicitly registered in the keyMap, verified by event inspection.
- **SC-004**: Adding a new application shortcut requires a change to exactly one location in the codebase (the keyMap registry).
- **SC-005**: Zero window-level keyboard event listeners remain after the `KeyboardManager` component is unmounted, verified by inspection.

## Assumptions

- The initial `keyMap` will be empty; population is deferred to individual feature implementations that need keybinds.
- Shortcut string keys use the canonical values from the DOM `KeyboardEvent.key` property (e.g., `Control`, `Shift`, `Alt`, `s`, `z`) — not legacy `keyCode` values or browser-specific aliases.
- Modifier key order in the shortcut string is normalized as: `Control` → `Alt` → `Shift` → primary key.
- Conflict detection between registered shortcuts (two entries mapping the same combination to different handlers) is out of scope for this foundation; behavior is undefined and will be addressed in a future iteration if needed.
- The `KeyboardManager` is mounted exactly once in the app root; multi-instance behavior is not a requirement.
