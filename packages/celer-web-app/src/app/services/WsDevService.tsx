import { useCallback, useEffect, useState } from "react";
import { ServiceContext, useAppState } from "core/context";
import { EmptyObject } from "data/util";
import { getRouteScriptAsync } from "./service";


let ws: WebSocket|null = null;
export const WsDevService: React.FC<EmptyObject> = ({children}) => {
	const { setRouteScript, docCurrentLine, setDocScrollToLine} = useAppState();


	const serviceFunction = useCallback((path)=>{
		const load = async () => {
            if(ws){
                console.log("Closing ws");
                ws.close();
            }
			console.log("Connecting to local ws dev server "+path); // eslint-disable-line no-console
            const newws = new WebSocket("ws://localhost:"+path);
			newws.onmessage=(e)=>{
                console.log(e);
            };
            ws = newws;
		};
       
		
	

		load();
        return ()=>{
            if(ws){
                console.log("Closing ws");
                ws.close();
            }
        }
    
	}, []);

	return (
		<ServiceContext.Provider value={serviceFunction}>
			{children}
		</ServiceContext.Provider>
	);
};
