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
		this.addShrine("Ja Baij", [-446.70, 180.02, 1990.18]);
		this.addShrine("Oman Au", [-673.25, 173.09, 1513.01]);
		this.addShrine("Owa Daim", [-925.03, 274.17, 2321.23]);
		this.addShrine("Keh Namut", [-1436.35, 337.58, 1990.99]);
		this.addShrine("Akh Va'quot", [-3656.13, 321.74, -1756.70]);
		this.addShrine("Bareeda Naag", [-3609.19, 246.74, -1515.40]);
		this.addShrine("Bosh Kala", [87.02, 122.52, 1658.71]);
		this.addDoubleSword("Chaas Qeta", [4012.19, 107.18, 2990.54]);
		this.addBlessing("Daag Chokah", [-26.43, 280.34, -2458.63]);
		this.addBlessing("Dagah Keek", [3149.70, 280.00, -416.80]);
		this.addSmallSword("Dah Hesho", [3899.52, 354.77, -1302.81]);
		this.addSmallSword("Dah Kaso", [-1695.29, 68.84, 1700.12]);
		this.addShrine("Daka Tuss", [1601.00, 117.70, 462.20]);
		this.addShrine("Daqa Koh", [2065.85, 598.01, -2328.36]);
		this.addShrine("Daqo Chisay", [-3817.03, 150.45, 2819.85]);
		this.addShrine("Dako Tah", [-3317.78, 146.11, 2162.48]);
		this.addBlessing("Dila Maag", [-1795.00, 164.18, 3465.39]);
		this.addShrine("Dow Na'eh", [2697.65, 220.94, 1333.48]);
		this.addShrine("Dunba Taag", [-2832.47, 79.88, -1578.04]);
		this.addDLC("Etsu Korima", [-1216.12, 340.50, 2109.90]);
		this.addShrine("Gee Ha'rah", [-2379.84, 278.11, -2254.59]);
		this.addDoubleSword("Goma Asaagh", [-2792.31, 671.02, -2882.31]);
		this.addBlessing("Gorae Torr", [2662.00, 470.00, -3456.50]);
		this.addShrine("Ha Dahamar", [1662.36, 115.52, 1921.60]);
		this.addShrine("Hawa Koth", [-4847.04, 123.74, 3772.63]);
		this.addDoubleSword("Hia Miu", [-4446.80, 329.85, -3803.04]);
		this.addShrine("Hila Rao", [854.73, 116.93, 838.06]);
		this.addShrine("Ishto Soh", [-984.79, 321.22, 3564.99]);
		this.addShrine("Jee Noh", [-1792.83, 112.85, 2423.39]);
		this.addBlessing("Jitan Sa'mi", [3882.12, 572.81, 1314.94]);
		this.addShrine("Joloo Nah", [-2004.01, 231.65, 1674.26]);
		this.addShrine("Kaam Ya'tak", [-967.80, 127.67, 715.89]);
		this.addShrine("Kah Mael", [4709.20, 242.50, -1310.29]);
		this.addShrine("Kah Okeo", [-4120.41, 184.29, -414.37]);
		this.addShrine("Kah Yah", [3436.89, 120.68, 3316.28]);
		this.addShrine("Kam Urog", [2501.03, 119.17, 1494.84]);
		this.addDLC("Kamia Omuna", [2128.36, 509.92, -3228.81]);
		this.addShrine("Ka'o Makagh", [523.29, 178.91, 3526.27]);
		this.addSmallSword("Katah Chuki", [-636.41, 128.87, -345.11]);
		this.addShrine("Katosa Aug", [4295.79, 237.42, -2730.34]);
		this.addShrine("Kay Noh", [-2810.96, 172.01, 2300.08]);
		this.addShrine("Kaya Wan", [824.21, 132.88, 187.79]);
		this.addShrine("Kayra Mah", [2076.82, 520.77, -2039.77]);
		this.addDLC("Kee Dafunia", [4935.17, 106.80, -1002.40]);
		this.addBlessing("Keeha Yoog", [-3853.40, 640.30, 716.70]);
		this.addDLC("Keive Tala", [-2339.53, 129.50, 3901.64]);
		this.addDoubleSword("Kema Kosassa", [-4658.48, 619.49, 904.84]);
		this.addShrine("Kema Zoos", [-4673.53, 132.12, 1967.79]);
		this.addDoubleSword("Ke'nai Shakah", [4194.49, 323.11, -856.88]);
		this.addShrine("Keo Ruug", [470.70, 250.15, -2168.79]);
		this.addBlessing("Ketoh Wawai", [283.40, 285.30, -3119.60]);
		this.addDLC("Kiah Toza", [-2155.49, 450.40, -3188.48]);
		this.addDLC("Kihiro Moh", [-3391.23, 441.98, 1347.84]);
		this.addBlessing("Korgu Chideh", [4737.48, 218.00, 3772.09]);
		this.addBlessing("Korsh O'hu", [-2688.60, 105.01, 2811.20]);
		this.addShrine("Kuh Takkar", [-3083.00, 571.55, 1221.00]);
		this.addBlessing("Kuhn Sidajj", [17.73, 281.40, -1944.40]);
		this.addBlessing("Lakna Rokee", [2040.49, 286.03, 972.22]);
		this.addBlessing("Lanno Kooh", [-2636.37, 446.03, -2060.36]);
		this.addBlessing("Maag Halan", [837.06, 282.20, -2419.72]);
		this.addBlessing("Maag No'rah", [-1939.90, 249.88, -1458.20]);
		this.addDLC("Mah Eliya", [3762.20, 547.78, -646.45]);
		this.addShrine("Maka Rah", [-4057.84, 94.89, -2508.37]);
		this.addShrine("Mezza Lo", [2621.60, 249.39, 378.23]);
		this.addDoubleSword("Mijah Rokee", [-2743.27, 309.39, 226.44]);
		this.addShrine("Mirro Shaz", [1232.00, 127.55, -1212.75]);
		this.addBlessing("Misae Suma", [-2970.30, 137.67, 3781.50]);
		this.addShrine("Mo'a Keet", [2723.50, 285.41, -1166.08]);
		this.addShrine("Mogg Latan", [-2297.43, 439.57, 460.73]);
		this.addShrine("Monya Toma", [-1488.60, 275.22, -1473.03]);
		this.addDoubleSword("Mozo Shenno", [-3627.71, 420.82, -3038.22]);
		this.addDoubleSword("Muwo Jeem", [3658.13, 350.34, 3308.26]);
		this.addShrine("Myahm Agana", [3388.41, 242.59, 2215.84]);
		this.addDoubleSword("Namika Ozz", [761.29, 188.72, -821.30]);
		this.addShrine("Ne'ez Yohma", [3323.58, 239.28, -518.83]);
		this.addDLC("Noe Rajee", [-3820.27, 89.77, -2311.20]);
		this.addSmallSword("Noya Neha", [-951.18, 134.36, -623.76]);
		this.addSmallSword("Pumaag Nitae", [559.53, 118.04, 2990.19]);
		this.addBlessing("Qaza Tokki", [-820.50, 341.30, -3535.00]);
		this.addShrine("Qua Raym", [1820.74, 388.29, -1517.04]);
		this.addBlessing("Qukah Nata", [2007.00, 301.50, 3285.00]);
		this.addBlessing("Raqa Zunzo", [-3810.50, 159.30, 3127.20]);
		this.addShrine("Ree Dahee", [1271.93, 137.68, 1843.74]);
		this.addShrine("Rin Oyaa", [-1721.37, 335.74, -2554.46]);
		this.addDLC("Rinu Honika", [2241.35, 541.82, -1995.70]);
		this.addBlessing("Ritaag Zumo", [4524.60, 107.77, -2127.50]);
		this.addDLC("Rohta Chigah", [-517.17, 173.80, 1798.40]);
		this.addShrine("Rok Uwog", [-2378.01, 485.91, -3224.74]);
		this.addBlessing("Rona Kachta", [-1088.16, 22.05, -2661.51]);
		this.addShrine("Rota Ooh", [-1563.25, 186.73, 1310.07]);
		this.addShrine("Rucco Maag", [3333.50, 119.00, 401.50]);
		this.addDLC("Ruvo Korbah", [-834.56, 189.80, 2145.07]);
		this.addDoubleSword("Saas Ko'sah", [-147.40, 144.22, -1159.35]);
		this.addShrine("Sah Dahaj", [2665.21, 247.91, -1580.75]);
		this.addDoubleSword("Sasa Kai", [-3559.80, 352.78, 1953.00]);
		this.addDLC("Sato Koda", [3102.94, 542.91, -833.22]);
		this.addShrine("Sha Gehma", [-1673.17, 346.57, -3758.45]);
		this.addShrine("Sha Warvo", [-3823.08, 265.12, -2206.36]);
		this.addShrine("Shada Naw", [-2998.62, 667.75, -3221.58]);
		this.addBlessing("Shae Katha", [870.34, 122.99, 2328.54]);
		this.addShrine("Shae Loya", [-2930.92, 306.45, -432.05]);
		this.addShrine("Shae Mo'sah", [1757.22, 535.32, -2562.46]);
		this.addShrine("Shai Utoh", [1586.72, 166.99, 3614.93]);
		this.addBlessing("Shai Yota", [4245.54, 110.92, 252.95]);
		this.addDLC("Sharo Lun", [2932.71, 630.51, -2418.10]);
		this.addShrine("Shee Vaneer", [1265.27, 525.87, 1938.70]);
		this.addShrine("Shee Venath", [1244.13, 443.37, 1850.30]);
		this.addShrine("Sheem Dagoze", [-1893.30, 212.40, 91.50]);
		this.addShrine("Sheh Rata", [1510.45, 128.41, -376.96]);
		this.addDLC("Shira Gomar", [-2376.74, 264.97, -1382.98]);
		this.addShrine("Sho Dantu", [-3911.26, 396.00, 1653.80]);
		this.addShrine("Shoda Sah", [1790.48, 189.80, 2991.89]);
		this.addDoubleSword("Shoqa Tatone", [94.00, 110.67, 3841.00]);
		this.addShrine("Shora Hah", [1535.38, 507.33, -3118.03]);
		this.addSmallSword("Soh Kofi", [2238.42, 148.48, -293.04]);
		this.addBlessing("Suma Sahma", [-1418.20, 545.40, 3448.30]);
		this.addShrine("Tah Muhl", [2300.66, 213.35, -941.32]);
		this.addDLC("Takama Shiri", [-4895.49, 141.98, 2155.50]);
		this.addSmallSword("Ta'loh Naeg", [1841.92, 260.10, 890.40]);
		this.addBlessing("Tahno O'ah", [4181.78, 288.15, 1686.73]);
		this.addBlessing("Tawa Jinn", [2637.53, 318.17, 2834.39]);
		this.addDoubleSword("Tena Ko'sah", [-3465.47, 384.49, -447.97]);
		this.addBlessing("Tho Kayu", [-4799.14, 135.13, 2800.18]);
		this.addBlessing("To Quomo", [-4023.13, 288.09, -3711.64]);
		this.addShrine("Toh Yahsa", [-2269.10, 216.58, -900.10]);
		this.addShrine("Toto Sah", [1845.65, 131.51, 2474.15]);
		this.addBlessing("Tu Ka'loh", [4655.00, 237.40, -3710.00]);
		this.addDoubleSword("Tutsuwa Nima", [3777.82, 108.89, -2704.89]);
		this.addShrine("Voo Lota", [-4016.18, 275.20, -1721.91]);
		this.addShrine("Wahgo Katta", [344.91, 123.08, 1007.03]);
		this.addShrine("Ya Naga", [-328.18, 68.02, 2600.29]);
		this.addShrine("Yah Rin", [2833.36, 152.75, 3310.97]);
		this.addDLC("Yowaka Ita", [-941.14, 187.70, 1672.45]);
		this.addShrine("Zalta Wa", [-1432.30, 138.32, -594.19]);
		this.addShrine("Ze Kasho", [3027.31, 348.65, -1667.85]);
		this.addBlessing("Zuna Kai", [3324.46, 298.69, -3420.44]);
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
