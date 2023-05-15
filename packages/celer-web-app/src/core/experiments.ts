// Experiments configuration
// Each experiment has a default value. This value is used if live experiments fail to load, or if it's not in live experiments (error case)

// Setting the value in experiments.json in production is enough for emergency.
// If it's an important brake, also change the value here and PR

import { useAppExperiment } from "./context";

// [11-03] Enable new home page
export const useNewHomePage = ():boolean => useAppExperiment("UseNewHomePage",true);
// [12-15] Enabling the progress tracker that keeps track of scrolling progress and which branch you are on
export const useExpScrollProgressTrackerEnabled = ():boolean => useAppExperiment("ScrollProgressTrackerEnabled", true);
// [1-17] Enable new settings dialog
export const useNewSettings = (): boolean => useAppExperiment("UseNewSettings", true);
// [1-26] Enable showing only the current branch
export const useCurrentBranch = (): boolean => useAppExperiment("UseCurrentBranch", true);
// [3-31 custom icon] Enable loading base64 bundle from the dev server
export const useExpDevServerBase64 = () => useAppExperiment("DevServerBase64", true);
// [3-30] Enable collapsing notes into buttons UI option
export const useExpCollapseNotes = (): boolean => useAppExperiment("UseCollapseNotes", true);
// [3-31 custom icon] Enable resolving the icon in the compiler
export const useExpNewIconResolution = () => useAppExperiment("NewIconResolution", true);
// [3-31 custom icon] Enable loading bundle.json.gz from repo
export const useExpLoadDocFromGzip = () => useAppExperiment("LoadDocFromGzip", true);
// Enable loading bundle from release API (doesn't work due to CORS)
export const useExpLoadDocFromRelease = () => useAppExperiment("LoadDocFromRelease", false);
// [3/24] Use router to get paths for recent paths
export const useExpUseNewRecentPath = () => useAppExperiment("UseNewRecentPath", true);
// [pending] Enable color coding document
export const useColorCodeDocument = () => useAppExperiment("UseColorCodeDocument", true);
