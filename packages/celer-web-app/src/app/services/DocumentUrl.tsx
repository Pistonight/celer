import axios from "axios";
import { wasmBundleFromGzip, wasmCleanBundleJson } from "data/libs";
import { Consumer } from "data/util";
import { Document, DocumentResponse } from "./types";

export type DocumentUrlConfig = {
	url: string,
	path: string,
	type: "json" | "gzip"
}

export class DocumentUrl implements Document {
	private config: DocumentUrlConfig[];
	private path: string;
	private controller: AbortController = new AbortController();

	constructor(config: DocumentUrlConfig[]) {
		this.config = config;
		this.path = "";
	}

	load(callback: Consumer<DocumentResponse>): void {
		this.fetchRouteAsync().then((response) => {
			if (response.error) {
				callback({ error: response.error });
				return;
			}
			if (response.doc) {
				callback({ doc: response.doc });
				return;
			}
			callback({ error: "Unknown error" });
		});
	}

	async fetchRouteAsync(): Promise<DocumentResponse> {
		let lastError: unknown = "";
		for(let i=0;i<this.config.length;i++){
			const {url, path, type} = this.config[i];

			try{
				let response: DocumentResponse;
				switch(type){
					case "gzip":
						response = await this.fetchGzipRouteAsync(url);
						break;
					case "json":
						response = await this.fetchJsonRouteAsync(url);
						break;
					default:
						console.error(`Invalid url config type ${type}`);
						continue;
				}
				if (response.doc){
					this.path = path;
					return response;
				}
				if (response.error){
					lastError = response.error;
				}else{
					lastError = "Unknown network error";
				}
			}catch(e){
				lastError = e;
			}

			console.error(lastError);
		}
		return {error: `${lastError}`};
	}

	async fetchGzipRouteAsync(url: string): Promise<DocumentResponse> {
		const {data} = await axios.get<Uint8Array>(url, {
			responseType: "arraybuffer", //This will make axios parse data as uint8array
			signal: this.controller.signal
		});

		const bundle = wasmBundleFromGzip(data);
		if(bundle){
			return {doc: bundle};
		}
		return {error: "Unable to parse gzip data"};
	}

	async fetchJsonRouteAsync(url: string): Promise<DocumentResponse> {
		const {data} = await axios.get(url, {
			signal: this.controller.signal
		});

		const bundle = wasmCleanBundleJson(data);
		return {doc: bundle};
	}

	release(): void {
		this.controller.abort();
	}

	getPath(): string {
		return this.path;
	}
}
