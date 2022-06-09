export const nonnull = <T>(t?: T | null): T => {
	if (t !== null && t !== undefined){
		return t;
	}
	throw new Error("Nonnull assertion failed");
};

export const nonNaN = (n: number, d: number): number => {
	if(Number.isNaN(n)){
		return d;
	}
	return n;
};
