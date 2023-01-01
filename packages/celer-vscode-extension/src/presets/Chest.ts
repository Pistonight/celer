import { CelerPreset } from "./Preset";

export class ChestPreset implements CelerPreset {
	hasMember(): boolean {
		return false;
	}
	getPrimaryClass(): string {
		return "Chest";
	}
	registerEnums(register: (name: string, description: string, subclass?: string, isSubNamespace?: boolean)=>void): void {
		register("Special", "Special Chest");
	}
	getDocumentation(): string {
		return "Parametrized preset for chests.";
	}
}
