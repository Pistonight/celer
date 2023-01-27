import React, { useContext } from "react";
import { SplitType } from "core/compiler";
import { OldMapDisplayMode, SplitTypeSetting, OldTheme, MapDisplayModes, Themes, defaultSplitSetting, MapDisplay, splitSettings, Theme } from "core/settings";
import { LocalStorageWrapper } from "data/storage";
import { Consumer, emptyObject } from "data/util";

export interface OldAppSetting {
	mapDisplayMode: OldMapDisplayMode,
	theme: OldTheme,
	splitSetting: SplitTypeSetting<boolean>,
	enableSubsplits: boolean,
}

interface OldAppSettingContextState extends OldAppSetting {
	setMapDisplayMode: Consumer<OldMapDisplayMode>,
	setTheme: Consumer<OldTheme>,
	setSplitSetting: (value: boolean, ...splitType: SplitType[])=>void,
	setEnableSubsplits: Consumer<boolean>,
}

export type Setting =
{
	theme: Theme
	mapDisplay: MapDisplay
	splitSettings: splitSettings
	enableSubsplits: boolean
}

export const save = (setting: Setting) => { return LocalStorageWrapper.store("Settings", setting);};
export const load = () => {
	const stored = LocalStorageWrapper.load("Settings", defaultSettings);
	const result = {
		...stored,
		theme: Themes[stored.theme.name],
		mapDisplay: MapDisplayModes[stored.mapDisplay.name],
	};
	return result;
};

interface SettingContext
{
    setting: Setting
    setSetting: Consumer<Setting>
}

export const defaultSettings =
{
	theme: Themes.Default,
	mapDisplay: MapDisplayModes.Auto,
	splitSettings: defaultSplitSetting,
	enableSubsplits: false,
};

export const OldSettingContext = React.createContext<OldAppSettingContextState>(emptyObject());
OldSettingContext.displayName = "SettingContext";
export const useOldAppSetting = ()=>useContext(OldSettingContext);
export const SettingContext = React.createContext<SettingContext>(emptyObject());
SettingContext.displayName = "SettingContext";
export const useAppSetting = ()=>useContext(SettingContext);
