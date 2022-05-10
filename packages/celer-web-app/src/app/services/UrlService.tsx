import queryString from "query-string";
import { useCallback } from "react";
import { useLocation } from "react-router-dom";
import { ServiceContext } from "core/context";
import { EmptyObject } from "data/util";
import { useLoadRouteAsync } from "./service";

export const UrlService: React.FC<EmptyObject> = ({children}) => {

	const {search} = useLocation();
	const query = queryString.parse(search);
	const url = `${query[""]}`;
	const serviceFunction = useLoadRouteAsync(url);
	const alertWrapper = useCallback(()=>{
		if(confirm(`Allow access to ${url}?`)){
			serviceFunction();
		}
	}, [serviceFunction,url]);
	return (
		<ServiceContext.Provider value={alertWrapper}>
			{children}
		</ServiceContext.Provider>
	);
};
