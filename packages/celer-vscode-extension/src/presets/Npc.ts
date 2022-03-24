import { CelerPreset } from "./Preset";

export class NpcPreset implements CelerPreset {
	hasMember(): boolean {
		return false; 
	}
	getPrimaryClass(): string {
		return "Npc";
	}
	registerEnums(register: (name: string, description: string, subclass?: string, isSubNamespace?: boolean)=>void): void {
		register("Rito", "Rito NPC");
		register("Goron", "Goron NPC");
		register("Gerudo", "Gerudo NPC");
		register("SheikaFemale", "Female Sheika NPC");
		register("SheikaMale", "Male Sheika NPC");
		register("ZoraFemale", "Female Zora NPC");
		register("ZoraMale", "Male Zora NPC");
	}
	getDocumentation(): string {
		return "Parametrized preset for NPCs.";
	}
}
