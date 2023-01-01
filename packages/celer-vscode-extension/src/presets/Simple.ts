import { CelerPreset } from "./Preset";

export class SimplePreset implements CelerPreset {
	private name: string;
	private documentation: string;
	constructor(name: string, documentation: string) {
		this.name = name;
		this.documentation = documentation;
	}
	hasMember(): boolean {
		return false;
	}
	getPrimaryClass(): string {
		return this.name;
	}
	registerEnums(): void {
		return;
	}
	getDocumentation(): string {
		return this.documentation;
	}
}
