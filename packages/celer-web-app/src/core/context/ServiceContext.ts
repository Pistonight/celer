import React, { useContext, useEffect } from "react";
import { emptyFunction } from "data/util";

type ServiceFunction = (reference?: string) => void;

export const ServiceContext = React.createContext<ServiceFunction>(emptyFunction());

ServiceContext.displayName = "ServiceContext";

export const useService = (name?: string)=>{
	const serviceFunction = useContext(ServiceContext);
	useEffect(()=>{
		serviceFunction(name);
	}, [serviceFunction, name]);
};
