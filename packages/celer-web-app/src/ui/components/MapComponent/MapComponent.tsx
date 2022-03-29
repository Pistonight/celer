import { IconSize, MapIcon, MapLine } from "core/map";
import { MapArrowComponent } from "./MapArrowComponent";
import { MapIconComponent } from "./MapIconComponent";
import Icons from "data/image";

export interface MapProps {
    map?: L.Map;
    icons: MapIcon[];
    lines: MapLine[];
}

export const MapComponent: React.FC<MapProps> = ({map, icons, lines}) =>{
	if(!map){
		return null;
	}
	return (
		<>
			{
				icons.map((icon,i)=>{
					//hack
					const size = IconSize.Medium;
					if (icon.iconName === "equipment" || icon.iconName === "chest"){
						return null;
					}
					return <MapIconComponent key={i} map={map} targetCoord={icon.coord} targetIcon={Icons[icon.iconName]} iconSize={size} />;
				})
			}
			{
				lines.map((line,i)=><MapArrowComponent key={i} map={map} arrowSize={8} vertices={line.vertices} color={line.color} />)
			}
		</>
	);
};
