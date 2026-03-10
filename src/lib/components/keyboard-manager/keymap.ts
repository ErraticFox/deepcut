export type KeyMap = Record<string, () => void>;

export const keyMap: KeyMap = {};

export function shortcutKey(event: KeyboardEvent): string {
  const modifiers: string[] = [];

  if (event.ctrlKey) modifiers.push("Control");
  if (event.altKey) modifiers.push("Alt");
  if (event.shiftKey) modifiers.push("Shift");

  const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
  return [...modifiers, key].join("+");
}
