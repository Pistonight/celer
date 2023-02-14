import React, { FunctionComponentElement } from "react";
import { Setting } from "core/context";
import produce from "immer";
import { SplitType } from "core/compiler";
import { SettingLabel, SettingToggle, SettingProps, SettingDropdown } from "./SettingsMenuItems";
import { MapDisplayModes, MapValues, Themes, ThemeValues } from "core/settings";

export const StringToSetting: {[key: string]: React.FC<SettingProps>} = {
    settinglabel: SettingLabel,
    settingtoggle: SettingToggle,
    settingdropdown: SettingDropdown
};

export type ConfigSetting = {
    component: string,
    text: string,
    action: (draft: Setting) => void,
    value?: (setting: Setting) => boolean,
    values?: string[],
    children?: ConfigSetting[],
    actionWithValue?: (setting: number) => (draft: Setting) => void,
}

export function render(config: ConfigSetting, setting: Setting, setSetting: (setting: Setting) => void): FunctionComponentElement<SettingProps>
{
    if(config.actionWithValue !== undefined)
    {
        return React.createElement(
            StringToSetting[config.component],
            {
                text: config.text,
                action: () => setSetting(produce(setting, config.action)),
                value: config.value?.(setting),
                values: config.values,
                selectedIndex: config.values?.indexOf(setting.mapDisplay.name),
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
        component: "settingdropdown",
        text: "Map Display",
        action: () => {},
        value: () => {return false},
        values: MapValues,
        actionWithValue: (setting: number) => 
        {
            return (draft: Setting) => 
            {
                draft.mapDisplay = MapDisplayModes[MapValues[setting]];
            }
        }
    }
];

export const DocumentConfig = [
    {
        component: "settingdropdown",
        text: "Map Display",
        action: () => {},
        value: () => {return false},
        values: ThemeValues,
        actionWithValue: (setting: number) =>
        {
            return (draft: Setting) =>
            {
                draft.theme = Themes[ThemeValues[setting]];
            }
        }
    },
    {
        component: "settinglabel",
        text: "Split Settings",
        action: () => {},
        value: () => {return false},
        children: [
            {
                component: "settingtoggle",
                text: "Shrine",
                action: (draft: Setting) => {
                    draft.splitSettings[SplitType.Shrine] = !draft.splitSettings[SplitType.Shrine];
                },
                value: (setting: Setting) => {
                    return setting.splitSettings[SplitType.Shrine];
                }
            },
            {
                component: "settingtoggle",
                text: "Tower",
                action: (draft: Setting) => {
                    draft.splitSettings[SplitType.Tower] = !draft.splitSettings[SplitType.Tower];
                },
                value: (setting: Setting) => {
                    return setting.splitSettings[SplitType.Tower];
                }
            },
            {
                component: "settingtoggle",
                text: "Memory",
                action: (draft: Setting) => {
                    draft.splitSettings[SplitType.Tower] = !draft.splitSettings[SplitType.Tower];
                },
                value: (setting: Setting) => {
                    return setting.splitSettings[SplitType.Memory];
                }
            },
            {
                component: "settingtoggle",
                text: "Warp",
                action: (draft: Setting) => {
                    draft.splitSettings[SplitType.Warp] = !draft.splitSettings[SplitType.Warp];
                },
                value: (setting: Setting) => {
                    return setting.splitSettings[SplitType.Warp];
                }
            },
            {
                component: "settingtoggle",
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
                component: "settingtoggle",
                text: "Korok",
                action: (draft: Setting) => {
                    draft.splitSettings[SplitType.Korok] = !draft.splitSettings[SplitType.Korok];
                },
                value: (setting: Setting) => {
                    return setting.splitSettings[SplitType.Korok];
                }
            },
            {
                component: "settingtoggle",
                text: "Other",
                action: (draft: Setting) => {
                    draft.splitSettings[SplitType.UserDefined] = !draft.splitSettings[SplitType.UserDefined];
                },
                value: (setting: Setting) => {
                    return setting.splitSettings[SplitType.UserDefined];
                }
            },
            {
                component: "settingtoggle",
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

