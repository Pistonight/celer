import L, { LatLngBounds } from "leaflet";
import { GeoJsonFeature, Map, MinMaxBounds, Overlay, TileComponent } from "pigeon-maps";
import { useState } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import { useStyles } from "ui/StyleContext";
import { useAppExperiment, useAppState } from "core/context";
import { EmptyObject } from "data/util";

/*import-validation-exempt*/import SampleImage from "data/image/shrine.png";
type MapFrameProps = EmptyObject

const DEFAULT_ZOOM = 3;
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

// There are some properties that are not yet customizable in pigeon map
// so we override those here
class ModifiedMap extends Map {
	getBoundsMinMax = (_zoom: number): MinMaxBounds => {
		// console.log(zToLat(4000));
		// console.log(zToLat(-4000));
		return [zToLat(4000), zToLat(-4000), minLng, maxLng];
	};
}

export const MapFrame: React.FC<MapFrameProps> = ()=>{
	const [zoom, setZoom] = useState<number>(DEFAULT_ZOOM);
	const [center, setCenter] = useState<[number, number]>(xzToLatLng(0,0));
	//const [bounds, setBounds] = useState<ViewportXZ>({minX: -5000, maxX:5000, minZ: -4000, maxZ: 4000});
	// console.log(center);
	const { mapCore } = useAppState();
	const styles = useStyles();
	const PigeonMapEnabled = useAppExperiment("PigeonMap");
	if(PigeonMapEnabled){
		return (
			<div id="mapframe" className={styles.mapFrame}>
				<ModifiedMap provider={(x,y,z)=>{
					if (z>7){
						z=7;
					}
					const data = {
						2: [2, 2],
						3: [5, 4],
						4: [11, 9],
						5: [23, 19],
						6: [46, 39], 
						7: [93, 78]
					};
					if (!(z in data)){
						return "blank_tile.png";
					}
					if (x<0 || y<0){
						return "blank_tile.png";
					}
					if (x>data[z as keyof typeof data][0] || y>data[z as keyof typeof data][1]){
						return "blank_tile.png";
					}
					return `https://objmap.zeldamods.org/game_files/maptex/${z}/${x}/${y}.png`;
				}}
				tileComponent={Tile}
				zoom={zoom}
				center={center}
				onBoundsChanged={({center,zoom})=>{
					// const vp = {
					// 	minX: lngToX(bounds.sw[1]),
					// 	maxX: lngToX(bounds.ne[1]),
					// 	minZ: latToZ(bounds.ne[0]),
					// 	maxZ: latToZ(bounds.sw[0]),
					// }
					setZoom(zoom);
					setCenter(center);
					//setBounds(vp);
					
				}}
				minZoom={2}
				maxZoom={8}
				defaultZoom={DEFAULT_ZOOM}
				>
					{/* <GeoJson
      svgAttributes={{
        
        strokeWidth: "2",
        stroke: "white",
        
      }}
    >
      {
	lineToGeoJsonFeatures(randomLine, bounds)
	}
    </GeoJson> */}
					{/* <GeoJson
      svgAttributes={{
        fill: "white",
        strokeWidth: "2",
        stroke: "white",
        
      }}
    >
      {
		arrowsForRandomLines
	}
    </GeoJson> */}
					{
						randomMarkers
					}
					
				</ModifiedMap>
			</div>
		);
	}
	return (
		<div id="mapframe" className={styles.mapFrame}>
			<MapContainer 
				style={{height: "100%", backgroundColor:"black"}}
				center={[0, 0]} 
				zoom={4} 
				crs={L.CRS.Simple} 
				minZoom={3} 
				attributionControl={false}
				zoomControl={false}
				maxZoom={7} maxBounds={new LatLngBounds([-32,-39.0625], [32,39.0625])}
				whenCreated={(map)=>{   
					mapCore.setMap(map);
				}}>
		
				<TileLayer
					noWrap
					tileSize={256}
					errorTileUrl="https://raw.githubusercontent.com/iTNTPiston/botw-map-tiles/main/tiles/empty.png"
					url="https://raw.githubusercontent.com/iTNTPiston/botw-map-tiles/main/tiles/{z}/{x}_{y}.png"
				/>
			</MapContainer>
		</div>
	);
};
// Experiment Code
const Tile: TileComponent = ({tile, tileLoaded}) => {
	return <img
		src={tile.url}
		srcSet={tile.srcSet}
		loading='lazy'
		onLoad={tileLoaded}
		width={tile.width+1}
		height={tile.height+1}
		style={{
			position: "absolute",
			left: tile.left,
			top: tile.top,
			willChange: "transform",
			transformOrigin: "top left",
			opacity: 1,
		}}
	/>;
};

const latLngToLngLat = (latLng: [number, number]): [number, number] => {
	return [latLng[1], latLng[0]];
};

const xzToLatLng = (x: number, z: number): [number, number] => {
	return [zToLat(z), xToLng(x)];
};
const _latLngToXz = (lat: number, lng: number): [number, number] => {
	return [lngToX(lng), latToZ(lat)];
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

// Testing performance
const randomMarkers: JSX.Element[] = [];
const count = 1000;
// for(let x=-5000;x<=5000;x+=1000){
// 	for(let z=-4000;z<=4000;z+=1000){
// 		const [lat, lng] = xzToLatLng(x, z);
// 		randomMarkers.push(<Overlay key={`${x}_${z}`} anchor={[lat,lng]} offset={[12, 12]}>
//         <img src={SampleImage} width={24} height={24} alt='' />
//       </Overlay>);
// 	}
// }
for(let i=0;i<count;i++){
	const z = Math.random()*8000-4000;
	const x = Math.random()*10000-5000;
	const [lat, lng] = xzToLatLng(x, z);
	//randomMarkers.push(<Marker key={`${x}_${z}`} width={20} anchor={[lat, lng]}/>);
	randomMarkers.push(<Overlay key={`${x}_${z}`} anchor={[lat,lng]} offset={[12, 12]}>
		<img src={SampleImage} width={24} height={24} alt='' />
	</Overlay>);
}

const randomLine: [number, number][] = [];
const count2 = 2000;
// for(let x=-5000;x<=5000;x+=1000){
// 	for(let z=-4000;z<=4000;z+=1000){
// 		const [lat, lng] = xzToLatLng(x, z);
// 		randomLine.push([lng, lat]);
// 	}
// }
let lastZ = 0;
let lastX = 0;
//let moveX = false
for(let i=0;i<count2;i++){
	if(Math.random()<0.005){
		const nextZ = Math.floor(Math.random()*8000-4000);
		const nextX = Math.floor(Math.random()*10000-5000);
		
		// console.log({
		// 	x, z
		// });
		const [lat, lng] = xzToLatLng(nextX, nextZ);
		lastX = nextX;
		lastZ = nextZ;
		randomLine.push([lng, lat]);
		// const z = Math.floor(Math.random()*500-250);
		// const x = 0;//Math.floor(Math.random()*500-250);
		// const nextX = lastX+x;
		// const nextZ = lastZ+z;
		// // console.log({
		// // 	x, z
		// // });
		// const [lat, lng] = xzToLatLng(nextX, nextZ);
		// lastX = nextX;
		// lastZ = nextZ;
		// randomLine.push([lng, lat]);
	}else{
		const z = Math.floor(Math.random()*500-250);
		const x = Math.floor(Math.random()*500-250);
		const nextX = lastX+x;
		const nextZ = lastZ+z;
		// console.log({
		// 	x, z
		// });
		const [lat, lng] = xzToLatLng(nextX, nextZ);
		lastX = nextX;
		lastZ = nextZ;
		randomLine.push([lng, lat]);
	}
	//moveX = !moveX;
}

const lineToGeoJsonArrows = (lngLatArray: [number, number][])=>{
	if(lngLatArray.length === 0){
		return [];
	}

	let lastX = NaN;
	let lastZ = NaN;

	const trianglexzs: [[number,number],[number,number],[number,number]][] = [];
	const size = 5;
	lngLatArray.forEach((point,i)=>{
		const [lng, lat] = point;
		const x = lngToX(lng);
		const z = latToZ(lat);
		if (i===0){
			lastX = x;
			lastZ = z;
			return;
		}
		const centerX = (x+lastX)/2;
		const centerZ = (z+lastZ)/2;
		//vector to end
		const veSquared = (x-lastX)*(x-lastX) + (z-lastZ)*(z-lastZ);
		const ve = Math.sqrt(veSquared);
		const veX = (x-lastX)/ve*size; // = cos(t)
		const veZ = (z-lastZ)/ve*size; // = sin(t)
		//convert to polar
		const veAngle = Math.atan2(veZ,veX);
		const a1 = veAngle + Math.PI*2/3;
		const a2 = a1 + Math.PI*2/3;
		trianglexzs.push([
			[centerX+veX, centerZ+veZ],
			[centerX+size*Math.cos(a1), centerZ+size*Math.sin(a1)],
			[centerX+size*Math.cos(a2), centerZ+size*Math.sin(a2)]
		]);

		lastX = x;
		lastZ = z;
	});
	const polygons = trianglexzs.map((triangle)=>{
		const [p1,p2, p3] = triangle;
		const first = latLngToLngLat(xzToLatLng(...p1));
		return [[
			first,
			latLngToLngLat(xzToLatLng(...p2)),
			latLngToLngLat(xzToLatLng(...p3)),
			first
		]];
	});
	//console.log(polygons);
	const arrowFeature = <GeoJsonFeature feature={{
		type: "Feature",
		geometry: { type: "MultiPolygon", coordinates: polygons },
	}} />;
	return arrowFeature;
};

const _lineToGeoJsonFeatures = (lngLatArray: [number, number][])=>{
	if(lngLatArray.length === 0){
		return [];
	}
	const lineFeature = <GeoJsonFeature feature={{
		type: "Feature",
		geometry: { type: "LineString", coordinates: lngLatArray },
	}} />;
	return lineFeature;
};

const _arrowsForRandomLines = lineToGeoJsonArrows(randomLine);
