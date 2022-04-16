import { CelerPreset } from "./Preset";

export class MemoryPreset implements CelerPreset {
	hasMember(): boolean {
		return true;
	}
	getPrimaryClass(): string {
		return "Memory";
	}
	registerEnums(register: (name: string, description: string, subclass?: string, isSubNamespace?: boolean) => void): void {
		// GENERATED CODE
		// codegen csv begin
		// from memories
		// compact LocationDisplayName => CompactName
		// write 		register("{{CompactName}}", "{{Title}}");
		// joined with newline
		// codegen csv end

	}
	getDocumentation(): string {
		return "The Memory namespace contains a preset for each picture memory in BOTW. Each preset defines the location, memory name, coordinate, and icon.";
	}
}
