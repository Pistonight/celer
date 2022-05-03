import { useCallback } from "react";
import { useAppState, ServiceContext } from "core/context";
import { SourceBundle } from "data/bundler";
import { exampleRouteScriptPresets, exampleRouteScriptFunctions } from "data/docs";
import { EmptyObject } from "data/util";

export const InternalDocumentService: React.FC<EmptyObject> = ({children}) => {
	const { setBundle, setRouteScript } = useAppState();
	const serviceFunction = useCallback((path)=>{
		setBundle(null);
		switch(path){
			case "presets":
				setRouteScript(exampleRouteScriptPresets as unknown as SourceBundle);
				break;
			case "functions":
				setRouteScript(exampleRouteScriptFunctions as unknown as SourceBundle);
				break;
		}
	}, []);
	return (
		<ServiceContext.Provider value={serviceFunction}>
			{children}
		</ServiceContext.Provider>
	);
};
