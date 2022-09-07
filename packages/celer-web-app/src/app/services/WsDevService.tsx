import { bundleRouteScript } from "data/bundler";
import { SourceObject, wasmBundle } from "data/libs";
import { DocumentService } from "./types";

class WebSocketDevService implements DocumentService {
	private ws: WebSocket|null = null;
	private port: string = "2222";
	private useExpBetterBundler: boolean;

	constructor(useExpBetterBundler: boolean, port: string){
		this.useExpBetterBundler = useExpBetterBundler;
		if (port){
			this.port = port;
		}
	}
	start(callback: (doc: SourceObject | null, error: string | null, status: string | null) => void): void {
		console.log("Connecting to local ws dev server "+this.port); // eslint-disable-line no-console
		const newws = new WebSocket("ws://localhost:"+this.port);
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

export const createWebSocketDevService = (useExpBetterBundler: boolean, port: string)=>new WebSocketDevService(useExpBetterBundler, port);
