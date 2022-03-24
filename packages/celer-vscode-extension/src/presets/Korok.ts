import { KorokRegions } from "../data/KorokRegions";
import { CelerPreset } from "./Preset";

export class KorokPreset implements CelerPreset {
	hasMember(): boolean {
		return true;
	}
	getPrimaryClass(): string {
		return "Korok";
	}
	registerEnums(register: (name: string, description: string, subclass?: string, isSubNamespace?: boolean)=>void): void {
		for(const region in KorokRegions){
			register(region, `${KorokRegions[region].name} Koroks`);
		}
	}
	getDocumentation(): string {
		return "The Korok namespace contains a preset for each korok in BOTW. Each preset defines the name, comment, type, coordinate, icon, movements, and time-override for the korok.";
	}
}
