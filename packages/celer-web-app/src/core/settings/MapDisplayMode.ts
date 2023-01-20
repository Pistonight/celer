import { ReadonlyMapOf } from "data/util";
import { SettingItem, SettingStorage } from "./Setting";

export interface OldMapDisplayMode extends SettingItem<OldMapDisplayMode>{
    // Percentage of the map on screen. betweeb 0 and 1
    mapSize: number
}

export type MapDisplay =
{
	name: string,
	mapSize: number,
	next: () => MapDisplay
}

export const MapDisplayModes: {[key: string]: MapDisplay} = {
	Auto: {
		name: "Auto",
		mapSize: 0,
		next: ()=>MapDisplayModes.Wide
	},
	Wide: {
		name: "Wide",
		mapSize: 0.6,
		next: ()=>MapDisplayModes.Half
	},
	Half: {
		name: "Half",
		mapSize: 0.5,
		next: ()=>MapDisplayModes.Narrow
	},
	Narrow: {
		name: "Narrow",
		mapSize: 0.3,
		next: ()=>MapDisplayModes.Hidden
	},
	Hidden: {
		name: "Hidden",
		mapSize: 0,
		next: ()=>MapDisplayModes.Auto
	},
};

export const OldMapDisplayModes = {
	Auto: {
		name: "Auto",
		mapSize: 0,
		next: ()=>MapDisplayModes.Wide
	},
	Wide: {
		name: "Wide",
		mapSize: 0.6,
		next: ()=>MapDisplayModes.Half
	},
	Half: {
		name: "Half",
		mapSize: 0.5,
		next: ()=>MapDisplayModes.Narrow
	},
	Narrow: {
		name: "Narrow",
		mapSize: 0.3,
		next: ()=>MapDisplayModes.Hidden
	},
	Hidden: {
		name: "Hidden",
		mapSize: 0,
		next: ()=>MapDisplayModes.Auto
	},
} as ReadonlyMapOf<OldMapDisplayMode>;

export const MapDisplayModeStorage = new SettingStorage("MapDisplayMode", OldMapDisplayModes, OldMapDisplayModes.Auto);
