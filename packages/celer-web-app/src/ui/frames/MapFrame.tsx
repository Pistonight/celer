import { useStyles } from "ui/StyleContext";
import { Map } from "ui/components";
import { Coord } from "core/compiler";
import { useAppState } from "core/context";
import { inGameCoord, InGameCoordinates, MapIcon, MapLine, NewMapIcon, NewMapLine } from "core/map";

type MapFrameProps = {
	manualCenter: InGameCoordinates|undefined;
}

const updateCoord = ({x,z}: Coord): InGameCoordinates => {
	return inGameCoord(x,z);
};

const updateMapLines = (lines: MapLine[]): NewMapLine[] => lines.map(({color, vertices})=>({color, vertices: vertices.map(updateCoord)}));

const updateIcon = (icons: MapIcon[]): NewMapIcon[] => icons.map(({iconName, coord})=>({iconName, coord: updateCoord(coord)}));
export const MapFrame: React.FC<MapFrameProps> = ({manualCenter})=>{
	const { mapLines, mapIcons } = useAppState();
	const styles = useStyles();

	return (
		<div id="mapframe" className={styles.mapFrame}>
			<Map manualCenter={manualCenter} icons={updateIcon(mapIcons)} lines={updateMapLines(mapLines)} />
		</div>
	);
};
