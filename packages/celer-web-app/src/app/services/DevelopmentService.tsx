import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ServiceContext, useAppState } from "core/context";
import { EmptyObject } from "data/util";
import { getRouteScriptAsync } from "./service";

export const DevelopmentService: React.FC<EmptyObject> = ({children}) => {
	const [reloadHandle, setReloadHandle] = useState<NodeJS.Timer | null>(null);
	const { setBundle, setRouteScript, docCurrentLine, setDocScrollToLine} = useAppState();
	const {port: paramPort} = useParams();

	const port = paramPort ?? "2222";

	useEffect(()=>{
		return ()=>{
			if (reloadHandle){
				clearInterval(reloadHandle);
			}
		};
	}, [reloadHandle]);

	const serviceFunction = useCallback(()=>{

		const load = async () => {
			setBundle(null);
			console.log("Loading from local dev server "+port); // eslint-disable-line no-console
			const routescript = await getRouteScriptAsync("http://localhost:"+port);
			setRouteScript(routescript);
		};
       
		if(reloadHandle){
			clearInterval(reloadHandle);
		}
		const handle = setInterval(()=>{
			setDocScrollToLine(docCurrentLine);
			load();
		}, 5000);
		setReloadHandle(handle);
		load();
    
	}, [port]);

	return (
		<ServiceContext.Provider value={serviceFunction}>
			{children}
		</ServiceContext.Provider>
	);
};
