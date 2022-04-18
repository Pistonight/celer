import { StringType, TypedString, TypedStringSingle } from "../text";
import { RouteAssembly, SplitType } from "../types";
import { CompilerPresetModule } from "./Module";

class SimpleModule implements CompilerPresetModule {
	private prefix: string;
	private suffix: string;
	private type: StringType;
	private icon: string;
	private comment?: string;
	constructor(prefix: string, suffix: string, type: StringType, icon: string, comment?: string){
		this.prefix = prefix;
		this.suffix = suffix;
		this.type = type;
		this.icon = icon;
		this.comment = comment;
	}
	public compile(typedString: TypedString): RouteAssembly | undefined {
		const name = typedString.toString();
		if(!name.startsWith(this.prefix) || !name.endsWith(this.suffix)){
			return undefined;
		}
		return {
			text: new TypedStringSingle({
				content: name.substring(this.prefix.length, name.length-this.suffix.length),
				type: this.type
			}),
			comment: this.comment ? new TypedStringSingle({
				content: this.comment,
				type: StringType.Normal
			}) : undefined,
			icon: this.icon,
			splitType: SplitType.None
		};
	}

}

export const getSimpleModules = ()=>[
	new SimpleModule("_Chest<", ">", StringType.Item, "chest"),
	new SimpleModule("_Chest::Special<", ">", StringType.Item, "chest-special"),
	new SimpleModule("_Equipment::Weapon<", ">", StringType.Item, "equipment"),
	new SimpleModule("_Equipment::Bow<", ">", StringType.Item, "bow"),
	new SimpleModule("_Equipment::Shield<", ">", StringType.Item, "shield"),
	new SimpleModule("_Shop<", ">", StringType.Item, "shop"),
	new SimpleModule("_Npc<", ">", StringType.Npc, "npc"),
	new SimpleModule("_Npc::Rito<", ">", StringType.Npc, "npc-rito"),
	new SimpleModule("_Npc::Goron<", ">", StringType.Npc, "npc-goron"),
	new SimpleModule("_Npc::Gerudo<", ">", StringType.Npc, "npc-gerudo"),
	new SimpleModule("_Npc::SheikaFemale<", ">", StringType.Npc, "npc-sheika-female"),
	new SimpleModule("_Npc::SheikaMale<", ">", StringType.Npc, "npc-sheika-male"),
	new SimpleModule("_Npc::ZoraFemale<", ">", StringType.Npc, "npc-zora-female"),
	new SimpleModule("_Npc::ZoraMale<", ">", StringType.Npc, "npc-zora-male"),
	new SimpleModule("_Cook<", ">", StringType.Item, "cook"),
	new SimpleModule("_Discover<", ">", StringType.Location, "location", "DISCOVER"),
	new SimpleModule("_Snap::Elite<", ">", StringType.Enemy, "camera-elite", "SNAP ELITE"),
	new SimpleModule("_Snap::Quest<", ">", StringType.Npc, "snap", "SNAP for QUEST"),
];
