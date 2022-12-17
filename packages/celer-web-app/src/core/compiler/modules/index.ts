import BossModule from "./Boss";
import CustomModule from "./Custom";
import KorokModule from "./Korok";
import KorokOld from "./Korok.old";
import MaterialModule from "./Material";
import MemoryModule from "./Memory";
import ShrineModule from "./Shrine";
import { getSimpleModules } from "./Simple";
import TodModule from "./Tod";
import TowerModule from "./Tower";
import WarpModule from "./Warp";

export const getModules = (useNewKorokComment: boolean)=>[
	useNewKorokComment ? KorokModule : KorokOld,
	MaterialModule,
	ShrineModule,
	TowerModule,
	WarpModule,
	MemoryModule,
	BossModule,
	TodModule,
	...getSimpleModules(),
	CustomModule
];

export * from "./Module";
