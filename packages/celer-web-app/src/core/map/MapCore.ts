import L from "leaflet";
import { Coord, SplitType } from "core/compiler";
import Icons from "data/image";
import { Consumer } from "data/util";
import { MapIcon, MapLine } from "./MapEngine";
import { gameCoordToMapCoord } from "./convert";
import { IconSize } from "./type";
// A Wrapper for L.Map
export class MapCore {
	private mapInstance?: L.Map;
	private coreIcons?: L.FeatureGroup;
	private otherIcons?: L.FeatureGroup;
	private lines?: L.FeatureGroup;
	private iconSize: IconSize;
	constructor(){
		this.iconSize = IconSize.Medium;
	}

	public setMap(map: L.Map): void{
		if(this.mapInstance){
			console.error("Error: Trying to set map but map is already set.");
			return;
		}
		this.mapInstance = map;
		this.mapInstance.on("zoomend", (e)=>{
			const zoom = (e.target || e.sourceTarget)._zoom || 4;
			const shouldAddOtherIcons = this.shouldShowOtherIcons(zoom);
			this.retryIfMapNotLoaded((map)=>{
				if(this.otherIcons && map.hasLayer(this.otherIcons)){
					if(!shouldAddOtherIcons){
						this.removeFeature(map, this.otherIcons);
					}
				}else if(shouldAddOtherIcons && this.otherIcons){
					this.otherIcons.addTo(map);
				}
			});
		});
		setTimeout(() => {
			map.invalidateSize();
		}, 1000);
	}

	private shouldShowOtherIcons(zoom: number): boolean{
		return zoom >= 6;
	}

	private retryIfMapNotLoaded(action: Consumer<L.Map>, retryTimes?: number): void {
		if(!this.mapInstance){
			if(retryTimes && retryTimes > 5){
				return;
			}
			setTimeout(() => {
				this.retryIfMapNotLoaded(action, (retryTimes||0)+1);
			}, 200);
			return;
		}
		action(this.mapInstance);
	}

	public setIcons(icons: MapIcon[]): void{
		this.retryIfMapNotLoaded((map)=>{
			this.removeFeature(map, this.coreIcons);
			this.removeFeature(map, this.otherIcons);
			const coreIconLayers: L.Layer[] = [];
			const otherIconLayers: L.Layer[] = [];
			icons.forEach((icon)=>{
				const { iconName, coord, type } = icon;
				if(iconName in Icons){
					const newIcon = L.marker(gameCoordToMapCoord(coord), {
						icon: L.icon({
							iconUrl: Icons[iconName],
							iconSize: [this.iconSize, this.iconSize]
						})
					});
					if(type === SplitType.None){
						otherIconLayers.push(newIcon);
					}else{
						coreIconLayers.push(newIcon);
					}
				}

			});
			this.coreIcons = L.featureGroup(coreIconLayers);
			this.addFeature(map, this.coreIcons);
			this.otherIcons = L.featureGroup(otherIconLayers);
			if(this.shouldShowOtherIcons(map.getZoom())){
				this.addFeature(map, this.otherIcons);
			}
		});
	}

	public setLines(lines: MapLine[]): void{
		this.retryIfMapNotLoaded(map=>{
			this.removeFeature(map, this.lines);
			const mapLines: L.Layer[] = [];
			lines.forEach(line=>{
				const {vertices, color} = line;
				const mapCoords = vertices.map(gameCoordToMapCoord);

				const newArrow = L.polyline(mapCoords, {
					color
				}).arrowheads({
					yawn: 60,
					fill: true,
					frequency: "50px",
					size: "8px"
				});

				mapLines.push(newArrow);
			});
			this.lines = L.featureGroup(mapLines);
			this.addFeature(map, this.lines);
		});
	}

	private removeFeature(map: L.Map,feature?: L.FeatureGroup): void {
		if(feature && map.hasLayer(feature)){
			map.removeLayer(feature);
		}
	}

	private addFeature(map: L.Map,feature?: L.FeatureGroup): void{
		if(feature && !map.hasLayer(feature)){
			feature.addTo(map);
		}
	}

	public centerMap(coord: Coord): void {
		this.retryIfMapNotLoaded((map)=>{
			map.flyTo(gameCoordToMapCoord(coord));
		});
	}

	public invalidateSize(): void {
		setTimeout(() => {
			this.retryIfMapNotLoaded(map=>map.invalidateSize());
		}, 400);
	}
}
