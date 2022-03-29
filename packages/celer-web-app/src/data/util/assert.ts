export const nonnull = <T>(t?: T): T => {
	if (t){
		return t;
	}
	throw new Error("Nonnull assertion failed");
};
