import { useCallback } from "react";
import { useAppState, ServiceContext } from "core/context";
import { RouteScript } from "data/bundler";
import { exampleRouteScriptPresets, exampleRouteScriptFunctions } from "data/docs";
import { EmptyObject } from "data/util";

export const InternalDocumentService: React.FC<EmptyObject> = ({children}) => {
	const { setRouteScript } = useAppState();
	const serviceFunction = useCallback((path)=>{
		switch(path){
			case "presets":
				setRouteScript(exampleRouteScriptPresets as unknown as RouteScript);
				break;
			case "functions":
				setRouteScript(exampleRouteScriptFunctions as unknown as RouteScript);
				break;
		}
	}, []);
	return (
		<ServiceContext.Provider value={serviceFunction}>
			{children}
		</ServiceContext.Provider>
	);
};
