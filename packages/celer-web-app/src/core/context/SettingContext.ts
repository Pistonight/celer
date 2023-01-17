import React, { useContext } from "react";
import { MapDisplayModes, Themes, defaultSplitSetting, MapDisplay, splitSettings, Theme } from "core/settings";
import { LocalStorageWrapper } from "data/storage";
import { Consumer, emptyObject } from "data/util";

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

export const SettingContext = React.createContext<SettingContext>(emptyObject());
SettingContext.displayName = "SettingContext";
export const useAppSetting = ()=>useContext(SettingContext);
