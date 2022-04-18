import { MapOf } from "data/util";
import { StringType, TypedString, TypedStringSingle } from "../text";
import { RouteAssembly, SplitType } from "../types";
import { CompilerPresetModule } from "./Module";

class MemoryModule implements CompilerPresetModule {
	private map: MapOf<() => RouteAssembly> = {};
    
	constructor(){
       
		this.addMemory( "Lanayru Road", "Return of Calamity Ganon", [3143.34, 263.09, 1148.49]);
		this.addMemory( "Sacred Grounds", "Subdued Ceremony", [-254.14, 127.42, -97.91]);
		this.addMemory( "Lake Kolomo", "Resolve and Grief", [-681.08, 131.59, 1223.99]);
		this.addMemory( "Ancient Columns", "Zelda's Resentment", [-3501.04, 383.73, -421.26]);
		this.addMemory( "Kara Kara Bazaar", "Blades of the Yiga", [-3193.41, 129.51, 2536.24]);
		this.addMemory( "Eldin Canyon", "A Premonition", [1417.29, 466.78, -1537.95]);
		this.addMemory( "Irch Plain", "Silent Princess", [-1091.22, 232.47, -1301.68]);
		this.addMemory( "West Necluda", "Shelter from the Storm", [173.27, 150.50, 1935.49]);
		this.addMemory( "Hyrule Castle", "Father and Daughter", [-364.47, 269.88, -995.87]);
		this.addMemory( "Spring of Power", "Slumbering Power", [3744.00, 109.06, -2655.89]);
		this.addMemory( "Sanidin Park", "To Mount Lanayru", [-1612.42, 246.33, 688.02]);
		this.addMemory( "Hyrule Field", "Despair", [700.66, 115.96, 434.43]);
		this.addMemory( "Ash Swamp", "Zelda's Awakening", [1983.90, 124.12, 1912.69]);

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

	private addMemory(location: string, title: string, coord: [number, number, number]): void{
		const compactName = "_Memory::"+location.replaceAll("'", "").replaceAll(" ", "");
		this.map[compactName] = () => ({
			text: new TypedStringSingle({
				content: location,
				type: StringType.Location
			}),
			comment: new TypedStringSingle({
				content: title,
				type: StringType.Normal
			}),
			icon: compactName === "_Memory::AshSwamp" ? "memory-final":"memory",
			splitType: SplitType.Memory,
			movements: [{
				to: {x: coord[0], z: coord[2]},
				isAway: false,
				isWarp: false,
                
			}]
		});
	}
}

export default new MemoryModule();
