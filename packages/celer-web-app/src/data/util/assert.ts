export const nonnull = <T>(t?: T): T => {
	if (t !== null && t !== undefined){
		return t;
	}
	throw new Error("Nonnull assertion failed");
};
