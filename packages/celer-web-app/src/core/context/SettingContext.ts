import React, { useContext } from "react";
import { SplitType } from "core/compiler";
import { MapDisplayMode, SplitTypeSetting, Theme } from "core/settings";
import { Consumer, emptyObject } from "data/util";

export interface AppSetting {
    mapDisplayMode: MapDisplayMode,
    theme: Theme,
    
    splitSetting: SplitTypeSetting<boolean>,
    enableSubsplits: boolean,
    
}

interface AppSettingContextState extends AppSetting {
    setMapDisplayMode: Consumer<MapDisplayMode>,
    setTheme: Consumer<Theme>,
    setSplitSetting: (value: boolean, ...splitType: SplitType[])=>void,
    setEnableSubsplits: Consumer<boolean>,
}

export const SettingContext = React.createContext<AppSettingContextState>(emptyObject());
SettingContext.displayName = "SettingContext";
export const useAppSetting = ()=>useContext(SettingContext);
