const example = (str:string) => {
	return {
		[str]: {
			notes: `.code(${str})`
		}
	};
};

export const exampleRouteScriptPresets = {
	_project: {
		name: "Preset Examples",
		authors: ["iTNTPiston"],
		url: "https://celer.itntpiston.app/#/docs/presets",
		version: "1.0.0",
		description: "Examples of presets"
	},
	_route: [
		{
			"Example Presets":[
				"(==) This page is a catalog of the presets you can use in celer. The notes section shows the syntax",
				"(?=) Note that all presets are prefixed by an underscore (_)",
				example("_Shrine::AkhVaquot"),
				"(^=) A shrine preset. You just need to put in the shrine name without spaces and apostrophe. The location and shrine icons are already defined. All preset names is case-sensitive however.",
				{
					"_Shrine::MijahRokee": {
						notes: ".code(_Shrine::MijahRokee)"
					}
				},
				"(^=) Example of test of strength. The counter on the left also keeps track of how many shrines are already in the route",
				example("_Shrine::GomaAssagh"),
				"(?=) If you enter the shrine name wrong, the engine won't be able to figure it out (should be .code(_Shrine::GomaAsaagh))",
				example("_Tower::GreatPlateau"),
				"(^=) A Tower preset. Simply put in the name of the region. Only GreatPlateau and DuelingPeaks are 2 words. There is also a counter for number of towers activated",
				example("_Korok::L37"),
				"(^=) A korok preset. Simply put the korok ID",
				example("_Korok::P99"),
				"(?=) If the korok ID you enter is not valid, then it just displays as normal text",
				example("_Warp::Shrine::SaasKosah"),
				"(^=) Warps. Warps are defined as .code(_Warp::TYPE::NAME). .code(TYPE) can be .code(Shrine) or .code(Tower). There are also a few special cases. For Shrines and Towers, following the same naming convention as you do with shrine and tower presets",
				example("_Warp::Tower::Tabantha"),
				example("_Warp::TechLab::Hateno"),
				example("_Warp::VahMedoh"),
				"(^=) Special Cases",
				example("_Warp::TravelMedallion<50.50,-40.40>"),
				"(^=) Can also warp to travel medallion and specify a coordinate (x,z). Warping to Labs, Beasts, or Travel Medallion will cause a warp icon to show on the map. You can of course override it with .code(hide-icon-on-map: true)",
				example("_Warp::DefinitelyValidLocation"),
				"(^=) If the warp is invalid, engine will generate this error above",
				example("_Memory::HyruleCastle"),
				"(^=) Memory preset. Valid values are: LanayruRoad, SacredGrounds, LakeKolomo, AncientColumns, KaraKaraBazaar, EldinCanyon, IrchPlain, WestNecluda, HyruleCastle, SpringOfPower, SanidinPark, HyruleField, AshSwamp",
				example("_Boss::Talus::Stone"),
				"(^=) Talus. .code(Stone) can be Luminous, Rare, Igneo or Frost",
				example("_Boss::Hinox::Red"),
				"(^=) Hinox. .code(Red) can be Blue, Black or Stal",
				example("_Boss::Molduga"),
				"(^=) Molduga.",
				"(?=) The engine doesn't have predefined coordinates for bosses. You need to manually set the coordinate for the boss",
				example("_Material<Silent Princess,1>"),
				"(^=) Get material. Syntax is .code(_Material<NAME, COUNT>). This also add COUNT to the NAME variable internally. Spaces in the name will be removed in the variable name",
				{
					".v(SilentPrincess)": {
						notes: ".(.v(SilentPrincess)..)"
					}
				},
				"(^=) Variables can be referenced using .(.v(NAME)..)",
				example("_Material<My Material>"),
				"(^=) If you don't want the material to be tracked, simply don't have a comma in the text",
				"(==) The rest are pretty simple, so I'm just going to list them",
				example("_Equipment::Weapon<Some Weapon>"),
				example("_Equipment::Bow<Some Bow>"),
				example("_Equipment::Shield<Some Shield>"),
				example("_Tod::Morning"),
				example("_Tod::Noon"),
				example("_Tod::Night"),
				example("_Chest<Some Item>"),
				example("_Chest::Special<Some Special Item>"),
				example("_Snap::Quest<Stalhorse>"),
				example("_Snap::Elite<Silver Lynel>"),
				example("_Shop<Buy Everything>"),
				example("_Npc<Nebb>"),
				example("_Npc::Rito<Teba>"),
				example("_Npc::Goron<Talus Guy>"),
				example("_Npc::Gerudo<Flint Lady>"),
				example("_Npc::SheikaFemale<Firefly Lady>"),
				example("_Npc::SheikaMale<Cucoo Man>"),
				example("_Npc::ZoraFemale<Hinox Lady>"),
				example("_Npc::ZoraMale<Kapson>"),
				"(==) DISCLAIMER The choices of what npcs to include in the preset is solely based on if appropriate icons are found for it",
				example("_Cook<Hearty Food>"),
				example("_Discover<Dining Hall>")

			],
		},

	]};
