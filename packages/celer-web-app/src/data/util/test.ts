/*import-validation-exempt*/import { inGameCoord, InGameCoordinates, NewMapLine } from "core/map";

export const getRandomLinesForTestingPerformance = (count: number): NewMapLine[] => {
	const randomLineCoords: InGameCoordinates[][] = [[]];

	let lastZ = 0;
	let lastX = 0;

	for(let i=0;i<count;i++){
		if(randomLineCoords[randomLineCoords.length-1].length !== 0 && Math.random()<0.05) {
			randomLineCoords.push([]);
		}
		if(Math.random()<0.005){
			const nextZ = Math.floor(Math.random()*8000-4000);
			const nextX = Math.floor(Math.random()*10000-5000);

			lastX = nextX;
			lastZ = nextZ;
			randomLineCoords[randomLineCoords.length-1].push(inGameCoord(nextX, nextZ));

		}else{
			const z = Math.floor(Math.random()*500-250);
			const x = Math.floor(Math.random()*500-250);
			const nextX = lastX+x;
			const nextZ = lastZ+z;

			lastX = nextX;
			lastZ = nextZ;
			randomLineCoords[randomLineCoords.length-1].push(inGameCoord(nextX, nextZ));
		}
	}

	return randomLineCoords.map(coords=>({
		vertices: coords,
		color: randomColor()
	}));
};

export const getRandomIconsForTestingPerformance = () => {
	// Testing performance
	const randomMarkers: InGameCoordinates[] = [];
	const count = 1500;
	for(let i=0;i<count;i++){
		const z = Math.random()*8000-4000;
		const x = Math.random()*10000-5000;
		randomMarkers.push(inGameCoord(x,z));
	}

	return randomMarkers.map(coord=>({iconName: Math.random()<0.5?"shrine":"korok", coord}));
};

const randomColor = () => {
	const r = Math.random();
	if(r<0.2){
		return "red";
	}else if(r<0.4){
		return "yellow";
	}else if(r<0.6){
		return "#00ff00";
	}else if(r<0.8){
		return "cyan";
	}
	return "white";
};
