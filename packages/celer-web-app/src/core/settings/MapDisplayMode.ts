export const MapDisplayModes = {
	Auto: {
		name: "Auto",
		mapSize: 0,
		next: ()=>MapDisplayModes.Wide
	},
	Wide: {
		name: "Wide",
		mapSize: 0.6,
		next: ()=>MapDisplayModes.Half
	},
	Half: {
		name: "Half",
		mapSize: 0.5,
		next: ()=>MapDisplayModes.Narrow
	},
	Narrow: {
		name: "Narrow",
		mapSize: 0.3,
		next: ()=>MapDisplayModes.Hidden
	},
	Hidden: {
		name: "Hidden",
		mapSize: 0,
		next: ()=>MapDisplayModes.Auto
	},
};

export const getNextMap = (map: string) =>
{
	if(map == "Auto")
	{
		return MapDisplayModes.Auto;
	}
	if(map == "Wide")
	{
		return MapDisplayModes.Wide;
	}
	if(map == "Half")
	{
		return MapDisplayModes.Half;
	}
	if(map == "Narrow")
	{
		return MapDisplayModes.Narrow;
	}
	return MapDisplayModes.Hidden;
};