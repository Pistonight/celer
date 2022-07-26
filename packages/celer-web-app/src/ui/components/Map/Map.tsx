import { Overlay, MapProps as PigeonMapProps } from "pigeon-maps";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { 
	DynamicCanvasSizeX, 
	DynamicCanvasSizeZ, 
	geoCoord, 
	GeoCoordinates, 
	geoToInGameCoord, 
	inGameCoord, 
	InGameCoordinates, 
	inGameToGeoCoord, 
	internalTileUrl, 
	MapCanvas, 
	NewMapIcon, 
	NewMapLine, 
	SvgSizeX, 
	SvgSizeZ, 
	zoomToSvgScale 
} from "core/map";
import Icons from "data/image";
import { MapOverride } from "./MapOverride";
import { MapSvg } from "./MapSvg";
import { MapTile } from "./MapTile";

export interface MapProps {
    icons: NewMapIcon[];
    lines: NewMapLine[];
	manualCenter: InGameCoordinates|undefined;
}

const DefaultZoom = 3;

const ZOOMTHRES = 6;

const mapCanvas = new MapCanvas();

const IconSize = 32;
const IconSizeSmall = 24;

const InGameOriginGeoCoord = inGameToGeoCoord(inGameCoord(0,0));
const DynamicCanvasAnchorGeoCoord = inGameToGeoCoord(inGameCoord(-DynamicCanvasSizeX,-DynamicCanvasSizeZ));

export const Map: React.FC<MapProps> = ({icons, lines, manualCenter}) => {
	const [zoom, setZoom] = useState<number>(DefaultZoom);
	const [animating, setAnimating] = useState<boolean>(false);
	const [animationZoom, setAnimationZoom] = useState<number>(DefaultZoom);
	const [center, setCenter] = useState<GeoCoordinates>(geoCoord(0,0));

	const realZoom = animating ? animationZoom : zoom;
	// For zoom <= 6, a single canvas that covers the entire map is used, and it's not redrawn when dragging
	// For zoom > 6, a single canvas would be too big, so we use a dynamic canvas and redraw it when dragging
	const dynamicCanvasMode = realZoom > ZOOMTHRES;

	const dynamicCanvasAnchor: [number, number] = useMemo(()=>{
		const scale = zoomToSvgScale(realZoom);
		const {ix: centerX, iz: centerZ} = geoToInGameCoord(center);
		const anchorGeo = inGameToGeoCoord(inGameCoord(centerX-DynamicCanvasSizeX/2/scale, centerZ-DynamicCanvasSizeZ/2/scale));
		return [anchorGeo.lat, anchorGeo.lng];
	}, [realZoom, center]);

	// If this is not undefined, the map will be force centered here
	const manualCenterLatLng = useMemo(()=>{
		if(!manualCenter){
			return undefined;
		}
		const centerInGameCoord = geoToInGameCoord(center);
		const THRESHOLD = 0.5;
		if(Math.abs(centerInGameCoord.ix-manualCenter.ix)<THRESHOLD && Math.abs(centerInGameCoord.iz-manualCenter.iz)<THRESHOLD){
			return undefined;
		}

		const manualCenterGeo = manualCenter === undefined ? undefined : inGameToGeoCoord(manualCenter);
		const manualCenterLatLng = manualCenterGeo === undefined ? undefined : [manualCenterGeo.lat, manualCenterGeo.lng];
		return manualCenterLatLng;
	}, [manualCenter]); // Only update this when manualCenter is changed by parent

	const canvasRef = useRef<HTMLCanvasElement>(null);

	// Static canvas render
	useEffect(()=>{
		if (dynamicCanvasMode){
			return;
		}
		if(!mapCanvas.bindAndReset(canvasRef.current)){
			return;
		}
		mapCanvas.withStaticCoordinateTransformer(zoom, (transformer)=>{
			icons.forEach(({coord, iconName})=>{
				mapCanvas.renderIcon(Icons[iconName], transformer(coord), zoom===2?IconSizeSmall:IconSize);
			});
		});
		
	}, [canvasRef, canvasRef.current, icons, zoom]);

	// Dynamic canvas render
	useEffect(()=>{
		if (!dynamicCanvasMode){
			return;
		}
		if(!mapCanvas.bindAndReset(canvasRef.current)){
			return;
		}
		mapCanvas.withDynamicCoordinateTransformer(center, zoom, (transformer)=>{
			icons.forEach(({coord, iconName})=>{
				mapCanvas.renderIcon(Icons[iconName], transformer(coord), IconSize);
			});
		});
	}, [canvasRef, canvasRef.current, icons, zoom, center]);

	const onAnimationZoomCallback = useCallback((animationZoom: number, _animationEnded: boolean)=>{
		setAnimating(true);
		setAnimationZoom(animationZoom);
  
		const canvas = canvasRef.current;

		if(animationZoom > ZOOMTHRES){
			if(!mapCanvas.bindAndReset(canvas)){
				return;
			}
			mapCanvas.withDynamicCoordinateTransformer(center, animationZoom, (transformer)=>{
				icons.forEach(({coord, iconName})=>{
					mapCanvas.renderIcon(Icons[iconName], transformer(coord), IconSize);
				});
			});

		}else{
			if(!canvas){
				return;
			}
			canvas.width = SvgSizeX*zoomToSvgScale(animationZoom);
			canvas.height = SvgSizeZ*zoomToSvgScale(animationZoom);
			if(!mapCanvas.bindAndReset(canvas)){
				return;
			}

			mapCanvas.withStaticCoordinateTransformer(animationZoom, (transformer)=>{
				icons.forEach(({coord, iconName})=>{
					mapCanvas.renderIcon(Icons[iconName], transformer(coord), animationZoom<3?IconSizeSmall:IconSize);
				});
			});
			
		}
	}, [canvasRef, canvasRef.current, center, icons]);
	
	const overrideProps = {
		provider: internalTileUrl,
		onAnimationZoomCallback,
		tileComponent:MapTile,
		//zoom,
		center: manualCenterLatLng,
		onBoundsChanged:({center,zoom}: {center: [number, number] /* lat, lng */, zoom: number})=>{
			setZoom(zoom);
			setCenter(geoCoord(center[0], center[1]));
			setAnimating(false);
            
		},
		minZoom: 2,
		maxZoom: 8,
		defaultZoom: DefaultZoom,
		defaultCenter: [InGameOriginGeoCoord.lat, InGameOriginGeoCoord.lng],
		attribution: <a style={{color: "rgb(0, 120, 168)", textDecoration: "none"}} href="https://objmap.zeldamods.org/" target="_blank" rel="noreferrer">objmap.zeldamods.org</a>,
		attributionPrefix: false,
	} as PigeonMapProps;
	return (
		<MapOverride {...overrideProps}>
			<Overlay 
				anchor={[InGameOriginGeoCoord.lat, InGameOriginGeoCoord.lng]} 
				offset={[SvgSizeX/2*zoomToSvgScale(realZoom),SvgSizeZ/2*zoomToSvgScale(realZoom)]}
			>
				<MapSvg zoom={realZoom} segs={lines}/>
			</Overlay>
			<Overlay 
				anchor={dynamicCanvasMode? dynamicCanvasAnchor :[DynamicCanvasAnchorGeoCoord.lat, DynamicCanvasAnchorGeoCoord.lng]} 
				offset={[0,0]}
			>
				{dynamicCanvasMode ?
					<canvas ref={canvasRef} width={DynamicCanvasSizeX} height={DynamicCanvasSizeZ}/>
					:
					<canvas ref={canvasRef} width={`${Math.floor(SvgSizeX*zoomToSvgScale(zoom))}`} height={`${Math.floor(SvgSizeZ*zoomToSvgScale(zoom))}`}/>
				}
			</Overlay>
		</MapOverride>
	);
};
