import L, { LatLngBounds } from "leaflet";
import { GeoJson, Point, GeoJsonFeature, Map, MinMaxBounds, Overlay, TileComponent, MapProps } from "pigeon-maps";
import { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import { useStyles } from "ui/StyleContext";
import { useAppExperiment, useAppState } from "core/context";
import { EmptyObject } from "data/util";

/*import-validation-exempt*/import SampleImage from "data/image/shrine.png";

import TestSvg from "./Test.svg";
import React from "react";
import { geoCoord, GeoCoordinates, geoToInGameCoord, inGameCoord, InGameCoordinates, inGameToCanvasCoord, inGameToGeoCoord, inGameToSvgCoord, svgCoord, SvgPolygon, zoomToSvgScale } from "core/map";
import {MapSvg} from "ui/components";
type MapFrameProps = {
	setSetCenterListener: (listener: (center: InGameCoordinates)=>void)=>void
}

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


const testCoords = [
	[inGameCoord(0,0),
	inGameCoord(4737.48, 3772.09),
	inGameCoord(5000,-4000)
	],
	[
		inGameCoord(-5000,4000),
		inGameCoord(-5000,-4000),
	]
]

// There are some properties that are not yet customizable in pigeon map
// so we override those here
class ModifiedMap extends Map {
	getBoundsMinMax = (_zoom: number): MinMaxBounds => {
		// console.log(zToLat(4000));
		// console.log(zToLat(-4000));
		return [zToLat(4000), zToLat(-4000), minLng, maxLng];
	};
	oldSetCenterZoom = this.setCenterZoom;
	setCenterZoom = (center?: Point | null, zoom?: number | null, animationEnded = false): void => {
		
	
		this.oldSetCenterZoom(center,zoom,animationEnded);
		const onAnimationZoomCallback = this.extendedProps<(zoom: number)=>void>("onAnimationZoomCallback");
		if(zoom && onAnimationZoomCallback){
			onAnimationZoomCallback(this.zoomPlusDelta());
		}
	};

	// oldSetCenterZoomTarget = this.setCenterZoomTarget;
	// setCenterZoomTarget = (
	// 	center: Point | null,
	// 	zoom: number,
	// 	fromProps = false,
	// 	zoomAround: Point | null = null,
	// 	animationDuration = 300
	//   ) => {
	// 	this.oldSetCenterZoomTarget(center,zoom,fromProps,zoomAround,animationDuration);
	// 	console.log(center);
	//   }

	extendedProps<T>(name: string): T|undefined {
		return (this.props as any)[name];
	}

	// render(): JSX.Element {
	// 	const { touchEvents, twoFingerDrag } = this.props
	// 	const { width, height } = this.state
	
	// 	const containerStyle: React.CSSProperties = {
	// 	  width: this.props.width ? width : '100%',
	// 	  height: this.props.height ? height : '100%',
	// 	  position: 'relative',
	// 	  display: 'inline-block',
	// 	  overflow: 'hidden',
	// 	  background: '#dddddd',
	// 	  touchAction: touchEvents ? (twoFingerDrag ? 'pan-x pan-y' : 'none') : 'auto',
	// 	}
	
	// 	const hasSize = !!(width && height)

	// 	const canvas = this.extendedProps("canvas");
	
	// 	return (
	// 	  <div style={containerStyle} ref={this.setRef}>
	// 		{hasSize && this.renderTiles()}
	// 		{hasSize && this.renderOverlays()}
	// 		{hasSize && this.renderAttribution()}
	// 		{hasSize && this.renderWarning()}
	// 		{/* {hasSize && canvas} */}
	// 	  </div>
	// 	)
	//   }
}

let lastAnimationZoom = -1;

export const MapFrame: React.FC<MapFrameProps> = ({setSetCenterListener})=>{


	const [zoom, setZoom] = useState<number>(DEFAULT_ZOOM);
	const [animating, setAnimating] = useState<boolean>(false);
	const [animationZoom, setAnimationZoom] = useState<number>(DEFAULT_ZOOM);
	const [center, setCenter] = useState<GeoCoordinates>(geoCoord(0,0));
	const [manualSetCenter, setManualSetCenter] = useState<InGameCoordinates|undefined>(undefined);
	//console.log(zoom);
	useEffect(()=>{
		setSetCenterListener(c=>{
			setManualSetCenter(c);
		})
	}, [setSetCenterListener]);
	useEffect(()=>{
		if(!manualSetCenter){
			return;
		}
		const centerInGameCoord = geoToInGameCoord(center);
		const THRESHOLD = 5;
		if(Math.abs(centerInGameCoord.x-manualSetCenter.x)<THRESHOLD && Math.abs(centerInGameCoord.z-manualSetCenter.z)<THRESHOLD){
			setManualSetCenter(undefined);
		}
	}, [center, manualSetCenter]);

	const canvasRef = useRef<HTMLCanvasElement>(null);
	//console.log(canvasRef.current);
	useEffect(()=>{
		
		const canvas = canvasRef.current;
		
		// if(animating && zoom === lastZoom){
		// 	return;
		// }
		// lastZoom = zoom;
		//console.log(canvas);
		//const realZoom = animating ? animationZoom : zoom;
		// if(animating && Math.abs(z-lastDrawAnimationZoom) < 0.2){
		// 	console.log("skip draw");
		// 	return;
		// }
		//lastDrawAnimationZoom = z;
		if(canvas){
			// if(!animating){
			// 	canvas.width = 12000*zoomToSvgScale(realZoom);
			// 	canvas.height = 10000*zoomToSvgScale(realZoom);
			// }
			
			const context = canvas.getContext("2d");
			if(context){
				context.setTransform(1,0,0,1,0,0); // Reset transformation
				context.clearRect(0,0,canvas.width,canvas.height);
				//if(animationZoom===lastAnimationZoom){
					context.strokeStyle='red';
					context.strokeRect(0,0,canvas.width,canvas.height);
										const icon = new Image();
						icon.src = SampleImage;
						
						randomMarkers.forEach(igc=>{
							const {x,z} = inGameToSvgCoord(igc,zoom);
							context.drawImage(icon,x-12,z-12,24,24);
						});
				//}else{
					lastAnimationZoom = animationZoom;
				//}
				//const scale = Math.pow(2, realZoom-zoom);
				//context.scale(scale,scale);
				//console.log(scale);
				
			}
			// if(animating){
			// 	//scale the graphics without resizing canvas
			// 	const supposedWidth = zoomToSvgScale(realZoom);
			// 	const graphicsWidth = zoomToSvgScale(zoom);
			// 	//const supposedHeight = zoomToSvgScale(z);
			// 	//const graphicsHeight = zoomToSvgScale(zoom);
			// 	const context = canvas.getContext("2d");
			// 	const scale = Math.pow(2, realZoom-zoom);
			// 	//console.log(scale);
			// 	if(context){
			// 		context.setTransform(1,0,0,1,0,0); // Reset transformation
			// 		context.clearRect(0,0,canvas.width,canvas.height);
			// 		context.translate(canvas.width/4,canvas.height/4);
			// 		context.scale(scale, scale);
					
			// 		const icon = new Image();
			// 		icon.src = SampleImage;
					
			// 		randomMarkers.forEach(igc=>{
			// 			const {x,z} = inGameToCanvasCoord(igc,zoom);
			// 			context.drawImage(icon,x-12,z-12,24,24);
			// 		})
			// 	}
			// }else{
			// 	canvas.width = 12000*zoomToSvgScale(realZoom)*2;
			// 	canvas.height = 10000*zoomToSvgScale(realZoom)*2;
			// 	const context = canvas.getContext("2d");
			// 	if(context){
			// 		context.setTransform(1,0,0,1,0,0); // Reset transformation
			// 		context.clearRect(0,0,canvas.width,canvas.height);
			// 		context.translate(6000*zoomToSvgScale(realZoom),5000*zoomToSvgScale(realZoom));
			// 		const icon = new Image();
			// 		icon.src = SampleImage;
					
			// 		randomMarkers.forEach(igc=>{
			// 			const {x,z} = inGameToCanvasCoord(igc,zoom);
			// 			context.drawImage(icon,x-12,z-12,24,24);
			// 		})
			// 	}
			// }

				
			
		}
	}, [canvasRef, canvasRef.current, zoom]);
	// useEffect(()=>{
	// 	console.log(zoom);
	// }, [zoom]);

	

	//const [bounds, setBounds] = useState<ViewportXZ>({minX: -5000, maxX:5000, minZ: -4000, maxZ: 4000});
	// console.log(center);
	const { mapCore } = useAppState();
	const styles = useStyles();
	const PigeonMapEnabled = useAppExperiment("BetterMap");

	const manualCenterGeo = manualSetCenter === undefined ? undefined : inGameToGeoCoord(manualSetCenter);
	const manualCenterLatLng = manualCenterGeo === undefined ? undefined : [manualCenterGeo.lat, manualCenterGeo.lng];
	if(PigeonMapEnabled){
		return (
			<div id="mapframe" className={styles.mapFrame}>
				
				{
					React.createElement(ModifiedMap as any, {
						provider: (x: number,y: number,z: number)=>{
							return xyzToUrl(x,y,z);
							
						},
						onAnimationZoomCallback:(aZoom: number)=>{
							setAnimating(true);
							setAnimationZoom(aZoom);
							const canvas = canvasRef.current;
		
							// if(animating && zoom === lastZoom){
							// 	return;
							// }
							// lastZoom = zoom;
							//console.log(canvas);
							//const realZoom = animating ? animationZoom : zoom;
							// if(animating && Math.abs(z-lastDrawAnimationZoom) < 0.2){
							// 	console.log("skip draw");
							// 	return;
							// }
							//lastDrawAnimationZoom = z;
							if(canvas){
								// if(!animating){
									canvas.width = 12000*zoomToSvgScale(aZoom);
									canvas.height = 10000*zoomToSvgScale(aZoom);
								// }
								
								const context = canvas.getContext("2d");
								
								if(context){
									context.setTransform(1,0,0,1,0,0); // Reset transformation
									context.clearRect(0,0,canvas.width,canvas.height);
									//if(animationZoom===lastAnimationZoom){
										context.strokeStyle='red';
										context.strokeRect(0,0,canvas.width,canvas.height);
															const icon = new Image();
											icon.src = SampleImage;
											
											randomMarkers.forEach(igc=>{
												const {x,z} = inGameToSvgCoord(igc,aZoom);
												context.drawImage(icon,x-12,z-12,24,24);
											});
									//}else{
										//lastAnimationZoom = animationZoom;
									//}
									//const scale = Math.pow(2, realZoom-zoom);
									//context.scale(scale,scale);
									//console.log(scale);
									
								}
							}
						},
						tileComponent:Tile,
						//zoom,
						center: manualCenterLatLng,
						onBoundsChanged:({center,zoom}: {center: [number, number] /* lat, lng */, zoom: number})=>{
							//console.log(zoom);
							// const vp = {
							// 	minX: lngToX(bounds.sw[1]),
							// 	maxX: lngToX(bounds.ne[1]),
							// 	minZ: latToZ(bounds.ne[0]),
							// 	maxZ: latToZ(bounds.sw[0]),
							// }
							setZoom(zoom);
							setAnimating(false);
							setCenter(geoCoord(center[0], center[1]));
							//console.log({center});
							//setBounds(vp);
							
						},
						minZoom: 2,
						maxZoom: 8,
						defaultZoom: DEFAULT_ZOOM,
						
					},
						
							<Overlay  anchor={xzToLatLng(4737.48, 3772.09)} offset={[12, 12]}>
				<img src={SampleImage} width={24} height={24} alt='' />
			</Overlay>,

					<Overlay anchor={xzToLatLng(0,0)} offset={!animating ? [6000*zoomToSvgScale(zoom),5000*zoomToSvgScale(zoom)] : [6000*zoomToSvgScale(animationZoom),5000*zoomToSvgScale(animationZoom)]}>
					
					
					<MapSvg zoom={animating? animationZoom : zoom} segs={randomLine}/>
					
						
						
						
      </Overlay>,
	  <Overlay anchor={xzToLatLng(-6000,-5000)} offset={[0,0]}>
					
					<canvas ref={canvasRef} width={`${12000*zoomToSvgScale(zoom)}px`} height={`${10000*zoomToSvgScale(zoom)}px`}/>
	  
	  
		  
		  
		  
</Overlay>
	  
						
					)
				}
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

// const zoomToScale = (zoom: number): number => {
// 	//console.log(1<<(zoom-2));
// 	//if(zoom===2)
// 	//return 0.0625 * (1<<(zoom-2));
// 	if(zoom === Math.floor(zoom)){
// 		return 0.0625 * (1<<(zoom-2));
// 	}
// 	const smallZoom = Math.floor(zoom);
// 	const s = 0.0625 * Math.pow(2, smallZoom-2);
// 	//const s2 = s*2;
// 	console.log({
// 		s,
// 		scale: s+(zoom-smallZoom)*s,
// 		zoom
// 	});
// 	return s+(zoom-smallZoom)*s;
	
// 	return s;
// 	//return 0.125;
// }

// const transformX = (x: number, zoom: number): number => {
// 	return (x+5000)*zoomToScale(zoom);
// }

// const transformZ = (z: number, zoom: number): number => {
// 	return (z+4000)*zoomToScale(zoom);
// }

// Experiment Code
const Tile: TileComponent = ({tile, tileLoaded}) => {
	let [x,y,z] = urlToXyz(tile.url);
	let url = "";
	url = `https://objmap.zeldamods.org/game_files/maptex/${z}/${x}/${y}.png`;

	// if (z==8){
	// 	//z=7;
	// 	//x=Math.floor(x/2);
	// 	y//=Math.floor(y/2);
	// }
	const data = {
		2: [2, 2],
		3: [5, 4],
		4: [11, 9],
		5: [23, 19],
		6: [46, 39], 
		7: [93, 78]
	};
	if (!(z in data)){
		url = "blank_tile.png";
	}else if (x<0 || y<0){
		//console.log({x,y});
		url = "blank_tile.png";
	}else if (x>data[z as keyof typeof data][0] || y>data[z as keyof typeof data][1]){
		//console.log({x,y});
		url = "blank_tile.png";
	}


	if (z===8){
		url = `https://objmap.zeldamods.org/game_files/maptex/7/${Math.floor(x/2)}/${Math.floor(y/2)}.png`;
		let clipTop = y%2===0 ? 0 : tile.height;
		let clipRight = x%2===0 ? tile.width : 0;
		let clipBottom = y%2===0 ? tile.height : 0;
		let clipLeft = x%2===0 ? 0 : tile.width;
		let left = x%2===0 ? tile.left: tile.left - tile.width;
		let top = y%2===0 ? tile.top : tile.top - tile.height; 
		return <>
		<img
		src={url}
		//srcSet={tile.srcSet}
		loading='lazy'
		onLoad={tileLoaded}
		width={(tile.width*2)+1}
		height={(tile.height*2)+1}
		style={{
			position: "absolute",
			left: left,
			top: top,
			willChange: "transform",
			transformOrigin: "top left",
			opacity: 1,
			clipPath: `inset(${clipTop} ${clipRight} ${clipBottom} ${clipLeft})`
		}}
	/>
	{/* <div style={{left: tile.left, top: tile.top, position: "absolute", transformOrigin: "top left"}}>
		({x}, {y}, {z})
	</div> */}
		</>;
	}
	//console.log({x,y,z});
	return <>
	<img
		src={url}
		//srcSet={tile.srcSet}
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
	{/* <div style={{left: tile.left, top: tile.top, position: "absolute", transformOrigin: "top left"}}>
		({x}, {y}, {z})
	</div> */}
	</>
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
const randomMarkers: InGameCoordinates[] = [];
const count = 500;
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
	
	//randomMarkers.push(<Marker key={`${x}_${z}`} width={20} anchor={[lat, lng]}/>);
	randomMarkers.push(inGameCoord(x,z));
}

const randomLine: InGameCoordinates[][] = [[]];
const count2 = 5000;
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
	if(randomLine[randomLine.length-1].length !== 0 && Math.random()<0.05) {
		randomLine.push([]);
	}
	if(Math.random()<0.005){
		const nextZ = Math.floor(Math.random()*8000-4000);
		const nextX = Math.floor(Math.random()*10000-5000);
		
		lastX = nextX;
		lastZ = nextZ;
		randomLine[randomLine.length-1].push(inGameCoord(nextX, nextZ));

	}else{
		const z = Math.floor(Math.random()*500-250);
		const x = Math.floor(Math.random()*500-250);
		const nextX = lastX+x;
		const nextZ = lastZ+z;
		// console.log({
		// 	x, z
		// });
		lastX = nextX;
		lastZ = nextZ;
		randomLine[randomLine.length-1].push(inGameCoord(nextX, nextZ));
	}
	//moveX = !moveX;
}



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

// const _arrowsForRandomLines = lineToGeoJsonArrows(randomLine);
// const _linesForRandomLines = _lineToGeoJsonFeatures(randomLine);

const xyzToUrl = (x: number, y: number, z: number): string => {
	return `tile://${x}/${y}/${z}`;
}

const urlToXyz = (url: string): [number, number, number] => {
	if (!url.startsWith("tile://")){
		return [NaN, NaN, NaN];
	}
	return url.substring(7).split("/").map((x)=>parseInt(x)) as [number, number, number];
}
