import { SourceObject, wasmBundle } from "data/libs";
import { DocumentService, ServiceCreator } from "./types";

class WebSocketDevService implements DocumentService {
	private ws: WebSocket | null = null;
	private port = "2222";

	constructor(port?: string) {
		if (port) {
			this.port = port;
		}
	}
	start(callback: (doc: SourceObject | null, error: string | null, status: string | null) => void): void {
		console.log("Connecting to local ws dev server " + this.port); // eslint-disable-line no-console
		const newws = new WebSocket("ws://localhost:" + this.port);
		newws.onerror = (e) => {
			console.error(e);
			callback({error: "Cannot connect to the dev server. Make sure the dev server is running and refresh the page to try again"});
		};
		newws.onmessage = (e) => {
			const dataObject = JSON.parse(e.data);
			const bundleResult = wasmBundle(dataObject).bundle; //Discard the errors for now
			callback(bundleResult, null, null);
		};
		newws.onopen = () => {
			callback(null, null, "Waiting for data");
		};
		this.ws = newws;
		callback({status: "Connecting to dev server"});
	}
	release(): void {
		this.ws?.close();
	}
	addToRecentPages(): void {
		// Adding WebSocketDevService to recent pages not yet supported
	}
}

export const createWebSocketDevService: ServiceCreator = ({port}) => new WebSocketDevService(port);
