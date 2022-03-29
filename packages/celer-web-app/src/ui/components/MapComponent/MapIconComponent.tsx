import { gameCoordToMapCoord } from "core/map/convert";
import { IconSize } from "core/map/type";
import { Coord } from "data/assembly";
import L from "leaflet";
import { useEffect, useState } from "react";

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
