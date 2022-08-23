import { useCallback } from "react";
import { useParams } from "react-router-dom";
import { ServiceContext, useAppState } from "core/context";
import { SourceObject, wasmBundle } from "data/libs";
import { EmptyObject } from "data/util";
import { DocumentService } from "./types";
import { bundleRouteScript } from "data/bundler";

let ws: WebSocket|null = null;
export const WsDevServiceOld: React.FC<EmptyObject> = ({children}) => {
	const { setBundle, setRouteScript } = useAppState();

	const {port: paramPort} = useParams();
	const port = paramPort ?? "2222";

	const serviceFunction = useCallback(()=>{
		const load = async () => {
			ws?.close();
			console.log("Connecting to local ws dev server "+port); // eslint-disable-line no-console
			const newws = new WebSocket("ws://localhost:"+port);
			newws.onerror=(e)=>{
				console.error(e);
				const errorRouteScript: SourceObject = {
					_project: {
						name: "",
						authors: [],
						url: "",
						version: "Unknown",
						description: ""
					},
					_route: [
						"(!=) Cannot connect to the dev server. Make sure the dev server is running and refresh the page to try again"
					],
					_config: {}
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

class WebSocketDevService implements DocumentService {
	private ws: WebSocket|null = null;
	private useExpBetterBundler: boolean;

	constructor(useExpBetterBundler: boolean){
		this.useExpBetterBundler = useExpBetterBundler;
	}
	start(callback: (doc: SourceObject | null, error: string | null, status: string | null) => void): void {
		const port = "2222";
		console.log("Connecting to local ws dev server "+port); // eslint-disable-line no-console
		const newws = new WebSocket("ws://localhost:"+port);
		newws.onerror=(e)=>{
			console.error(e);
			callback(null, "Cannot connect to the dev server. Make sure the dev server is running and refresh the page to try again", null);
		};
		newws.onmessage=(e)=>{
			const dataObject = JSON.parse(e.data);
			if(this.useExpBetterBundler){
				const bundleResult = wasmBundle(dataObject).bundle; //Discard the errors for now
				callback(bundleResult, null, null);
			}else{
				callback(bundleRouteScript(dataObject), null, null);
			}
			

		};
		newws.onopen = ()=>{
			callback(null, null, "Waiting for data");
		};
		this.ws = newws;
		callback(null, null, "Connecting to dev server");
	}
	release(): void {
		this.ws?.close();
	}
	
}

export const createWebSocketDevService = (useExpBetterBundler: boolean)=>new WebSocketDevService(useExpBetterBundler);
