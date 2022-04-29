import React, { useContext } from "react";
import { SplitType } from "core/compiler";
import { DocLine } from "core/engine";
import { MapCore, MapIcon, MapLine } from "core/map";
import { MapDisplayMode, SplitTypeSetting, Theme } from "core/settings";
import { RouteMetadata, RouteScript } from "data/bundler";
import { Consumer, emptyObject } from "data/util";

export interface AppState {
    mapDisplayMode: MapDisplayMode,
    theme: Theme,
    mapCore: MapCore,
    splitSetting: SplitTypeSetting<boolean>,
    // Updating this value will cause DocFrame to scroll to that line
    docScrollToLine: number,
    // Current line doc is on
    docCurrentLine: number,
    mapCenterGameX: number,
    mapCenterGameY: number,
    mapZoom: number,
    metadata: RouteMetadata;
    docLines: DocLine[];
    mapIcons: MapIcon[];
    mapLines: MapLine[];
}

interface AppStateContextState extends AppState {
    setMapDisplayMode: Consumer<MapDisplayMode>,
    setTheme: Consumer<Theme>,
    setSplitSetting: (value: boolean, ...splitType: SplitType[])=>void,
    setDocScrollToLine: Consumer<number>,
    setDocCurrentLine: Consumer<number>,
    setRouteScript:(routeScript: RouteScript)=>void,
}

export const AppStateContext = React.createContext<AppStateContextState>(emptyObject());
AppStateContext.displayName = "AppStateContext";
export const useAppState = ()=>useContext(AppStateContext);
