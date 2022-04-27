import React, { useContext, useEffect } from "react";
import { emptyFunction } from "data/util";

type ServiceFunction = (reference?: string) => (()=>void) | void;

export const ServiceContext = React.createContext<ServiceFunction>(emptyFunction());

ServiceContext.displayName = "ServiceContext";

export const useService = (name?: string)=>{
	const serviceFunction = useContext(ServiceContext);
	useEffect(()=>{
		const cleanup = serviceFunction(name);
		if(cleanup){
			return cleanup;
		}
	}, [serviceFunction, name]);
};
