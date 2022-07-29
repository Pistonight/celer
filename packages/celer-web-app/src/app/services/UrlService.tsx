import queryString from "query-string";
import { useCallback } from "react";
import { useLocation } from "react-router-dom";
import { ServiceContext } from "core/context";
import { EmptyObject } from "data/util";
import { useLoadRouteAsync } from "./service";
import { DocumentService } from "./type";
import { SourceBundle } from "data/bundler";
import axios from "axios";

// export const UrlService: React.FC<EmptyObject> = ({children}) => {

// 	const {search} = useLocation();
// 	const query = queryString.parse(search);
// 	const url = `${query[""]}`;
// 	const serviceFunction = useLoadRouteAsync(url);
// 	const alertWrapper = useCallback(()=>{
// 		if(confirm(`Allow access to ${url}?`)){
// 			serviceFunction();
// 		}
// 	}, [serviceFunction,url]);
// 	return (
// 		<ServiceContext.Provider value={alertWrapper}>
// 			{children}
// 		</ServiceContext.Provider>
// 	);
// };

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
			console.log(rejectReason);
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
