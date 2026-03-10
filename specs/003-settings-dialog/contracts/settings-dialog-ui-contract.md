# UI Contract: Settings Dialog Foundation

## Contract Scope
This contract defines user-visible interaction guarantees for opening and closing the Settings dialog in the desktop app.

## Entry Points
- Menubar entry point:
  - A `Settings` action exists in the menubar and is enabled when the main window is active.
  - Activating the action opens the Settings dialog.
- Hotkey entry point:
  - Shortcut `Control+,` is registered for the focused app window.
  - Triggering the shortcut opens the Settings dialog.

## Behavioral Guarantees
- Single-instance: only one Settings dialog can be open at a time.
- Idempotent open: invoking either trigger while open focuses the existing dialog instead of creating another.
- Accessibility:
  - Dialog presents an accessible title identifying it as Settings.
  - Focus moves into the dialog when it opens.
  - Focus is trapped while the dialog is open.
  - Focus returns to invoking context when the dialog closes.

## Error/Boundary Handling
- If invocation occurs before UI is ready, app remains stable and no crash occurs.
- Concurrent invocation from menubar/hotkey still resolves to one focused dialog.

## Out of Scope
- Persistent settings storage.
- Backend/Tauri command changes.
- FFmpeg or media pipeline behavior.
