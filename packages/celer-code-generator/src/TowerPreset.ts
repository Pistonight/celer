import { CelerPreset } from "./Preset";

export class TowerPreset implements CelerPreset {
	hasMember(): boolean {
		return true;
	}
	getPrimaryClass(): string {
		return "Tower";
	}
	registerEnums(register: (name: string, description: string, subclass?: string, isSubNamespace?: boolean) => void): void {
		// GENERATED CODE
		// codegen csv begin
		// from towers
		// compact DisplayName => CompactName
		// write 		register("{{CompactName}}", "{{DisplayName}} Tower");
		// joined with newline
		// codegen csv end

	}
	getDocumentation(): string {
		return "The Tower namespace contains a preset for each tower in BOTW. Each preset defines the name, coordinate, and icon for the tower.";
	}
}
