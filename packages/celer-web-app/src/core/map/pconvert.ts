import { geoCoord, GeoCoordinates, inGameCoord, InGameCoordinates, svgCoord, SvgCoordinates } from "./type";

// These values are used only in converting between z and lat
// Total Latitude
const LatScale = 85.0511287798066 * 2;
// I forgot what these are
const maxLatMagic = 8.4;
const minLatMagic = -74.65;
// Tile value (-1 to 1)
const maxLatTile= maxLatMagic / LatScale+0.5;
const minLatTile = minLatMagic / LatScale+0.5;

const xToLng = (x: number): number => {
	const percentageX = (x-MapInGameMinX)/(MapInGameMaxX-MapInGameMinX);
	return percentageX * (MapGeoMaxLng-MapGeoMinLng)+MapGeoMinLng;
};
const lngToX = (lng: number): number => {
	const percentageLng = (lng-MapGeoMinLng)/(MapGeoMaxLng-MapGeoMinLng);
	return percentageLng * (MapInGameMaxX-MapInGameMinX)+MapInGameMinX;
};
const zToLat = (z: number): number => {
	const percentageZ = (z-MapInGameMinZ)/(MapInGameMaxZ-MapInGameMinZ);
	const latPercentage = percentageZ*(maxLatTile-minLatTile)+minLatTile;
	const lat = tile2lat(latPercentage);
	return lat;
};
const latToZ = (lat: number): number => {
	const latPercentage = lat2tile(lat);
	const percentageZ = (latPercentage-minLatTile)/(maxLatTile-minLatTile);
	return percentageZ * (MapInGameMaxZ-MapInGameMinZ)+MapInGameMinZ;
};

// https://wiki.openstreetmap.org/wiki/Slippy_map_tilenames#ECMAScript_.28JavaScript.2FActionScript.2C_etc..29
// Function to convert latitude to a value between 0 and 1. 0 correspond to 85-ish (north), 1 corespond to -85-ish (south)
//https://github.com/mariusandra/pigeon-maps/blob/d630de74e2eafbabde71a0325429338f63dbbe43/src/map/Map.tsx
const lat2tile = (lat: number): number =>
	(1 - Math.log(Math.tan(lat * Math.PI / 180) + 1 / Math.cos(lat * Math.PI / 180)) / Math.PI) / 2;

// Function  to convert a value between 0 and 1 to latitude
//https://github.com/mariusandra/pigeon-maps/blob/d630de74e2eafbabde71a0325429338f63dbbe43/src/map/Map.tsx
const tile2lat=(perLat: number): number => {
	const n = Math.PI - 2 * Math.PI * perLat;
	return 180 / Math.PI * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n)));
};

export const zoomToSvgScale = (zoom: number): number => {
	return 0.0625 * Math.pow(2, zoom-2);
};

// export const inGameToSvgCoord = ({x,z}: InGameCoordinates, zoom: number): SvgCoordinates => {
//     const scale = zoomToSvgScale(zoom);
//     return svgCoord((x+SvgSizeX/2)*scale, (z+SvgSizeZ/2)*scale);
// }

// export const inGameToCanvasCoord = ({x,z}: InGameCoordinates, zoom: number): SvgCoordinates => {
//     const scale = zoomToSvgScale(zoom);
//     return svgCoord(x*scale, z*scale);
// }

export const inGameToGeoCoord = ({ix,iz}: InGameCoordinates): GeoCoordinates => {
	return geoCoord(zToLat(iz), xToLng(ix));
};

export const geoToInGameCoord = ({lat,lng}: GeoCoordinates): InGameCoordinates => {
	return inGameCoord(lngToX(lng), latToZ(lat));
};

export const inGameToSvgCoord= (zoom: number): (igc: InGameCoordinates)=>SvgCoordinates => {
	const scale = zoomToSvgScale(zoom);
	return ({ix,iz}) => svgCoord((ix+SvgSizeX/2)*scale, (iz+SvgSizeZ/2)*scale);
};

// In-game coord bounds which maps to geo coords
export const MapInGameMinX = -5000; // left most
export const MapInGameMinZ = -4000; // top most
export const MapInGameMaxX = 5000;  // right most
export const MapInGameMaxZ = 4000;  // bottom most

export const MapGeoMaxLng = 61.68; //longtitude that correspond to x=5000 in game
export const MapGeoMinLng = -158;  //longtitude that correspond to x=-5000 in game
export const MapGeoMaxLat = zToLat(-4000); //max latitude, notice this corresponds to z=-4000, which is min z
export const MapGeoMinLat = zToLat(4000);  //min latitude, notice this corresponds to z=4000, which is max z

export const SvgSizeX = 12000;
export const SvgSizeZ = 10000;
export const DynamicCanvasSizeX = 6000;
export const DynamicCanvasSizeZ = 5000;
