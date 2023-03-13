import { Setting } from "core/context";

export interface SettingProps {
	text: string;
	action: () => void;
	value?: boolean;
	toolip?: string;
	values?: string[];
	selectedIndex?: number;
	actionWithValue?: (setting: number) => (draft: Setting) => void;
	actionWithValueUpdate?: (updateFunction: (draft: Setting) => void) => void;
}