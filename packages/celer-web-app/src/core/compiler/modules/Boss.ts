import { MapOf } from "data/util";
import { StringType, TypedString, TypedStringSingle } from "../text";
import { RouteAssembly, SplitType } from "../types";
import { CompilerPresetModule } from "./Module";

class BossModule implements CompilerPresetModule {
	private map: MapOf<() => RouteAssembly> = {};

	constructor(){
		this.addBossType("_Boss::Talus::Stone", "Stone Talus", SplitType.Talus, "talus");
		this.addBossType("_Boss::Talus::Luminous", "Luminous Talus", SplitType.Talus, "talus-luminous");
		this.addBossType("_Boss::Talus::Rare", "Rare Talus", SplitType.Talus, "talus-rare");
		this.addBossType("_Boss::Talus::Igneo", "Igneo Talus", SplitType.Talus, "talus-igneo-rare");
		this.addBossType("_Boss::Talus::Frost", "Frost Talus", SplitType.Talus, "talus-frost-rare");

		this.addBossType("_Boss::Hinox::Red", "Red Hinox", SplitType.Hinox, "hinox-red");
		this.addBossType("_Boss::Hinox::Blue", "Blue Hinox", SplitType.Hinox, "hinox-blue");
		this.addBossType("_Boss::Hinox::Black", "Black Hinox", SplitType.Hinox, "hinox-black");
		this.addBossType("_Boss::Hinox::Stal", "Stalnox", SplitType.Hinox, "hinox-stal");

		this.addBossType("_Boss::Molduga", "Molduga", SplitType.Molduga, "molduga");
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

	private addBossType(preset: string, name: string, splitType: SplitType, icon: string): void{
		this.map[preset] = () => ({
			text: new TypedStringSingle({
				content: name,
				type: StringType.Boss
			}),
			icon,
			splitType,
		});
	}
}

export default new BossModule();
