export type KorokData = {[region: string]: boolean[]}

export const KOROK_COUNT: {[region: string]: number} = {
	C: 89,
	P: 18,
	L: 92,
	D: 59,
	F: 58,
	N: 66,
	Z: 62,
	E: 45,
	K: 35,
	A: 57,
	X: 25,
	T: 37,
	G: 36,
	W: 68,
	H: 73,
	R: 79,
};

export const getMissingKoroks = (data: KorokData): string[] => {
	const missedKoroks: string[] = [];
	for(const region in data){
		const count  = KOROK_COUNT[region];
		for(let i = 1;i<=count; i++){
			if(!data[region][i]){
				const korok = `${region}${i<10?"0":""}${i}`;
				missedKoroks.push(korok);
			}
		}
	}
	return missedKoroks;
};

export const addKorok = (data: KorokData, korok: string):void => {
	const region = korok.substring(0, 1);
	const id = Number(korok.substring(1));
	data[region][id]=true;
};

export const hasKorok = (data: KorokData, korok: string): boolean => {
	const region = korok.substring(0, 1);
	const id = Number(korok.substring(1));
	return data[region][id] === true;
};

export const newData = ():KorokData =>{
	const data:KorokData = {};
	for(const region in KOROK_COUNT){
		data[region] = [];
	}
	return data;
};
