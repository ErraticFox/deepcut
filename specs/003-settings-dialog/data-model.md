# Data Model: Settings Dialog Foundation

## Entity: SettingsDialogState
- Purpose: Represents the modal shell visibility and focus-return behavior for the settings dialog.
- Fields:
  - `isOpen: boolean` — whether the settings dialog is currently open.
  - `triggerSource: "menubar" | "hotkey" | null` — source of the most recent open action.
  - `focusReturnToken: string | null` — identifier/reference for restoring focus to trigger context after close.
- Validation rules:
  - `isOpen=true` implies exactly one active dialog instance.
  - `triggerSource` MUST be non-null when opening the dialog through supported entry points.

## Entity: SettingsEntryPoint
- Purpose: Describes how settings can be invoked.
- Fields:
  - `sourceType: "menubar" | "hotkey"`
  - `enabled: boolean`
  - `shortcut: string | null` (null for non-shortcut entry points)
- Validation rules:
  - At least one entry point MUST be enabled while app window is active.
  - Hotkey entry MUST define a normalized shortcut string when enabled.

## Entity: SettingsHotkeyBinding
- Purpose: Represents keyboard-manager registration for settings action.
- Fields:
  - `combo: string` (initially `Control+,`)
  - `handlerId: "open-settings-dialog"`
  - `scope: "app-window"`
- Validation rules:
  - `combo` MUST map to keyboard manager normalization format.
  - Only one binding per handlerId in keymap registry.

## Relationships
- `SettingsEntryPoint(sourceType=menubar)` invokes transition `closed -> open` on `SettingsDialogState`.
- `SettingsEntryPoint(sourceType=hotkey)` invokes transition `closed -> open` on `SettingsDialogState`.
- `SettingsHotkeyBinding` configures the hotkey-flavored `SettingsEntryPoint`.

## State Transitions
- `closed -> open`: triggered by menubar action or hotkey; modal gains focus.
- `open -> open` (idempotent): repeated trigger refocuses existing dialog; no duplicate instance.
- `open -> closed`: user dismisses dialog; focus returns to prior trigger context.
