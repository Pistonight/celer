// Empty implementations
export const emptyConsumer= ()=><T>(t:T):void => {
	console.error(t);
	throw new Error("Empty Impl called");
};

export const emptyObject = <T>()=>({} as unknown as T);

export const emptyFunction = <T>()=>(()=>{
	throw new Error("Empty Impl called");
}) as unknown as T;
