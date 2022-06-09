import { 
	Point, 
	Map as PigeonMap,
	MinMaxBounds
} from "pigeon-maps";
import { MapGeoMinLng, MapGeoMaxLng, MapGeoMaxLat, MapGeoMinLat } from "core/map";

type AnimationZoomCallback = (zoom: number, ended: boolean)=>void;
// We override some functions from pigeon map to fit our use case
export class MapOverride extends PigeonMap {
	// Overriding bounds min max to always return the same bounds corresbounding to the in game coords, regardless of zoom
	getBoundsMinMax = (_zoom: number): MinMaxBounds => {
		return [MapGeoMinLat, MapGeoMaxLat, MapGeoMinLng, MapGeoMaxLng];
	};

	// Hooking setCenterZoom to install a callback used to update drawing when zooming
	oldSetCenterZoom = this.setCenterZoom;
	setCenterZoom = (center?: Point | null, zoom?: number | null, animationEnded = false): void => {
		this.oldSetCenterZoom(center,zoom,animationEnded);
		const onAnimationZoomCallback = this.extendedProps<AnimationZoomCallback>("onAnimationZoomCallback");
		if(zoom && onAnimationZoomCallback){
			onAnimationZoomCallback(this.zoomPlusDelta(), animationEnded);
		}
	};

	extendedProps<T>(name: string): T|undefined {
		const p = this.props as any; // eslint-disable-line @typescript-eslint/no-explicit-any
		return p[name]; 
	}

}
