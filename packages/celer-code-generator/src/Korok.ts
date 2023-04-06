import { MapOf } from "data/util";
import { StringParser, StringType, TypedString, TypedStringSingle } from "../text";
import { RouteAssembly, SplitType } from "../types";
import { CompilerPresetModule } from "./Module";

export enum KorokType {
	// Korok types (generated)
	// GENERATE CODE
	// codegen csv begin
	// from korok_types
	// write 	{{Enum}} = "{{Type}}",
	// joined with newline
	// codegen csv end

}

class KorokModule implements CompilerPresetModule {
	private map: MapOf<() => RouteAssembly> = {};

	constructor(){
		// Add koroks
		// GENERATE CODE
		// codegen csv begin
		// from koroks
		// write 		this.addKorok("{{Id}}", [{{X}}, {{Y}}, {{Z}}], KorokType.{{Type}}, "{{Comment}}");
		// joined with newline
		// codegen csv end

		// Add korok movements
		// GENERATED CODE
		// codegen csv begin
		// from korok_movements
		// write 		this.addMovement("{{ForId}}", {{X}}, {{Z}});
		// joined with newline
		// codegen csv end

	}

	public recognizes(name: string): boolean {
		return name.startsWith("_Korok::") && name.substring(8) in this.map;
	}
	public compile(typedString: TypedString): RouteAssembly | undefined {
		const content = typedString.toString();
		if (!content.startsWith("_Korok::")){
			return undefined;
		}
		const id = content.substring(8);
		if(!(id in this.map)){
			return undefined;
		}
		return this.map[id]();
	}

	private addKorok(id: string,  coord: [number, number, number], type: KorokType, comment: string): void{
		this.map[id] = () => ({
			text: new TypedStringSingle({
				content: id+" "+type,
				type: StringType.Npc
			}),
			comment: StringParser.parseStringBlockSimple(comment),
			icon: mapKorokToImage(type),
			splitType: SplitType.Korok,
			movements: [{
				to: {x: coord[0], z: coord[2]},
				isAway: false,
				isWarp: false,
			}],
			timeOverride: mapKorokToEstimate(type),

		});
	}

	private addMovement(id: string, x: number, z: number): void {
		const oldGenerator = this.map[id];
		this.map[id] = ()=>{
			const korok = oldGenerator();
			korok.movements?.splice(-1,0,{to: {x, z},
				isAway: false,
				isWarp: false
			});
			return korok;
		};
	}

}

const mapKorokToImage = (korok: KorokType):string =>{
	switch(korok){
		// Korok images (generated)
		// GENERATE CODE
		// codegen csv begin
		// from korok_types
		// write 		case KorokType.{{Enum}}: return "{{Image}}";
		// joined with newline
		// codegen csv end

		default: return "korok";
	}
};

const mapKorokToEstimate = (korok: KorokType):number =>{
	switch(korok){
		// Korok time estimate (generated)
		// GENERATE CODE
		// codegen csv begin
		// from korok_types
		// write 		case KorokType.{{Enum}}: return {{Time}};
		// joined with newline
		// codegen csv end

		default: return 5;
	}
};

export default new KorokModule();
