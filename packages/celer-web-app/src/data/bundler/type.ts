import {TARGET_VERSION} from "./version";

// Bundled Route script. This is what the engine side receives
export type RouteScript = {
    compilerVersion: typeof TARGET_VERSION,
    _project: RouteMetadata,
    _route: RouteSection[],
}

// Metadata containing project info
export type RouteMetadata = {
    name: string,
    authors: string[],
    url: string,
    version: string,
    description: string,
}

export type RouteSection = RouteModule | SingleProperty<RouteModule>
export type RouteModule = RouteStep | RouteStep[];
export type RouteStep = string | SingleProperty<RouteScriptExtend>;
export type RouteScriptExtend = {
    text?: string,
	icon?: string,
	comment?: string,
    notes?: string,
    "line-color"?: string,
    "hide-icon-on-map"?: boolean,
    "split-type"?: string,
    "var-change"?: {[key: string]: number},
    "time-override"?: number,
    commands?: string[],
    coord?: number[],
    movements?: {
        to: number[],
        away?: boolean,
        warp?: boolean,
    }[];
    fury?: number,
    gale?: number,
}

export type SingleProperty<T> = {
    [key: string]: T
} 
