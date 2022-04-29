import { useCallback } from "react";
import { ServiceContext, useAppState } from "core/context";
import { bundleRouteScript, RouteScript } from "data/bundler";
import { EmptyObject } from "data/util";

let ws: WebSocket|null = null;
export const WsDevService: React.FC<EmptyObject> = ({children}) => {
	const { setBundle, setRouteScript } = useAppState();

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
			};
			newws.onmessage=(e)=>{
				const dataObject = JSON.parse(e.data);
				const routeScript = bundleRouteScript(dataObject);
				const bundle: any = {...routeScript}; // eslint-disable-line @typescript-eslint/no-explicit-any
				delete bundle.compilerVersion;
				setRouteScript(routeScript);
				setBundle(JSON.stringify(bundle));
			};
			ws = newws;
		};

		load();
		return ()=>{
			ws?.close();
		};
    
	}, []);

	return (
		<ServiceContext.Provider value={serviceFunction}>
			{children}
		</ServiceContext.Provider>
	);
};
