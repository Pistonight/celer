import { CelerPreset } from "./Preset";

export class EquipmentPreset implements CelerPreset {
    hasMember(): boolean {
        return true;
    }
    getPrimaryClass(): string {
        return "Equipment";
    }
    registerEnums(register: (name: string, description: string, subclass?: string, isSubNamespace?: boolean) => void): void {
        register("Weapon", "", undefined, true);
        register("Shield", "", undefined, true);
        register("Bow", "", undefined, true);
    }
    getDocumentation(): string {
        return "Parametrized preset for weapon, shield and bow. "
    }
}
