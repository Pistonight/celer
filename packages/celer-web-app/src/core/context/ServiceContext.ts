import React, { useContext, useEffect } from "react";
import { useExpNewDP } from "core/experiments";
import { emptyFunction } from "data/util";

type ServiceFunction = () => (()=>void) | void;

export const ServiceContext = React.createContext<ServiceFunction>(emptyFunction());

ServiceContext.displayName = "ServiceContext";

export const useService = ()=>{
	const enableDocumentProvider = useExpNewDP();

	const serviceFunction = useContext(ServiceContext);
	useEffect(()=>{
		if(!enableDocumentProvider){
			const cleanup = serviceFunction();
			if(cleanup){
				return cleanup;
			}
		}
	}, [serviceFunction]);
};
