import React, { useContext } from "react";
import { InGameCoordinates } from "core/map";
import { Consumer, emptyObject } from "data/util";

export interface AppState {
    // Updating this value will cause DocFrame to scroll to that line
    docScrollToLine: number,
    // Current line doc is on
    docCurrentLine: number,
    // Updating this value will cause MapFrame to center to the new location
    mapCenter: InGameCoordinates|undefined,

}

interface AppStateContextState extends AppState {
    setDocScrollToLine: Consumer<number>,
    setDocCurrentLine: Consumer<number>,
    setMapCenter: (igc: InGameCoordinates) => void,
}

export const AppStateContext = React.createContext<AppStateContextState>(emptyObject());
AppStateContext.displayName = "AppStateContext";
export const useAppState = ()=>useContext(AppStateContext);
