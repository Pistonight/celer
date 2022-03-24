import { CelerPreset } from "./Preset";

export class MemoryPreset implements CelerPreset {
	hasMember(): boolean {
		return true;
	}
	getPrimaryClass(): string {
		return "Memory";
	}
	registerEnums(register: (name: string, description: string, subclass?: string, isSubNamespace?: boolean) => void): void {
		// CODEGEN_START register_memory_presets() CODEGEN_END
	}
	getDocumentation(): string {
		return "The Memory namespace contains a preset for each picture memory in BOTW. Each preset defines the location, memory name, coordinate, and icon.";
	}
}
