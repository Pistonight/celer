import { CelerPreset } from "./Preset";

export class TodPreset implements CelerPreset {
    hasMember(): boolean {
        return true;
    }
    getPrimaryClass(): string {
        return "Tod";
    }
    registerEnums(register: (name: string, description: string, subclass?: string, isSubNamespace?: boolean) => void): void {
        register("Morning", "Pass time to 5 AM");
        register("Noon", "Pass time to 12 PM");
        register("Night", "Pass time to 9 PM");
    }
    getDocumentation(): string {
        return "The Tod namespace contains presets to pass time to morning, noon or night. The preset sets the icon and text";
    }
}
