import L, { LatLngBounds } from "leaflet"; 
import React, { useEffect } from "react";
import { MapContainer, TileLayer } from "react-leaflet"; 
import { useStyles } from "ui/StyleContext";
import { Map } from "ui/components";
import { Coord } from "core/compiler";
import { useAppState } from "core/context";
import { useExpBetterMap } from "core/experiments";
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
	const { mapCore, mapLines, mapIcons } = useAppState();
	const styles = useStyles();
	const PigeonMapEnabled = useExpBetterMap();
	useEffect(()=>{
		if(!PigeonMapEnabled && manualCenter){
			mapCore.centerMap({x: manualCenter.ix, z: manualCenter.iz});
		}
	}, [manualCenter]);
	if(PigeonMapEnabled){
		return (
			<div id="mapframe" className={styles.mapFrame}>
				<Map manualCenter={manualCenter} icons={updateIcon(mapIcons)} lines={updateMapLines(mapLines)} />
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
