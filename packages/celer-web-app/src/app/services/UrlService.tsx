import axios from "axios";
import { SourceObject } from "data/libs";
import { addPageToRecents } from "data/storage";
import { DocumentService } from "./types";

export class UrlService implements DocumentService {
	private config: UrlServiceConfig[];
	private controller: AbortController = new AbortController();
	private enableBinary: boolean;

	constructor(url: string) {
		this.url = url;
	}

	start(callback: (doc: SourceObject | null, error: string | null, status: string | null) => void): void {
		axios.get(this.url, { signal: this.controller.signal }).then(response => {
			callback(response.data, null, null);
		}, (rejectReason) => {
			if (typeof rejectReason === "string") {
				callback(null, rejectReason, null);
			} else if (rejectReason && rejectReason.message) {
				callback(null, rejectReason.message, null);
			} else {
				callback(null, "Unknown Error", null);
			}
		});
		
		
	}

	async fetchRouteAsync(): Promise<ServiceResponse> {
		let lastError: any = "";
		for(let i=0;i<this.config.length;i++){
			const {url, type} = this.config[i];
			try{
				let response: ServiceResponse;
				switch(type){
					case "bin":
						response = await this.fetchBinaryRouteAsync(url);
						break;
					case "json":
						response = await this.fetchJsonRouteAsync(url);
						break;
					default:
						console.error(`Invalid url config type ${type}`);
						continue;
				}
				if (response.doc){
					console.log(`Loaded route from ${url}`);
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
			console.warn(`Fail to fetch route from ${url}, trying next option`);
		}
		return {error: lastError};
	}

	async fetchBinaryRouteAsync(url: string): Promise<ServiceResponse> {
		const {data} = await axios.get<Uint8Array>(url, {
			responseType: 'arraybuffer', //This will make axios parse data as uint8array
			signal: this.controller.signal
		});
		
		const bundle = wasmBundleFromBytes(data);
		if(bundle){
			return {doc: bundle};
		}
		return {error: "Unable to parse binary data"};
	}

	async fetchJsonRouteAsync(url: string): Promise<ServiceResponse> {
		const {data} = await axios.get(url, {
			signal: this.controller.signal
		});
		
		const bundle = wasmCleanBundleJson(data);
		return {doc: bundle};
	}

	release(): void {
		this.controller.abort();
	}
	addToRecentPages(): void {
		// If this is a github service, shorten the URL and add it to recent pages
		if (this.url.startsWith("https://raw.githubusercontent.com")) {
			let relativeURL = this.url;
			relativeURL = relativeURL.replace("https://raw.githubusercontent.com", "gh");
			relativeURL = relativeURL.replace("/bundle.json", "");
			addPageToRecents(relativeURL);
		}
		// Other URL types not yet supported
	}
}
