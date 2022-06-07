import { InGameCoordinates, inGameToSvgCoord, svgCoord, SvgCoordinates, SvgPolygon, zoomToSvgScale } from "core/map";

export interface MapSvgProps {
    zoom: number,
    segs: InGameCoordinates[][]
}

export const MapSvg: React.FC<MapSvgProps> = ({zoom, segs}) => {
    return <svg width={`${12000*zoomToSvgScale(zoom)}px`} height={`${10000*zoomToSvgScale(zoom)}px`}>
						{
                            segs.map((coords, i)=><SvgPath key={i} coords={coords} zoom={zoom}/>)
                        }
					</svg>
}

interface SvgPathProps {
    zoom: number,
    coords: InGameCoordinates[]
}

const SvgPath: React.FC<SvgPathProps> = ({zoom, coords}) => {
    const svgCoords = coords.map(igc=>inGameToSvgCoord(igc, zoom));
    const arrows = lineToArrows(svgCoords);
    return <>
        <SvgLine coords={svgCoords} />,
        <SvgMultiPolygon polygons={arrows} />
        </>
}

interface SvgLineProps {
    coords: SvgCoordinates[]
}

const SvgLine: React.FC<SvgLineProps> = ({coords}) => (
    <path 
        strokeWidth={2}
        stroke="white" 
        fill="transparent"
        d={(()=>{
            if(coords.length === 0){
                return "";
            }
            let s = "";
            coords.forEach(({x,z})=>{
                if(!s){
                    s+=`M${x} ${z}`;
                }else{
                    s+=` L${x} ${z}`;
                }
            });
            return s;
      })()}/>
)

interface SvgMultiPolygonProps {
    polygons: SvgPolygon[]
}

const SvgMultiPolygon: React.FC<SvgMultiPolygonProps> = ({polygons}) => (
    <path 
        strokeWidth={2}
        stroke="transparent" 
        fill="white"
        d={(()=>{
            if(polygons.length === 0){
                return "";
            }
            let s = "";
            polygons.forEach(polygon=>{
                let sInner = "";
                polygon.forEach(({x,z})=>{
                    if(!sInner){
                        sInner+=`M${x} ${z}`;
                    }else{
                        sInner+=` L${x} ${z}`;
                    }
                })
                sInner+="Z";
                s+=sInner;
                
            });
            return s;
      })()}/>
)

const lineToArrows = (coords: SvgCoordinates[])=>{
	if(coords.length === 0){
		return [];
	}

	let lastX = NaN;
	let lastZ = NaN;

	const trianglexzs: SvgPolygon[] = [];
	const size = 6;
	coords.forEach(({x,z},i)=>{
		if (i===0){
			lastX = x;
			lastZ = z;
			return;
		}
		const centerX = (x+lastX)/2;
		const centerZ = (z+lastZ)/2;
		//vector to end
		const veSquared = (x-lastX)*(x-lastX) + (z-lastZ)*(z-lastZ);
		const ve = Math.sqrt(veSquared);
		const veX = (x-lastX)/ve*size; // = cos(t)
		const veZ = (z-lastZ)/ve*size; // = sin(t)
		//convert to polar
		const veAngle = Math.atan2(veZ,veX);
		const a1 = veAngle + Math.PI*2/3;
		const a2 = a1 + Math.PI*2/3;
		trianglexzs.push([
			svgCoord(centerX+veX, centerZ+veZ),
			svgCoord(centerX+size*Math.cos(a1), centerZ+size*Math.sin(a1)),
			svgCoord(centerX+size*Math.cos(a2), centerZ+size*Math.sin(a2))
		]);

		lastX = x;
		lastZ = z;
	});
	return trianglexzs;
};
