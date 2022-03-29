import KorokModule from "./Korok";
import ShrineModule from "./Shrine";
import TowerModule from "./Tower";
import WarpModule from "./Warp";
import { getSimpleModules } from "./Simple";
import CustomModule from "./Custom";
import MemoryModule from "./Memory";
import BossModule from "./Boss";
import MaterialModule from "./Material";
import TodModule from "./Tod";

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
