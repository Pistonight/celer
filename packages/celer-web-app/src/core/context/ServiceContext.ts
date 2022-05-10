import React, { useContext, useEffect } from "react";
import { emptyFunction } from "data/util";

type ServiceFunction = () => (()=>void) | void;

export const ServiceContext = React.createContext<ServiceFunction>(emptyFunction());

ServiceContext.displayName = "ServiceContext";

export const useService = ()=>{
	const serviceFunction = useContext(ServiceContext);
	useEffect(()=>{
		const cleanup = serviceFunction();
		if(cleanup){
			return cleanup;
		}
	}, [serviceFunction]);
};
