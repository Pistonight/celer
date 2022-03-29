import { Coord } from "data/assembly";

const MapXSize = 78.125;
const MapYSize = 64;
const GameXSize = 9998;
const GameYSize = 8193;
const GameYOffset = 17;
const GameXOffset = -24;
export const gameCoordToMapCoord = (coord: Coord): [ number, number] => {
	const mapX = gameXToMapX(coord.x);
	const mapY = gameYToMapY(coord.z);// z is y in this case, since we are 2D
	return [-mapY, mapX]; // Y is first coord in leaflet coords
};

const gameXToMapX = (gameX: number): number => {
	return (gameX-GameXOffset) / GameXSize * MapXSize;
};

const gameYToMapY = (gameY: number): number => {
	return (gameY-GameYOffset) / GameYSize * MapYSize;
};
