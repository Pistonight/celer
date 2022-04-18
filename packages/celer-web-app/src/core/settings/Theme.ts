import { ReadonlyMapOf } from "data/util";
import { SettingItem, SettingStorage} from "./Setting";

export type Theme = SettingItem<Theme>;

export const Themes = {
	Default: {
		name: "Default",
		next: ()=>Themes.Granatus
	},
	Granatus: {
		name: "Granatus",
		next: ()=>Themes.Default
	},
} as ReadonlyMapOf<Theme>;

export const ThemeStorage = new SettingStorage("Theme", Themes, Themes.Default);
