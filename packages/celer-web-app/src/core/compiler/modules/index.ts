import BossModule from "./Boss";
import CustomModule from "./Custom";
import KorokModule from "./Korok";
import MaterialModule from "./Material";
import MemoryModule from "./Memory";
import ShrineModule from "./Shrine";
import { getSimpleModules } from "./Simple";
import TodModule from "./Tod";
import TowerModule from "./Tower";
import WarpModule from "./Warp";

export const getModules = ()=>[
	KorokModule,
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
