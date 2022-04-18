import { MapOf } from "data/util";
import { StringParser, StringType, TypedString, TypedStringSingle } from "../text";
import { RouteAssembly, SplitType } from "../types";
import { CompilerPresetModule } from "./Module";

export enum KorokType {
    Acorn = "Acorn",
    AcornFlying = "Acorn Flying",
    AcornLog = "Acorn in Log",
    AcornTree = "Acorn in Tree",
    AcornHanging = "Acorn Hanging",
    Balloon = "Balloon",
    Basketball = "Basketball",
    Beard = "Horse Beard",
    BlockPuzzle = "Block Puzzle",
    BoulderCircle = "Boulder Circle",
	BoulderGolf = "Boulder Golf",
	Confetti = "Confetti",
	FlowerChase = "Flower Chase",
	FlowerCount = "Flower Count",
    IceBlock = "Ice Block",
    JumpFence = "Jump Fence",
    LiftRock = "Lift Rock",
    LiftRockDoor = "Rock under Door",
    LiftRockTree = "Rock in Tree",
    LiftRockRubble = "Rock behind Rubble",
    LiftRockBoulder = "Rock under Boulder",
    LiftRockLeaves = "Rock under Leaves",
    LiftRockSlab = "Rock under Slab",
    LightChase = "Light Chase",
    LilyPads = "Lily Pads",
    LuminousStone = "Luminous Stone",
    MatchTree = "Match Tree",
    MatchCactus = "Match Cactus",
    MetalBoxCircle = "Metal Box Circle",  
    OfferApple = "Offer Apple",
    OfferBanana = "Offer Banana",
    OfferDurian = "Offer Durian",
    OfferEgg = "Offer Egg",
    OfferPalmFruit = "Offer Palm Fruit",
    OfferPepper = "Offer Pepper",
    OfferShield = "Offer Shield",
    Race = "Race",
    RockCircle = "Rock Circle",
    ShootEmblem = "Shoot Emblem",
    SnowballGolf = "Snowball Golf",
    Torch = "Match Torch",
    TreeBranch = "Tree Branch",
    TreeStump = "Tree Stump",
    Well = "Well",
    Other = "Other"
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
		const korok = this.map[id]();
		korok.movements?.splice(-1,0,{to: {x, z},
			isAway: false,
			isWarp: false
		});
		this.map[id] = ()=>korok;
	}

}

const mapKorokToImage = (korok: KorokType):string =>{
	switch(korok){
		case KorokType.Acorn: return "korok-acorn";
		case KorokType.AcornFlying: return "korok-acorn-flying";
		case KorokType.AcornLog: return "korok-acorn";
		case KorokType.AcornTree: return "korok-acorn";
		case KorokType.AcornHanging: return "korok-acorn";
		case KorokType.Balloon: return "korok-balloon";
		case KorokType.Basketball: return "korok-basketball";
		case KorokType.Beard: return "korok";
		case KorokType.BlockPuzzle: return "korok-magnesis";
		case KorokType.BoulderCircle: return "korok-rock-circle";
		case KorokType.BoulderGolf: return "korok-golf-boulder";
		case KorokType.Confetti: return "korok-confetti";
		case KorokType.FlowerChase: return "korok-flower";
		case KorokType.FlowerCount: return "korok-flower";
		case KorokType.IceBlock: return "korok-ice";
		case KorokType.JumpFence: return "korok";
		case KorokType.LiftRock: return "korok-rock";
		case KorokType.LiftRockDoor: return "korok-magnesis";
		case KorokType.LiftRockTree: return "korok-rock-tree";
		case KorokType.LiftRockRubble: return "korok-rock-under";
		case KorokType.LiftRockBoulder: return "korok-rock-under";
		case KorokType.LiftRockLeaves: return "korok-rock-under";
		case KorokType.LiftRockSlab: return "korok-rock-under";
		case KorokType.LightChase: return "korok-light-chase";
		case KorokType.LilyPads: return "korok-lily";
		case KorokType.LuminousStone: return "korok";
		case KorokType.MatchTree: return "korok-matching";
		case KorokType.MatchCactus: return "korok-matching";
		case KorokType.MetalBoxCircle: return "korok-magnesis";
		case KorokType.OfferApple: return "korok-offer-apple";
		case KorokType.OfferBanana: return "korok-offer-banana";
		case KorokType.OfferDurian: return "korok-offer-durian";
		case KorokType.OfferEgg: return "korok-offer-egg";
		case KorokType.OfferPalmFruit: return "korok-offer-durian";
		case KorokType.OfferPepper: return "korok-offer-apple";
		case KorokType.OfferShield: return "korok-offer-apple";
		case KorokType.Race: return "korok-race";
		case KorokType.RockCircle: return "korok-rock-circle";
		case KorokType.ShootEmblem: return "korok-shoot";
		case KorokType.SnowballGolf: return "korok-golf-snowball";
		case KorokType.Torch: return "korok";
		case KorokType.TreeBranch: return "korok";
		case KorokType.TreeStump: return "korok-magnesis";
		case KorokType.Well: return "korok-magnesis";
		case KorokType.Other: return "korok";
		default: return "korok";
	}
};

const mapKorokToEstimate = (korok: KorokType):number =>{
	switch(korok){
		case KorokType.Acorn: return 5;
		case KorokType.AcornFlying: return 5;
		case KorokType.AcornLog: return 5;
		case KorokType.AcornTree: return 5;
		case KorokType.AcornHanging: return 5;
		case KorokType.Balloon: return 10;
		case KorokType.Basketball: return 8;
		case KorokType.Beard: return 2;
		case KorokType.BlockPuzzle: return 10;
		case KorokType.BoulderCircle: return 10;
		case KorokType.BoulderGolf: return 5;
		case KorokType.Confetti: return 5;
		case KorokType.FlowerChase: return 12;
		case KorokType.FlowerCount: return 10;
		case KorokType.IceBlock: return 10;
		case KorokType.JumpFence: return 15;
		case KorokType.LiftRock: return 2;
		case KorokType.LiftRockDoor: return 3;
		case KorokType.LiftRockTree: return 5;
		case KorokType.LiftRockRubble: return 3;
		case KorokType.LiftRockBoulder: return 3;
		case KorokType.LiftRockLeaves: return 3;
		case KorokType.LiftRockSlab: return 4;
		case KorokType.LightChase: return 5;
		case KorokType.LilyPads: return 5;
		case KorokType.LuminousStone: return 5;
		case KorokType.MatchTree: return 5;
		case KorokType.MatchCactus: return 5;
		case KorokType.MetalBoxCircle: return 10;
		case KorokType.OfferApple: return 3;
		case KorokType.OfferBanana: return 3;
		case KorokType.OfferDurian: return 3;
		case KorokType.OfferEgg: return 3;
		case KorokType.OfferPalmFruit: return 3;
		case KorokType.OfferPepper: return 3;
		case KorokType.OfferShield: return 3;
		case KorokType.Race: return 15;
		case KorokType.RockCircle: return 10;
		case KorokType.ShootEmblem: return 5;
		case KorokType.SnowballGolf: return 10;
		case KorokType.Torch: return 5;
		case KorokType.TreeBranch: return 1;
		case KorokType.TreeStump: return 8;
		case KorokType.Well: return 8;
		case KorokType.Other: return 5;
		default: return 5;
	}
};

export default new KorokModule();
