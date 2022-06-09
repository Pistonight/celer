import { TileComponentProps } from "pigeon-maps";
import { internalTileUrlToXyz, objmapTileUrlOrBlank } from "core/map";

export const MapTile: React.FC<TileComponentProps> = ({tile, tileLoaded}) => {
	const [x,y,z] = internalTileUrlToXyz(tile.url);
	const style: React.CSSProperties = {
		position: "absolute",
		left: tile.left,
		top: tile.top,
		willChange: "transform",
		transformOrigin: "top left",
		opacity: 1,
	};
	let tileWidth: number,tileHeight: number, url: string;

	if (z===8){
		const isTop = y%2===0;
		const isLeft = x%2===0;
		
		const clipTop = isTop ? 0 : tile.height;
		const clipRight = isLeft ? tile.width : 0;
		const clipBottom = isTop ? tile.height : 0;
		const clipLeft = isLeft? 0 : tile.width;
		style.left = isLeft ? tile.left: tile.left - tile.width;
		style.top = isTop ? tile.top : tile.top - tile.height; 
		style.clipPath = `inset(${clipTop} ${clipRight} ${clipBottom} ${clipLeft})`;
		tileWidth = tile.width*2;
		tileHeight = tile.height*2;
		url = objmapTileUrlOrBlank(Math.floor(x/2), Math.floor(y/2), 7);
	}else{
		style.left = tile.left;
		style.top = tile.top;
		tileWidth = tile.width;
		tileHeight = tile.height;
		url = objmapTileUrlOrBlank(x,y,z);
	}

	return (
		<img
			src={url}
			loading='lazy'
			onLoad={tileLoaded}
			width={tileWidth+1}
			height={tileHeight+1}
			style={style}
		/>);
};
