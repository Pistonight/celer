// Tile set utilities

// Internal url is used to pass raw coordinates to the tile component
// The tile component then requests the corresponding tile image from objmap, and return the correct component
export const internalTileUrl = (x: number, y: number, z: number): string => {
	return `${x}/${y}/${z}`;
};

export const internalTileUrlToXyz = (url: string): [number, number, number] => {
	return url.split("/").map((x)=>parseInt(x)) as [number, number, number];
};

export const BlankTile = "blank_tile.png";
export const objmapTileUrlOrBlank = (x: number, y: number, z: number): string => 
	isTileInBound(x,y,z) 
		? `https://objmap.zeldamods.org/game_files/maptex/${z}/${x}/${y}.png`
		: BlankTile
;

const TileIndexBounds = {
	2: [2, 2],
	3: [5, 4],
	4: [11, 9],
	5: [23, 19],
	6: [46, 39], 
	7: [93, 78]
};

export const isTileInBound = (x: number, y: number, z: number): boolean => {
	if (!(z in TileIndexBounds)){
		return false;
	}
	const [boundX, boundY ]= TileIndexBounds[z as keyof typeof TileIndexBounds];
	return x >=0 && y >=0 && x <= boundX && y<=boundY;
};
