import { CelerPreset } from "./Preset";

export class ShrinePreset implements CelerPreset {
	hasMember(): boolean {
		return true;
	}
	getPrimaryClass(): string {
		return "Shrine";
	}
	registerEnums(register: (name: string, description: string, subclass?: string, isSubNamespace?: boolean) => void): void {
		// GENERATED CODE
		// codegen csv begin
		// from shrines
		// compact DisplayName => CompactName
		// map prop Type => Prefix
		// map entry "TosMinor" => "(minor ToS) "
		// map entry "TosSkip" => "(modest/major ToS) "
		// map entry "Blessing" => "(blessing) "
		// map entry "DLC" => "(DLC) "
		// map entry "Shrine" => ""
		// write 		register("{{CompactName}}", "{{Prefix}}{{DisplayName}} Shrine");
		// joined with newline
		// codegen csv end

	}
	getDocumentation(): string {
		return "The Shrine namespace contains a preset for each shrine in BOTW. Each preset defines the name, type, coordinate, icon, and time-override for the shrine. Also adds a comment to check korok count";
	}
}
