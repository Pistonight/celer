import { CelerPreset } from "./Preset";

export class SnapPreset implements CelerPreset {
	hasMember(): boolean {
		return true;
	}
	getPrimaryClass(): string {
		return "Snap";
	}
	registerEnums(register: (name: string, description: string, subclass?: string, isSubNamespace?: boolean) => void): void {
		register("Elite", "Snap elite enemy");
		register("Quest", "Snap picture for quest");
	}
	getDocumentation(): string {
		return "The Snap namespace contains 2 parameterized presets for snaping elite enemy and for snaping quests. Elite enemies are optional depending on rupee printing result. The preset sets text and icon for the step";
	}
}
