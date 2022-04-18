import L from "leaflet";
import { useEffect, useState } from "react";
import { Coord } from "core/compiler";
import { gameCoordToMapCoord } from "core/map";

export interface MapArrowProps {
    map: L.Map;
    arrowSize: number;
    vertices: Coord[];
    color: string;
}

export const MapArrowComponent: React.FC<MapArrowProps> = ({map, vertices, arrowSize, color})=>{
	const [arrowLayer, setArrowLayer] = useState<L.Polyline>();
	useEffect(()=>{
		if(map){
			if (arrowLayer){
				map.removeLayer(arrowLayer);
			}
			const mapCoords = vertices.map(gameCoordToMapCoord);

			const newArrow = L.polyline(mapCoords, {
				color
			}).arrowheads({
				yawn: 60,
				fill: true,
				frequency: "50px",
				size: `${arrowSize}px`
			});
			setArrowLayer(newArrow);
			newArrow.addTo(map);
		}

		return ()=>{
			if(map){
				arrowLayer?.remove();
			}    
		};
	}, [map, vertices, arrowSize, color]);
	return null;
};
