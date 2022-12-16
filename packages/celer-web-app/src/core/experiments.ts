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
// Enable engine to infer coordinates for lines without coordinates (so that every line can be clicked)
export const useExpInferCoord = ():boolean => useAppExperiment("InferCoord", true);
// [11-03] Enable new home page
export const useNewHomePage = ():boolean => useAppExperiment("UseNewHomePage",true);
// [12-15] Enabling the progress tracker that keeps track of scrolling progress and which branch you are on
export const useExpScrollProgressTrackerEnabled = ():boolean => useAppExperiment("ScrollProgressTrackerEnabled", true);
// [12-16] Enable new korok comments. Remove 12/29
export const useNewKorokComment = (): boolean => useAppExperiment("UseNewKorokComment", false);
