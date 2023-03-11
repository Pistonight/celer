import produce from "immer";
import React, { FunctionComponentElement } from "react";
import { SplitType } from "core/compiler";
import { Setting } from "core/context";
import { MapDisplayModes, MapValues, Themes, ThemeValues } from "core/settings";
import { SettingLabel, SettingToggle, SettingProps, SettingDropdown } from "./SettingsMenuItems";

export const StringToSetting: {[key: string]: React.FC<SettingProps>} = {
	settinglabel: SettingLabel,
	settingtoggle: SettingToggle,
	settingdropdown: SettingDropdown
};

enum SettingComponents {
	label = "settinglabel",
	toggle = "settingtoggle",
	dropdown = "settingdropdown"
}

export type ConfigSetting = {
	component: SettingComponents, //Name of the component to be rendered
	text: string, //text to be displayed in the component
	action: (draft: Setting) => void, //function to be passed to produce. This should take in a setting and change something about it
	value?: (setting: Setting) => boolean, // If the component requires it, this is a function that takes in a setting and outputs a boolean value
	values?: string[], // If the component requires it, this is an array of the values the component can have
	children?: ConfigSetting[], //This is an array of all the component's children
	actionWithValue?: (setting: number) => (draft: Setting) => void, // This returns a function with the same format as action based on an index
	getIndex?: (setting: Setting) => string, // returns the index if the component has one
}

export function render(config: ConfigSetting, setting: Setting, setSetting: (setting: Setting) => void): FunctionComponentElement<SettingProps>
{
	if(config.actionWithValue !== undefined && config.getIndex !== undefined)
	{
		return React.createElement(
			StringToSetting[config.component],
			{
				text: config.text,
				action: () => setSetting(produce(setting, config.action)),
				value: config.value?.(setting),
				values: config.values,
				selectedIndex: config.values?.indexOf(config.getIndex(setting)),
				actionWithValue: config.actionWithValue,
				actionWithValueUpdate: (func: (draft: Setting) => void) => setSetting(produce(setting, func)),
			},
			config.children && config.children.map(c => render(c, setting, setSetting))
		);
	}
	return React.createElement(
		StringToSetting[config.component],
		{
			text: config.text,
			action: () => setSetting(produce(setting, config.action)),
			value: config.value?.(setting),
		},
		config.children && config.children.map(c => render(c, setting, setSetting))
	);
}

export const MapConfig = [
	{
		component: SettingComponents.dropdown,
		text: "Map Display",
		action: () => {return;},
		value: () => {return false;},
		values: MapValues,
		actionWithValue: (setting: number) =>
		{
			return (draft: Setting) =>
			{
				draft.mapDisplay = MapDisplayModes[MapValues[setting]];
			};
		},
		getIndex: (setting: Setting) =>
		{
			return setting.mapDisplay.name;
		}
	}
];

export const DocumentConfig = [
	{
		component: SettingComponents.dropdown,
		text: "Theme",
		action: () => {return;},
		value: () => {return false;},
		values: ThemeValues,
		actionWithValue: (setting: number) =>
		{
			return (draft: Setting) =>
			{
				draft.theme = Themes[ThemeValues[setting]];
			};
		},
		getIndex: (setting: Setting) =>
		{
			return setting.theme.name;
		}
	},
	{
		component: SettingComponents.label,
		text: "Split Settings",
		action: () => {return;},
		value: () => {return false;},
		children: [
			{
				component: SettingComponents.toggle,
				text: "Shrine",
				action: (draft: Setting) => {
					draft.splitSettings[SplitType.Shrine] = !draft.splitSettings[SplitType.Shrine];
				},
				value: (setting: Setting) => {
					return setting.splitSettings[SplitType.Shrine];
				}
			},
			{
				component: SettingComponents.toggle,
				text: "Tower",
				action: (draft: Setting) => {
					draft.splitSettings[SplitType.Tower] = !draft.splitSettings[SplitType.Tower];
				},
				value: (setting: Setting) => {
					return setting.splitSettings[SplitType.Tower];
				}
			},
			{
				component: SettingComponents.toggle,
				text: "Memory",
				action: (draft: Setting) => {
					draft.splitSettings[SplitType.Tower] = !draft.splitSettings[SplitType.Tower];
				},
				value: (setting: Setting) => {
					return setting.splitSettings[SplitType.Memory];
				}
			},
			{
				component: SettingComponents.toggle,
				text: "Warp",
				action: (draft: Setting) => {
					draft.splitSettings[SplitType.Warp] = !draft.splitSettings[SplitType.Warp];
				},
				value: (setting: Setting) => {
					return setting.splitSettings[SplitType.Warp];
				}
			},
			{
				component: SettingComponents.toggle,
				text: "Boss",
				action: (draft: Setting) => {
					draft.splitSettings[SplitType.Hinox] = !draft.splitSettings[SplitType.Hinox];
					draft.splitSettings[SplitType.Talus] = !draft.splitSettings[SplitType.Talus];
					draft.splitSettings[SplitType.Molduga] = !draft.splitSettings[SplitType.Molduga];
				},
				value: (setting: Setting) => {
					return setting.splitSettings[SplitType.Hinox];
				}
			},
			{
				component: SettingComponents.toggle,
				text: "Korok",
				action: (draft: Setting) => {
					draft.splitSettings[SplitType.Korok] = !draft.splitSettings[SplitType.Korok];
				},
				value: (setting: Setting) => {
					return setting.splitSettings[SplitType.Korok];
				}
			},
			{
				component: SettingComponents.toggle,
				text: "Other",
				action: (draft: Setting) => {
					draft.splitSettings[SplitType.UserDefined] = !draft.splitSettings[SplitType.UserDefined];
				},
				value: (setting: Setting) => {
					return setting.splitSettings[SplitType.UserDefined];
				}
			},
			{
				component: SettingComponents.toggle,
				text: "Enable Subsplits",
				action: (draft: Setting) => {
					draft.enableSubsplits = !draft.enableSubsplits;
				},
				value: (setting: Setting) => {
					return setting.enableSubsplits;
				}
			},
		]
	}
];
