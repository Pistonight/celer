import produce from "immer";
import { SplitType } from "core/compiler";
import { Setting, useAppSetting } from "core/context";
import { MapDisplayModes, MapValues, Themes, ThemeValues } from "core/settings";
import { SettingLabel, SettingToggle, SettingProps, SettingDropdown } from "./SettingsMenuItems";

export type SettingsContentProps = {
	component: React.ComponentType<SettingProps>, //Name of the component to be rendered
	text: string, //text to be displayed in the component
	action: (draft: Setting) => void, //function to be passed to produce. This should take in a setting and change something about it
	value?: (setting: Setting) => boolean, // If the component requires it, this is a function that takes in a setting and outputs a boolean value
	values?: string[], // If the component requires it, this is an array of the values the component can have
	subsettings?: SettingsContentProps[], //This is an array of all the component's children
	actionWithValue?: (setting: number) => (draft: Setting) => void, // This returns a function with the same format as action based on an index
	getIndex?: (setting: Setting) => string, // returns the index if the component has one
}

export const SettingsContent: React.FC<SettingsContentProps> = ({component, text, action, value, values, subsettings, actionWithValue, getIndex}) => {
	const {setting, setSetting} = useAppSetting();
	const SettingComponent = component;
	if(actionWithValue !== undefined && getIndex !== undefined)
	{
		return (
			<SettingComponent
				text={text}
				action={() => setSetting(produce(action))}
				value={value && value(setting)}
				values={values}
				selectedIndex={values?.indexOf(getIndex(setting))}
				actionWithValue={actionWithValue}
				actionWithValueUpdate={(func: (draft: Setting) => void) => setSetting(produce(func))}
			>
				{subsettings && subsettings.map((c, i) => <SettingsContent key={i} {...c}/>)}
			</SettingComponent>
		);
	}
	return (
		<SettingComponent
			text={text}
			action={() => setSetting(produce(action))}
			value={value && value(setting)}
		>
			{subsettings && subsettings.map((c, i) => <SettingsContent key={i} {...c}/>)}
		</SettingComponent>
	);

};

export const MapConfig = [
	{
		component: SettingDropdown,
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
	},
	{
		component: SettingToggle,
		text: "Show Only Current Branch",
		action: (draft: Setting) => {
			draft.showCurrentBranch = !draft.showCurrentBranch;
		},
		value: (setting: Setting) => {
			return setting.showCurrentBranch;
		}
	}
];

export const DocumentConfig = [
	{
		component: SettingDropdown,
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
		component: SettingToggle,
		text:"Keyboard Controls",
		action: (draft: Setting) => {
			draft.keyboardControls = !draft.keyboardControls;
		},
		value: (setting: Setting) => {
			return setting.keyboardControls;
		}
	},
	{
		component: SettingToggle,
		text:"Color-Code Document",
		action: (draft: Setting) => {
			draft.colorCodeDocument = !draft.colorCodeDocument;
		},
		value: (setting: Setting) => {
			return setting.colorCodeDocument;
		}
	},
	{
		component: SettingLabel,
		text: "Split Settings",
		action: () => {return;},
		value: () => {return false;},
		subsettings: [
			{
				component: SettingToggle,
				text: "Shrine",
				action: (draft: Setting) => {
					draft.splitSettings[SplitType.Shrine] = !draft.splitSettings[SplitType.Shrine];
				},
				value: (setting: Setting) => {
					return setting.splitSettings[SplitType.Shrine];
				}
			},
			{
				component: SettingToggle,
				text: "Tower",
				action: (draft: Setting) => {
					draft.splitSettings[SplitType.Tower] = !draft.splitSettings[SplitType.Tower];
				},
				value: (setting: Setting) => {
					return setting.splitSettings[SplitType.Tower];
				}
			},
			{
				component: SettingToggle,
				text: "Memory",
				action: (draft: Setting) => {
					draft.splitSettings[SplitType.Tower] = !draft.splitSettings[SplitType.Tower];
				},
				value: (setting: Setting) => {
					return setting.splitSettings[SplitType.Memory];
				}
			},
			{
				component: SettingToggle,
				text: "Warp",
				action: (draft: Setting) => {
					draft.splitSettings[SplitType.Warp] = !draft.splitSettings[SplitType.Warp];
				},
				value: (setting: Setting) => {
					return setting.splitSettings[SplitType.Warp];
				}
			},
			{
				component: SettingToggle,
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
				component: SettingToggle,
				text: "Korok",
				action: (draft: Setting) => {
					draft.splitSettings[SplitType.Korok] = !draft.splitSettings[SplitType.Korok];
				},
				value: (setting: Setting) => {
					return setting.splitSettings[SplitType.Korok];
				}
			},
			{
				component: SettingToggle,
				text: "Other",
				action: (draft: Setting) => {
					draft.splitSettings[SplitType.UserDefined] = !draft.splitSettings[SplitType.UserDefined];
				},
				value: (setting: Setting) => {
					return setting.splitSettings[SplitType.UserDefined];
				}
			},
			{
				component: SettingToggle,
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
