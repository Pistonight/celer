// Experiments configuration
// Each experiment has a default value. This value is used if live experiments fail to load, or if it's not in live experiments (error case)

// Setting the value in experiments.json in production is enough for emergency.
// If it's an important brake, also change the value here and PR

import { useAppExperiment } from "./context";

// Enable engine warning for negative variables
export const useExpWarnNegativeVar = (): boolean => useAppExperiment("WarnNegativeVar", true);
// [11-03] Enable new home page
export const useNewHomePage = ():boolean => useAppExperiment("UseNewHomePage",true);
// [12-15] Enabling the progress tracker that keeps track of scrolling progress and which branch you are on
export const useExpScrollProgressTrackerEnabled = ():boolean => useAppExperiment("ScrollProgressTrackerEnabled", true);
// [12-16] Enable new korok comments. Remove 12/29
export const useNewKorokComment = (): boolean => useAppExperiment("UseNewKorokComment", false);
// [1-17] Enable new settings dialog
export const useNewSettings = (): boolean => useAppExperiment("UseNewSettings", true);
// [1-26] Enable showing only the current branch
export const useCurrentBranch = (): boolean => useAppExperiment("UseCurrentBranch", true);
// [pending custom icon] Enable loading base64 bundle from the dev server
export const useExpDevServerBase64 = () => useAppExperiment("DevServerBase64", true);
// [pending custom icon] Enable resolving the icon in the compiler
export const useExpNewIconResolution = () => useAppExperiment("NewIconResolution", true);
// [pending custom icon] Enable loading bundle.json.gz from repo
export const useExpLoadDocFromGzip = () => useAppExperiment("LoadDocFromGzip", true);
// Enable loading bundle from release API (doesn't work due to CORS)
export const useExpLoadDocFromRelease = () => useAppExperiment("LoadDocFromRelease", false);
// [3/24] Use router to get paths for recent paths
export const useExpUseNewRecentPath = () => useAppExperiment("UseNewRecentPath", true);
