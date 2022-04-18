import { useCallback, useEffect, useState } from "react";
import { ServiceContext, useAppState } from "core/context";
import { EmptyObject } from "data/util";
import { getRouteScriptAsync } from "./service";

export const DevelopmentService: React.FC<EmptyObject> = ({children}) => {
	const [reloadHandle, setReloadHandle] = useState<NodeJS.Timer | null>(null);
	const { setRouteScript, docCurrentLine, setDocScrollToLine} = useAppState();

	useEffect(()=>{
		return ()=>{
			if (reloadHandle){
				clearInterval(reloadHandle);
			}
		};
	}, [reloadHandle]);
	const serviceFunction = useCallback((path)=>{
		const load = async () => {
			console.log("Loading from local dev server "+path); // eslint-disable-line no-console
			const routescript = await getRouteScriptAsync("http://localhost:"+path);
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
    
	}, []);

	return (
		<ServiceContext.Provider value={serviceFunction}>
			{children}
		</ServiceContext.Provider>
	);
};
