import { CelerPreset } from "./Preset";

export class WarpPreset implements CelerPreset {
    hasMember(): boolean {
        return true;
    }
    getPrimaryClass(): string {
        return "Warp";
    }
    registerEnums(register: (name: string, description: string, subclass?: string, isSubNamespace?: boolean) => void): void {
        register("Shrine", "(namespace) Warp to Shrine", undefined, true);
        register("Tower", "(namespace) Warp to Tower", undefined, true);
        register("TechLab", "(namespace) Warp to Tech Lab", undefined, true);

        register("Akkala", "Akkala Tech Lab", "TechLab");
        register("Hateno", "Hateno Tech Lab", "TechLab");

        register("VahMedoh", "Warp to Vah Medoh");
        register("VahNaboris", "Warp to Vah Medoh");
        register("VahRuta", "Warp to Vah Medoh");
        register("VahRudania", "Warp to Vah Medoh");

        register("SOR", "Warp to Shrine of Resurrection");
        register("TravelMedallion", "Warp to Travel Medallion");
    }
    getDocumentation(): string {
        return "The Warp namespace contains a preset for every possible warp (fast-travel) location in BOTW. Each preset defines the name, and coordinate. Also adds a comment to check korok count"
    }
}
