import { CelerPreset } from "./Preset";

export class MemoryPreset implements CelerPreset {
    hasMember(): boolean {
        return true;
    }
    getPrimaryClass(): string {
        return "Memory";
    }
    registerEnums(register: (name: string, description: string, subclass?: string, isSubNamespace?: boolean) => void): void {
        // Generated Code
        register("LanayruRoad", "Return of Calamity Ganon");
        register("SacredGrounds", "Subdued Ceremony");
        register("LakeKolomo", "Resolve and Grief");
        register("AncientColumns", "Zelda's Resentment");
        register("KaraKaraBazaar", "Blades of the Yiga");
        register("EldinCanyon", "A Premonition");
        register("IrchPlain", "Silent Princess");
        register("WestNecluda", "Shelter from the Storm");
        register("HyruleCastle", "Father and Daughter");
        register("SpringofPower", "Slumbering Power");
        register("SanidinPark", "To Mount Lanayru");
        register("HyruleField", "Despair");
        register("AshSwamp", "Zelda's Awakening");
    }
    getDocumentation(): string {
        return "The Memory namespace contains a preset for each picture memory in BOTW. Each preset defines the location, memory name, coordinate, and icon.";
    }
}
