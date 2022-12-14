import { InGameCoordinates, inGameToSvgCoord, NewMapLine, svgCoord, SvgCoordinates, SvgPolygon, SvgSizeX, SvgSizeZ, zoomToSvgScale } from "core/map";
import { nonNaN } from "data/util";

export interface MapSvgProps {
    zoom: number,
    segs: NewMapLine[]
}

export const MapSvg: React.FC<MapSvgProps> = ({zoom, segs}) => {
	const scale = zoomToSvgScale(zoom);
	return (
		<svg width={`${scale*SvgSizeX}px`} height={`${scale*SvgSizeZ}px`}>
			{
				segs.map((line, i, visible)=>{visible && <SvgPath key={i} color={line.color} coords={line.vertices} zoom={zoom}/>})
			}
		</svg>
	);
};

interface SvgPathProps {
    zoom: number,
    color: string,
    coords: InGameCoordinates[]
}

const SvgPath: React.FC<SvgPathProps> = ({zoom, color, coords}) => {
	const transformer = inGameToSvgCoord(zoom);
	const svgCoords = coords.map(transformer);
	const arrows = lineToArrows(svgCoords);
	return (
		<>
			<SvgLine color={color} coords={svgCoords} />
			<SvgMultiPolygon color={color} polygons={arrows} /> 
		</>
	);
       
};

interface SvgLineProps {
    coords: SvgCoordinates[],
    color: string;
}

const SvgLine: React.FC<SvgLineProps> = ({color, coords}) => 
	<path 
		strokeWidth={2}
		stroke={color}
		fill="transparent"
		d={(()=>{
			if(coords.length === 0){
				return "";
			}
			let s = "";
			coords.forEach(({sx,sz})=>{
				if(!s){
					s+=`M${sx} ${sz}`;
				}else{
					s+=` L${sx} ${sz}`;
				}
			});
			return s;
		})()}/>;

interface SvgMultiPolygonProps {
    polygons: SvgPolygon[],
    color: string,
}

const SvgMultiPolygon: React.FC<SvgMultiPolygonProps> = ({color, polygons}) => 
	<path 
		strokeWidth={4}
		stroke="transparent" 
		fill={color}
		d={(()=>{
			if(polygons.length === 0){
				return "";
			}
			let s = "";
			polygons.forEach(polygon=>{
				let sInner = "";
				polygon.forEach(({sx,sz})=>{
					if(!sInner){
						sInner+=`M${sx} ${sz}`;
					}else{
						sInner+=` L${sx} ${sz}`;
					}
				});
				sInner+="Z";
				s+=sInner;
                
			});
			return s;
		})()}/>;

const lineToArrows = (coords: SvgCoordinates[])=>{
	if(coords.length === 0){
		return [];
	}

	let lastX = NaN;
	let lastZ = NaN;

	const trianglexzs: SvgPolygon[] = [];
	const size = 6;
	coords.forEach(({sx,sz},i)=>{
		if (i===0){
			lastX = sx;
			lastZ = sz;
			return;
		}
		if(lastX === sx && lastZ === sz) /* change to more robust diff */{
			return;
		}
		const centerX = (sx+lastX)/2;
		const centerZ = (sz+lastZ)/2;
		//vector to end
		const veSquared = (sx-lastX)*(sx-lastX) + (sz-lastZ)*(sz-lastZ);
		const ve = Math.sqrt(veSquared);
		const veX = (sx-lastX)/ve*size; // = cos(t)
		const veZ = (sz-lastZ)/ve*size; // = sin(t)
		//convert to polar
		const veAngle = Math.atan2(veZ,veX);
		const a1 = veAngle + Math.PI*2/3;
		const a2 = a1 + Math.PI*2/3;
		trianglexzs.push([
			svgCoord(nonNaN(centerX+veX,0), nonNaN(centerZ+veZ,0)),
			svgCoord(nonNaN(centerX+size*Math.cos(a1),0), nonNaN(centerZ+size*Math.sin(a1),0)),
			svgCoord(nonNaN(centerX+size*Math.cos(a2),0), nonNaN(centerZ+size*Math.sin(a2),0))
		]);

		lastX = sx;
		lastZ = sz;
	});
	return trianglexzs;
};
