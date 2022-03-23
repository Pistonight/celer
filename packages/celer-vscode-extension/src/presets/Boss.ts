import { CelerPreset } from "./Preset";

export class BossPreset implements CelerPreset {
    hasMember(): boolean {
        return true;
    }
    getPrimaryClass(): string {
        return "Boss";
    }
    registerEnums(register: (name: string, description: string, subclass?: string, isSubNamespace?: boolean) => void): void {
        register("Talus", "(namespace) Talus", undefined, true);
        register("Hinox", "(namespace) Hinox", undefined, true);
        
        register("Molduga", "(Boss) Molduga");
        register("Stalnox", "(Boss) Stalnox");

        register("Rare", "(Boss) Rare Talus", "Talus");
        register("Luminous", "(Boss) Luminous Talus", "Talus");
        register("Stone", "(Boss) Stone Talus", "Talus");
        register("Igneo", "(Boss) Igneo Talus", "Talus");
        register("Frost", "(Boss) Frost Talus", "Talus");

        register("Black", "(Boss) Black Hinox", "Hinox");
        register("Blue", "(Boss) Blue Hinox", "Hinox");
        register("Red", "(Boss) Red Hinox", "Hinox");
        register("Stal", "(Boss) Stalnox", "Hinox");
    }
    getDocumentation(): string {
        return "The Boss namespace contains a preset for each (non DLC) overworld boss in BOTW. Each preset defines the name, type, and icon."
    }
}
