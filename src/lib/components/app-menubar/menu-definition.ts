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
		items: [{ label: "(No actions yet)", disabled: true }]
	}
];
