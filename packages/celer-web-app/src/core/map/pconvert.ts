import { geoCoord, GeoCoordinates, inGameCoord, InGameCoordinates, svgCoord, SvgCoordinates } from "./type";

const minX = -5000;//left most
const minZ = -4000;// top most
const maxX = 5000;//right most
const maxZ = 4000;//bottom most

const maxLng = 61.68;//longtitude that correspond to x=5000 in game
const minLng = -158;//longtitude that correspond to x=-5000 in game
const LatScale = 85.0511287798066 * 2;
const maxLat = 8.4;
const minLat = -74.65;
const maxLatTile= maxLat / LatScale+0.5;
const minLatTile = minLat / LatScale+0.5;

export const zoomToSvgScale = (zoom: number): number => {
    return 0.0625 * Math.pow(2, zoom-2);
	//console.log(1<<(zoom-2));
	//if(zoom===2)
	//return 0.0625 * (1<<(zoom-2));
	// if(zoom === Math.floor(zoom)){
	// 	return 0.0625 * (1<<(zoom-2));
	// }
	// const smallZoom = Math.floor(zoom);
	// const s = 0.0625 * Math.pow(2, smallZoom-2);
	// //const s2 = s*2;
	// // console.log({
	// // 	s,
	// // 	scale: s+(zoom-smallZoom)*s,
	// // 	zoom
	// // });
	// return s+(zoom-smallZoom)*s;
	
	//return s;
	//return 0.125;
}

export const inGameToSvgCoord = ({x,z}: InGameCoordinates, zoom: number): SvgCoordinates => {
    const scale = zoomToSvgScale(zoom);
    return svgCoord((x+6000)*scale, (z+5000)*scale);
}

export const inGameToCanvasCoord = ({x,z}: InGameCoordinates, zoom: number): SvgCoordinates => {
    const scale = zoomToSvgScale(zoom);
    return svgCoord(x*scale, z*scale);
}

export const inGameToGeoCoord = ({x,z}: InGameCoordinates): GeoCoordinates => {
    return geoCoord(zToLat(z), xToLng(x));
}

export const geoToInGameCoord = ({lat,lng}: GeoCoordinates): InGameCoordinates => {
    return inGameCoord(lngToX(lng), latToZ(lat));
}
const latLngToLngLat = (latLng: [number, number]): [number, number] => {
	return [latLng[1], latLng[0]];
};


const xToLng = (x: number): number => {
	const percentageX = (x-minX)/(maxX-minX);
	return percentageX * (maxLng-minLng)+minLng;
};
const lngToX = (lng: number): number => {
	const percentageLng = (lng-minLng)/(maxLng-minLng);
	return percentageLng * (maxX-minX)+minX;
};
const zToLat = (z: number): number => {
	const percentageZ = (z-minZ)/(maxZ-minZ);
	const latPercentage = percentageZ*(maxLatTile-minLatTile)+minLatTile;
	const lat = tile2lat(latPercentage);

	return lat;
};
const latToZ = (lat: number): number => {
	const latPercentage = lat2tile(lat);
	const percentageZ = (latPercentage-minLatTile)/(maxLatTile-minLatTile);
	return percentageZ * (maxZ-minZ)+minZ;
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
