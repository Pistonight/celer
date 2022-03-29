export const exampleRouteScript = {
	Project: {
    
		Name: "Example Route Script",
		Authors: ["iTNTPiston"],
		Url: "itntpiston.github.io/celer?Internal=1",
		Version: "Example",
		Description: "Example"
        
	},
	Route: [
		[],//wrong type,
		123, //wrong type
		"OK", //string type
		{},//no key
		{key1: "", key2: ""},//multiple keys
		{
			"section": 123,//wrong type
		},
		{
			"section": "string",//wrong type
		},
		{
			"section": {something: 123},//wrong type
		},
		{
			"section": [
				123, // wrong type
				[], //wrong type
				{
					//empty object not allowed
				},
				{
					too: "",
					many: "",
					keys: ""
				}
			],
		},
		{
			"Plateau":[
				123,
				"+SOR Clip",
				"(^=) No need to get TOD",
				{
					"Equipment<Pot Lid>":{
						comment: "Best shield",
						coord: [-952.34, 1959.44]
					}
				},
				{
					"Chest<Traveler Bow>":{
						comment: "Best bow",
						coord: [-832.43, 1963.11]
					}
				}
			]
		},
		{
			"section": [123,456,"something",
				{
					"custom":{
						"text": "test",
						"icon": "shop",
						"split-type": "UserDefined"
					}
				}
			]
		}
	]};
