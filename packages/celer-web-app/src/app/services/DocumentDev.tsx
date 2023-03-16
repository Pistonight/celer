import { Params } from "react-router-dom";
import { wasmBundle, wasmBundleFromBase64 } from "data/libs";
import { Consumer } from "data/util";
import { Document, DocumentResponse } from "./types";

class DocumentDev implements Document {
	private ws: WebSocket | null = null;
	private port = "2222";
	private enableBase64: boolean;

	constructor(enableBase64: boolean, port?: string) {
		if (port) {
			this.port = port;
		}
		this.enableBase64 = enableBase64;
	}
	load(callback: Consumer<DocumentResponse>): void {
		console.log("Connecting to local ws dev server " + this.port); // eslint-disable-line no-console
		const newws = new WebSocket("ws://localhost:" + this.port);
		newws.onerror = (e) => {
			console.error(e);
			callback({error: "Cannot connect to the dev server. Make sure the dev server is running and refresh the page to try again"});
		};
		newws.onmessage = (e) => {
			const dataObject = JSON.parse(e.data);
			if (this.enableBase64) {
				if (dataObject.type) {
					if (dataObject.type === "base64") {
						const doc = wasmBundleFromBase64(dataObject.data).bundle; //Discard the errors for now
						callback({doc});
					} else {
						callback({error: "Unknown data type"});
					}
					return;
				}
				// Fallback to old protocol
			}

			const bundleResult = wasmBundle(dataObject).bundle; //Discard the errors for now
			callback({doc: bundleResult});

		};
		newws.onopen = () => {
			callback({ status: "Waiting for data"});
		};
		this.ws = newws;
		callback({ status: "Connecting to dev server" });
	}
	release(): void {
		this.ws?.close();
	}

	getPath(): string {
		return "dev/" + this.port;
	}
}

export const createDocumentDev = ({port}: Params<string>, enableBase64: boolean) => new DocumentDev(enableBase64, port);
