import {
  SETTINGS_DIALOG_SHORTCUT,
  openSettingsDialog,
} from "$lib/components/settings-dialog/index.js";

export type KeyMap = Record<string, () => void>;

export const keyMap: KeyMap = {
  [SETTINGS_DIALOG_SHORTCUT]: () => openSettingsDialog({ source: "hotkey" }),
};

export function shortcutKey(event: KeyboardEvent): string {
  const modifiers: string[] = [];

  if (event.ctrlKey) modifiers.push("Control");
  if (event.altKey) modifiers.push("Alt");
  if (event.shiftKey) modifiers.push("Shift");

  const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
  return [...modifiers, key].join("+");
}
