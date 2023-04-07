import { EngineError } from "data/libs";
import { MapOf } from "data/util";
import { TypedString } from "./text";

export type RouteAssemblySection = {
	name?: string,
	route: RouteAssembly[]
}

export type RouteAssembly = { //RouteAssembly
	// Main text
	text: TypedString,
	// Banner mode. If not undefined, text is treated as a banner and everything else is ignored
	bannerType?: BannerType,
	bannerTriangle?: boolean,
	// The icon name (The resolved icon with NewIconResolution)
	icon?: string,
	// The second line of lines with icon
	comment?: TypedString,
	// Detailed Notes
	notes?: TypedString,
	// isStep
	isStep?: boolean,

	splitType: SplitType,
	//korokCode?: string,
	//spendSeed: number,

	// Variable Changes
	variableChange?: MapOf<number>,
	// Champion Ability Usage
	gale?: number,
	fury?: number
	// Override the time this step takes, for calculating ability recharge
	timeOverride?: number,

	// Suppress error type
	suppress?: EngineError[],
	// Engine command
	commands?: RouteCommand[],
	movements?: Movement[],
	lineColor?: string,
	hideIconOnMap?: boolean,
}

export enum BannerType {
    Notes,
    Warning,
    Error
}

export enum BossType {
	None,
	Hinox,
	Talus,
	Molduga
}

export type Movement = {
    to: Coord;// target of the movement
    isWarp: boolean; // if true, do not draw a line for this movement
    isAway: boolean; // if true, do not advance current position to target
}

export type Coord = {x: number, z: number}

export enum SplitType {
    None,
    Shrine, //1 - 120
    Tower, //I - XV
    Warp, // 1-??
    Memory, // I - XIII
    Korok, //1 - 900
    Hinox, //1-40
    Talus, //1-40
    Molduga, //1-4
    UserDefined
}

export enum RouteCommand {
    EnableFuryPlus,
    EnableGalePlus,
    ToggleHyruleCastle
}
