import L from "leaflet";
import { useEffect, useState } from "react";
import { Coord } from "core/compiler";
import { gameCoordToMapCoord, IconSize } from "core/map";

export interface MapIconProps {
    map: L.Map;
    targetCoord: Coord;
    targetIcon: string;
    iconSize: IconSize;
}

export const MapIconComponent: React.FC<MapIconProps> = ({map, targetCoord, targetIcon, iconSize})=>{
	const [iconLayer, setIconLayer] = useState<L.Marker>();
	useEffect(()=>{
		if (iconLayer){
			iconLayer.remove();
		}

		const newIcon = L.marker(gameCoordToMapCoord(targetCoord), {
			icon: L.icon({
				iconUrl: targetIcon,
				iconSize: [iconSize, iconSize]
			})
		});
		setIconLayer(newIcon);
		newIcon.addTo(map);

		return ()=>{
			iconLayer?.remove();
		};
	}, [map, targetCoord.x, targetCoord.z, targetIcon, iconSize]);
	return null;
};
