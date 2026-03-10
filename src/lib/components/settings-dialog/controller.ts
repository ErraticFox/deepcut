import { get, writable } from "svelte/store";
import type { SettingsDialogOpenRequest, SettingsDialogState } from "./types.js";

const initialState: SettingsDialogState = {
  isOpen: false,
  triggerSource: null,
  focusReturnElement: null,
  isUiReady: false,
  pendingOpenSource: null,
};

let dialogNode: HTMLElement | null = null;

export const settingsDialogState = writable<SettingsDialogState>(initialState);

function getActiveElement(): HTMLElement | null {
  if (typeof document === "undefined") return null;
  return document.activeElement instanceof HTMLElement ? document.activeElement : null;
}

function focusDialogNode(): void {
  if (typeof window === "undefined") return;

  window.requestAnimationFrame(() => {
    dialogNode?.focus();
  });
}

export function registerSettingsDialogNode(node: HTMLElement | null): void {
  dialogNode = node;
}

export function setSettingsDialogUiReady(isReady: boolean): void {
  settingsDialogState.update((state) => {
    const nextState: SettingsDialogState = {
      ...state,
      isUiReady: isReady,
    };

    if (isReady && state.pendingOpenSource) {
      nextState.isOpen = true;
      nextState.triggerSource = state.pendingOpenSource;
      nextState.pendingOpenSource = null;
    }

    return nextState;
  });

  if (isReady && get(settingsDialogState).isOpen) {
    focusDialogNode();
  }
}

export function openSettingsDialog(request: SettingsDialogOpenRequest): void {
  const activeElement = request.triggerElement ?? getActiveElement();
  const currentState = get(settingsDialogState);

  if (!currentState.isUiReady) {
    settingsDialogState.update((state) => ({
      ...state,
      triggerSource: request.source,
      focusReturnElement: activeElement,
      pendingOpenSource: request.source,
    }));
    return;
  }

  if (currentState.isOpen) {
    settingsDialogState.update((state) => ({
      ...state,
      triggerSource: request.source,
      focusReturnElement: activeElement,
    }));
    focusDialogNode();
    return;
  }

  settingsDialogState.update((state) => ({
    ...state,
    isOpen: true,
    triggerSource: request.source,
    focusReturnElement: activeElement,
    pendingOpenSource: null,
  }));

  focusDialogNode();
}

export function closeSettingsDialog(): void {
  const { focusReturnElement } = get(settingsDialogState);

  settingsDialogState.update((state) => ({
    ...state,
    isOpen: false,
    triggerSource: null,
    pendingOpenSource: null,
  }));

  if (focusReturnElement && typeof window !== "undefined") {
    window.requestAnimationFrame(() => {
      focusReturnElement.focus();
    });
  }
}

export function onSettingsDialogOpenChange(nextOpen: boolean): void {
  const state = get(settingsDialogState);

  if (nextOpen === state.isOpen) {
    return;
  }

  if (!nextOpen) {
    closeSettingsDialog();
  }
}
