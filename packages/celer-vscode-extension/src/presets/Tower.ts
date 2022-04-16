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
		register("GreatPlateau", "Great Plateau Tower");
		register("Central", "Central Tower");
		register("Lake", "Lake Tower");
		register("DuelingPeaks", "Dueling Peaks Tower");
		register("Faron", "Faron Tower");
		register("Hateno", "Hateno Tower");
		register("Lanayru", "Lanayru Tower");
		register("Eldin", "Eldin Tower");
		register("Woodland", "Woodland Tower");
		register("Akkala", "Akkala Tower");
		register("Tabantha", "Tabantha Tower");
		register("Gerudo", "Gerudo Tower");
		register("Wasteland", "Wasteland Tower");
		register("Hebra", "Hebra Tower");
		register("Ridgeland", "Ridgeland Tower");
	}
	getDocumentation(): string {
		return "The Tower namespace contains a preset for each tower in BOTW. Each preset defines the name, coordinate, and icon for the tower.";
	}
}
