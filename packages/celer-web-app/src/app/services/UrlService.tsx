import axios from "axios";
import { SourceBundle } from "data/bundler";
import { DocumentService } from "./type";

export class UrlService implements DocumentService {
	private url: string;
	private controller: AbortController = new AbortController();

	constructor(url: string){
		this.url = url;
	}

	start(callback: (doc: SourceBundle | null, error: string | null, status: string | null) => void): void {
		axios.get(this.url, {signal: this.controller.signal}).then(response=>{
			//console.log(response.data);
			callback(response.data, null, null);
		},(rejectReason)=>{
			if(typeof rejectReason === "string"){
				callback(null, rejectReason, null);
			}else if(rejectReason && rejectReason.message){
				callback(null, rejectReason.message, null);
			}else{
				callback(null, "Unknown Error", null);
			}
		});
	}
	release(): void {
		this.controller.abort();
	}
    
}
