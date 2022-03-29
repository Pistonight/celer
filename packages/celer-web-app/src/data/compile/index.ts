// Expose types and functions to engine side
export type {
	RouteScript,
	RouteMetadata,
	RouteSection,
	RouteModule,
	RouteStep,
	RouteScriptExtend,
} from "./src/ts/type";
export {
	switchSection,
	switchModule,
	switchStep
} from "./src/ts/switch";
export {TARGET_VERSION} from "./src/ts/version";
