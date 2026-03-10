export type SettingsDialogTriggerSource = "menubar" | "hotkey";

export type SettingsDialogOpenRequest = {
  source: SettingsDialogTriggerSource;
  triggerElement?: HTMLElement | null;
};

export type SettingsDialogState = {
  isOpen: boolean;
  triggerSource: SettingsDialogTriggerSource | null;
  focusReturnElement: HTMLElement | null;
  isUiReady: boolean;
  pendingOpenSource: SettingsDialogTriggerSource | null;
};
