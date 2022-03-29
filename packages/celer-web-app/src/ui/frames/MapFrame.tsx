import { EmptyObject } from "data/util";
import L, { LatLngBounds } from "leaflet";
import { MapContainer, TileLayer } from "react-leaflet";
import { useAppRoot } from "ui/root";
import { useStyles } from "ui/styles";

type MapFrameProps = EmptyObject

export const MapFrame: React.FC<MapFrameProps> = ()=>{
	const { mapCore } = useAppRoot();
	const styles = useStyles();
	return (
		<div className={styles.mapFrame}>
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
