import { ReadonlyMapOf } from "data/util";
import { SettingItem, SettingStorage} from "./Setting";

export type OldTheme = SettingItem<OldTheme>;

export type Theme = {
	name: string,
	next: () => Theme
}

export const Themes: {[key: string]: Theme} =
{
	Default: {
		name: "Default",
		next: ()=>Themes.Granatus
	},
	Granatus: {
		name: "Granatus",
		next: ()=>Themes.Default
	},
};

export const OldThemes = {
	Default: {
		name: "Default",
		next: ()=>OldThemes.Granatus
	},
	Granatus: {
		name: "Granatus",
		next: ()=>OldThemes.Default
	},
} as ReadonlyMapOf<OldTheme>;

export const ThemeStorage = new SettingStorage("Theme", OldThemes, OldThemes.Default);
