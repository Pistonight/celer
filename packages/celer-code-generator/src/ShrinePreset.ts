import { CelerPreset } from "./Preset";

export class ShrinePreset implements CelerPreset {
	hasMember(): boolean {
		return true;
	}
	getPrimaryClass(): string {
		return "Shrine";
	}
	registerEnums(register: (name: string, description: string, subclass?: string, isSubNamespace?: boolean) => void): void {
		// CODEGEN_START register_shrine_presets() CODEGEN_END
	}
	getDocumentation(): string {
		return "The Shrine namespace contains a preset for each shrine in BOTW. Each preset defines the name, type, coordinate, icon, and time-override for the shrine. Also adds a comment to check korok count";
	}
}
