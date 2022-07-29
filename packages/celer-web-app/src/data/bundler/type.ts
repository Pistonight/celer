
// Bundled Route script.
export type SourceBundle = {
    _project: RouteMetadata,
    _route: RouteSection[],
    _config: RouteConfig,
    _globalError?: string,
}

export type RouteConfig = {
    "split-format"?: SplitTypeConfig<string>
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

export type SplitTypeKeys = 
    "None"|
    "Shrine"| //1 - 120
    "Tower"| //I - XV
    "Warp"| // 1-??
    "Memory"| // I - XIII
    "Korok"| //1 - 900
    "Hinox"| //1-40
    "Talus"| //1-40
    "Molduga"| //1-4
    "UserDefined";

export type SplitTypeConfig<T> = {
    [t in SplitTypeKeys]?: T
};
