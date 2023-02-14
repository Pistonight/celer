import { ReadonlyMapOf } from "data/util";
import { SettingItem, SettingStorage } from "./Setting";

export interface OldMapDisplayMode extends SettingItem<OldMapDisplayMode>{
    // Percentage of the map on screen. betweeb 0 and 1
    mapSize: number,
}

export type MapDisplay =
{
	name: string,
	mapSize: number,
}

export const MapValues = ["Auto", "Wide", "Half", "Narrow", "Hidden"]

export const MapDisplayModes: {[key: string]: MapDisplay} = {
	Auto: {
		name: "Auto",
		mapSize: 0,
	},
	Wide: {
		name: "Wide",
		mapSize: 0.6,
	},
	Half: {
		name: "Half",
		mapSize: 0.5,
	},
	Narrow: {
		name: "Narrow",
		mapSize: 0.3,
	},
	Hidden: {
		name: "Hidden",
		mapSize: 0,
	},
};

export const OldMapDisplayModes = {
	Auto: {
		name: "Auto",
		mapSize: 0,
		next: ()=>OldMapDisplayModes.Wide,
	},
	Wide: {
		name: "Wide",
		mapSize: 0.6,
		next: ()=>OldMapDisplayModes.Half,
	},
	Half: {
		name: "Half",
		mapSize: 0.5,
		next: ()=>OldMapDisplayModes.Narrow,
	},
	Narrow: {
		name: "Narrow",
		mapSize: 0.3,
		next: ()=>OldMapDisplayModes.Hidden,
	},
	Hidden: {
		name: "Hidden",
		mapSize: 0,
		next: ()=>OldMapDisplayModes.Auto,
	},
} as ReadonlyMapOf<OldMapDisplayMode>;

export const MapDisplayModeStorage = new SettingStorage("MapDisplayMode", OldMapDisplayModes, OldMapDisplayModes.Auto);
