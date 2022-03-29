import { BannerType, SplitType, StringType, TypedString, TypedStringSingle } from "..";
import { RouteAssembly } from "../types";
import { CompilerPresetModule } from "./Module";
import ShrineModule from "./Shrine";
import TowerModule from "./Tower";

const PREFIX = "_TravelMedallion<";
const SUFFIX = ">";
class WarpModule implements CompilerPresetModule {

	public compile(typedString: TypedString): RouteAssembly | undefined {
		const name = typedString.toString();
		if(!name.startsWith("_Warp::")){
			return undefined;
		}
		const location = name.replace("_Warp::", "_");
		let module = ShrineModule.compileName(location);
		if(!module){
			module = TowerModule.compileName(location);
		}

		if(module){
			module.splitType = SplitType.Warp;
			module.icon = "warp";
			module.hideIconOnMap = true;
			if(module.movements){
				module.movements[0].isWarp = true;
			}
		}else{
            
			switch(location){
				case "_TechLab::Hateno":
					module = {
						text: new TypedStringSingle({
							content: "Hateno Tech Lab",
							type: StringType.Location,
						}),
						icon: "warp",
						splitType: SplitType.Warp,
						movements: [{
							to: {x: 3777.71, z: 2127.36},
							isAway: false,
							isWarp: true,
						}]
					};
					break;
				case "_TechLab::Akkala":
					module = {
						text: new TypedStringSingle({
							content: "Akkala Tech Lab",
							type: StringType.Location,
						}),
						icon: "warp",
						splitType: SplitType.Warp,
						movements: [{
							to: {x: 4522.01, z: -3166.63},
							isAway: false,
							isWarp: true,
						}]
					};
					break;
				case "_VahMedoh":
					module = {
						text: new TypedStringSingle({
							content: "Vah Medoh",
							type: StringType.Location,
						}),
						icon: "warp",
						splitType: SplitType.Warp,
						movements: [{
							to: {x: -3614.10, z: -1862.06},
							isAway: false,
							isWarp: true,
						}]
					};
					break;
				case "_VahNaboris":
					module = {
						text: new TypedStringSingle({
							content: "Vah Naboris",
							type: StringType.Location,
						}),
						icon: "warp",
						splitType: SplitType.Warp,
						movements: [{
							to: {x: -2110.15, z: 2616.95},
							isAway: false,
							isWarp: true,
						}]
					};
					break;
				case "_VahRudania":
					module = {
						text: new TypedStringSingle({
							content: "Vah Rudania",
							type: StringType.Location,
						}),
						icon: "warp",
						splitType: SplitType.Warp,
						movements: [{
							to: {x: 2451.85, z: -2559.08},
							isAway: false,
							isWarp: true,
						}]
					};
					break;
				case "_VahRuta":
					module = {
						text: new TypedStringSingle({
							content: "Vah Ruta",
							type: StringType.Location,
						}),
						icon: "warp",
						splitType: SplitType.Warp,
						movements: [{
							to: {x: 3662.40, z: -175.42},
							isAway: false,
							isWarp: true,
						}]
					};
					break;
				case "_SOR":
					module = {
						text: new TypedStringSingle({
							content: "SoR",
							type: StringType.Location,
						}),
						icon: "warp",
						splitType: SplitType.Warp,
						movements: [{
							to: {x: -1096.05, z: 1879.34},
							isAway: false,
							isWarp: true,
						}]
					};
			}
			if(!module){
				if(location.startsWith(PREFIX) && location.endsWith(SUFFIX)){
					const coords = location.substring(PREFIX.length, location.length-SUFFIX.length);
					const parts = coords.split(",");
					const x = Number(parts[0]) || 0;
					const z = Number(parts[1]) || 0;
					module = {
						text: new TypedStringSingle({
							content: "Travel Medallion",
							type: StringType.Location,
						}),
						icon: "warp",
						splitType: SplitType.Warp,
						movements: [{
							to: {x, z},
							isAway: false,
							isWarp: true,
						}]
					};
				}else{
					module = {
						text: new TypedStringSingle({
							content: "Invalid Warp: "+ name,
							type: StringType.Normal,
						}),
						bannerType: BannerType.Error,
						splitType: SplitType.None
					} as RouteAssembly;
				}
			}
		}

		return module;
	}
}

export default new WarpModule();
