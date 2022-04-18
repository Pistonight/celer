// Shrine::Name
// 136 shrines 
import { MapOf } from "data/util";
import { StringType, TypedString, TypedStringSingle } from "../text";
import { RouteAssembly, SplitType } from "../types";
import { CompilerPresetModule } from "./Module";

class ShrineModule implements CompilerPresetModule {
	private map: MapOf<() => RouteAssembly> = {};
    
	constructor(){
		// GENERATED CODE
		// codegen csv begin
		// from shrines
		// map prop Type => AddMethod
		// map entry "TosMinor" => "addSmallSword"
		// map entry "TosSkip" => "addDoubleSword"
		// map entry "Blessing" => "addBlessing"
		// map entry "DLC" => "addDLC"
		// map entry "Shrine" => "addShrine"
		// write 		this.{{AddMethod}}("{{DisplayName}}", [{{X}}, {{Y}}, {{Z}}]);
		// joined with newline
		// codegen csv end

	}

	public compile(typedString: TypedString): RouteAssembly | undefined {
		return this.compileName(typedString.toString());
	}

	public compileName(name: string): RouteAssembly | undefined {
		if(!(name in this.map)){
			return undefined;
		}
		return this.map[name]();
	}

	private addShrine(name: string, coord: [number, number, number]): void {
		this.addShrineHelper(name, "shrine", coord, 8);
	}

	private addBlessing(name: string, coord: [number, number, number]): void {
		this.addShrineHelper(name, "shrine-blessing", coord, 4);
	}

	private addSmallSword(name: string, coord: [number, number, number]): void {
		this.addShrineHelper(name, "shrine-sword", coord, 20);
	}

	private addDoubleSword(name: string, coord: [number, number, number]): void {
		this.addShrineHelper(name, "shrine-double-sword", coord, 20);
	}

	private addDLC(name: string, coord: [number, number, number]): void {
		this.addShrineHelper(name, "shrine-dlc", coord, 10, true);
	}

	private addShrineHelper(name: string, icon: string, coord: [number, number, number], timeOverride: number, dlc?: boolean): void{
		const shrineCompactName = "_Shrine::"+name.replaceAll("'", "").replaceAll(" ", "");
		this.map[shrineCompactName] = () => ({
			text: new TypedStringSingle({
				content: name,
				type: StringType.Location
			}),
			icon: icon,
			splitType: dlc ? SplitType.UserDefined : SplitType.Shrine,
			movements: [{
				to: {x: coord[0], z: coord[2]},
				isAway: false,
				isWarp: false,
                
			}],
			timeOverride
		});
	}

}

export default new ShrineModule();
