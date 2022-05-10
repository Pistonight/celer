import { useCallback } from "react";
import { useParams } from "react-router-dom";
import { useAppState, ServiceContext } from "core/context";
import { SourceBundle } from "data/bundler";
import { exampleRouteScriptPresets, exampleRouteScriptFunctions } from "data/docs";
import { EmptyObject } from "data/util";

export const InternalDocumentService: React.FC<EmptyObject> = ({children}) => {
	const { setBundle, setRouteScript } = useAppState();
	const {reference} = useParams();
	const serviceFunction = useCallback(()=>{
		setBundle(null);
		switch(reference){
			case "presets":
				setRouteScript(exampleRouteScriptPresets as unknown as SourceBundle);
				break;
			case "functions":
				setRouteScript(exampleRouteScriptFunctions as unknown as SourceBundle);
				break;
		}
	}, [reference]);
	return (
		<ServiceContext.Provider value={serviceFunction}>
			{children}
		</ServiceContext.Provider>
	);
};
