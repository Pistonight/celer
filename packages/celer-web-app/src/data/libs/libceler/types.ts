
// Bundled Route script.
export type SourceObject = {
    _project: RouteMetadata,
    _route: SourceSection[],
    _config: RouteConfig,
    _globalError?: string,
}

// Bundled Route config
export type RouteConfig = {
    "split-format"?: SplitTypeConfig<string>,
    "engine"?: EngineConfig,
    "icons"?: Record<string, string>,
}

export enum EngineError {
    FuryRecharge, // ability may not be recharged
    GaleRecharge,
    FuryOveruse, // ability does not have enough uses left
    GaleOveruse,
    FuryUnspecified, // ability text is given without specifying the use count
    GaleUnspecified,
    NegativeVar // variable is negative
}

type EngineErrorKey = keyof typeof EngineError;

export type EngineConfig = {
    ignore?: EngineErrorKey[],
    warn?: EngineErrorKey[],
    error?: EngineErrorKey[]
}

// Metadata containing project info
export type RouteMetadata = {
    name: string,
    authors: string[],
    url: string,
    version: string,
    description: string,
}

// Unbundled/uncompiled source data
export type SourceSection = SourceModule | SingleProperty<SourceModule>
export type SourceModule = SourceStep | SourceStep[];
export type SourceStep = string | SingleProperty<SourceStepCustomization>;
export type SourceStepCustomization = {
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
    suppress?: string[],
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
