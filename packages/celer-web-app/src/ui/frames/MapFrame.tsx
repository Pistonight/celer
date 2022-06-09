import L, { LatLngBounds } from "leaflet"; 
import React from "react";
import { MapContainer, TileLayer } from "react-leaflet"; 
import { useStyles } from "ui/StyleContext";
import { Map } from "ui/components";
import { Coord } from "core/compiler";
import { useAppExperiment, useAppState } from "core/context";
import { inGameCoord, InGameCoordinates, MapIcon, MapLine, NewMapIcon, NewMapLine } from "core/map";

type MapFrameProps = {
	setSetCenterListener: (listener: (center: InGameCoordinates)=>void)=>void
}

const updateCoord = ({x,z}: Coord): InGameCoordinates => {
	return inGameCoord(x,z);
};

const updateMapLines = (lines: MapLine[]): NewMapLine[] => lines.map(({color, vertices})=>({color, vertices: vertices.map(updateCoord)}));

const updateIcon = (icons: MapIcon[]): NewMapIcon[] => icons.map(({iconName, coord})=>({iconName, coord: updateCoord(coord)}));
export const MapFrame: React.FC<MapFrameProps> = ({setSetCenterListener})=>{
	const { mapCore, mapLines, mapIcons } = useAppState();
	const styles = useStyles();
	const PigeonMapEnabled = useAppExperiment("BetterMap");
	if(PigeonMapEnabled){
		return (
			<div id="mapframe" className={styles.mapFrame}>
				<Map setSetCenterListener={setSetCenterListener} icons={updateIcon(mapIcons)} lines={updateMapLines(mapLines)} />
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
