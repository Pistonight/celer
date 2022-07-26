import React, { useContext } from "react";
import { SplitType } from "core/compiler";
import { DocLine } from "core/engine";
import { InGameCoordinates, MapCore, MapIcon, MapLine } from "core/map";
import { MapDisplayMode, SplitTypeSetting, Theme } from "core/settings";
import { RouteConfig, RouteMetadata, SourceBundle } from "data/bundler";
import { Consumer, emptyObject } from "data/util";

export interface AppState {
    mapDisplayMode: MapDisplayMode,
    theme: Theme,
    mapCore: MapCore,
    splitSetting: SplitTypeSetting<boolean>,
    enableSubsplits: boolean,
    // Updating this value will cause DocFrame to scroll to that line
    docScrollToLine: number,
    // Current line doc is on
    docCurrentLine: number,
    // Updating this value will cause MapFrame to center to the new location
    mapCenter: InGameCoordinates|undefined,
    metadata: RouteMetadata;//derived
    config: RouteConfig;//derived
    docLines: DocLine[];//derived
    mapIcons: MapIcon[];//derived
    mapLines: MapLine[];//derived
    // Temporary state to store bundlejson
    bundle: string | null
}

interface AppStateContextState extends AppState {
    setMapDisplayMode: Consumer<MapDisplayMode>,
    setTheme: Consumer<Theme>,
    setSplitSetting: (value: boolean, ...splitType: SplitType[])=>void,
    setEnableSubsplits: Consumer<boolean>,
    setDocScrollToLine: Consumer<number>,
    setDocCurrentLine: Consumer<number>,
    setRouteScript:(routeScript: SourceBundle)=>void,
    setBundle:(bundle: string | null) => void,
    setMapCenter: (igc: InGameCoordinates) => void,
}

export const AppStateContext = React.createContext<AppStateContextState>(emptyObject());
AppStateContext.displayName = "AppStateContext";
export const useAppState = ()=>useContext(AppStateContext);
