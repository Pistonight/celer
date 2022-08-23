import { DynamicCanvasSizeX, DynamicCanvasSizeZ, geoToInGameCoord, inGameToSvgCoord, zoomToSvgScale } from "./convert";
import { GeoCoordinates, InGameCoordinates, svgCoord, SvgCoordinates } from "./type";

const inGameToDynamicCanvasCoord = (center: GeoCoordinates, zoom: number): (igc: InGameCoordinates)=>SvgCoordinates => {
	const {ix: centerX, iz: centerZ} = geoToInGameCoord(center);
	const scale = zoomToSvgScale(zoom);
	return ({ix,iz})=>{
		const igOffX = ix - centerX;
		const igOffZ = iz - centerZ;
		const svgOffX = igOffX * scale;
		const svgOffZ = igOffZ * scale;
		return svgCoord(svgOffX,svgOffZ);
	};
}; 

export class MapCanvas {
	private context: CanvasRenderingContext2D | null = null;
	private tempImage = new Image();

	public bindAndReset(canvas?: HTMLCanvasElement | null): boolean {
		if(!canvas){
			return false;
		}

		const context = canvas.getContext("2d");
		if(!context){
			return false;
		}
		// Reset
		context.setTransform(1,0,0,1,0,0);
		context.clearRect(0,0,canvas.width,canvas.height);

		this.context = context;
		return true;
	}

	public renderIcon(data: string, svgc: SvgCoordinates, size: number): void {
		if(!this.context){
			return;
		}
		this.tempImage.src = data;
		const {sx,sz} = svgc;
		this.context?.drawImage(this.tempImage,sx-size/2,sz-size/2,size,size);
	}

	public translate(x: number, y: number): void{
		this.context?.translate(x,y);
	}

	// Initialze coord system for rendering in a single, static canvas
	public withStaticCoordinateTransformer(zoom: number, action: (transformer: (igc: InGameCoordinates)=>SvgCoordinates)=>void): void{
		action(inGameToSvgCoord(zoom));
	}

	// Initialize coord system for rendering in dynamic canvas
	public withDynamicCoordinateTransformer(center: GeoCoordinates, zoom: number, action: (transformer: (igc: InGameCoordinates)=>SvgCoordinates)=>void): void {
		this.translate(DynamicCanvasSizeX/2,DynamicCanvasSizeZ/2);
		action(inGameToDynamicCanvasCoord(center,zoom));
	}
}
