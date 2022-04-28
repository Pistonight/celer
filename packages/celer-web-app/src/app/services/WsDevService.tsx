import { useCallback, useEffect, useState } from "react";
import { ServiceContext, useAppState } from "core/context";
import { EmptyObject } from "data/util";
import { RouteScript } from "data/bundler";


let ws: WebSocket|null = null;
export const WsDevService: React.FC<EmptyObject> = ({children}) => {
	const { setRouteScript } = useAppState();


	const serviceFunction = useCallback((path)=>{
		const load = async () => {
            ws?.close();
			console.log("Connecting to local ws dev server "+path); // eslint-disable-line no-console
            const newws = new WebSocket("ws://localhost:"+path);
			newws.onerror=(e)=>{
				console.error(e);
				const errorRouteScript: RouteScript = {
					_project: {
						name: "",
						authors: [],
						url: "",
						version: "Unknown",
						description: ""
					},
					compilerVersion: "2.1.0" as const,
					_route: [
						"(!=) Cannot connect to the dev server. Make sure the dev server is running and refresh the page to try again"
					]
				};
				setRouteScript(errorRouteScript);
			}
			newws.onmessage=(e)=>{
                const data_object = JSON.parse(e.data);
				setRouteScript(data_object);
            };
            ws = newws;
		};
       
		
	

		load();
        return ()=>{
            ws?.close();
        }
    
	}, []);

	return (
		<ServiceContext.Provider value={serviceFunction}>
			{children}
		</ServiceContext.Provider>
	);
};
