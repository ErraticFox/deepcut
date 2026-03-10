import { openSettingsDialog } from "$lib/components/settings-dialog/controller.js";

export type MenuItemDefinition = {
  label: string;
  disabled?: boolean;
  action?: () => void;
};

export type MenuGroupDefinition = {
  label: string;
  items: MenuItemDefinition[];
};

export const MENU_DEFINITION: MenuGroupDefinition[] = [
  {
    label: "File",
    items: [
      {
        label: "Settings",
        action: () => openSettingsDialog({ source: "menubar" }),
      },
    ],
  },
];
