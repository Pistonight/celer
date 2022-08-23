// Experiments configuration
// Each experiment has a default value. This value is used if live experiments fail to load, or if it's not in live experiments (error case)

// Setting the value in experiments.json in production is enough for emergency. 
// If it's an important brake, also change the value here and PR

import { useAppExperiment } from "./context";

// Enabling the binary search version for scroll tracking, currently WIP
export const useExpEnhancedScrollTrackerEnabled = ():boolean => useAppExperiment("EnhancedScrollTrackerEnabled", false);
// Sync map when scrolling, currently have performance issue
export const useExpMapSyncToDocScrollEnabled = ():boolean => useAppExperiment("EnhancedScrollTrackerEnabled", false);
// Disable scroll tracking. scroll tracking currently have performance issue
export const useExpNoTrackDocPos = ():boolean => useAppExperiment("NoTrackDocPos", true);
// Enable engine warning for negative variables
export const useExpWarnNegativeVar = (): boolean => useAppExperiment("WarnNegativeVar", false);
// Pigeon Map
export const useExpBetterMap = ():boolean => useAppExperiment("BetterMap", true);
// [08-11] Use FC AppStateProvider
export const useExpNewASP = ():boolean => useAppExperiment("NewASP", true);
// Enable support for loading deprecated route format
export const useExpEnableDeprecatedRouteBundle = ():boolean => useAppExperiment("EnableDeprecatedRouteBundle", false);
// Enable engine to infer coordinates for lines without coordinates (so that every line can be clicked)
export const useExpInferCoord = ():boolean => useAppExperiment("InferCoord", true);
// [08-11 Added] Use New DocumentContext and not use old ServiceContext. New DocumentContext will not work with leaflet map
export const useExpNewDP = ():boolean => useAppExperiment("NewDP", true);
// [08-25 Added] Use wasm bundler (only applies to dev server)
export const useExpBetterBundler = ():boolean => useAppExperiment("BetterBundler", true);
