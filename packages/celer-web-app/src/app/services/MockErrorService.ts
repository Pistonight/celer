import { SourceBundle } from "data/bundler";
import { DocumentService } from "./type";

export class MockErrorService implements DocumentService {
	private controller?: AbortController;
	start(callback: (doc: SourceBundle | null, error: string | null, status: string | null) => void): void {
		this.controller = new AbortController();
		this.controller?.signal.addEventListener("abort", ()=>{
			console.log("did abort"); // eslint-disable-line no-console
		});

		const func = (i: number)=>{
			console.log(i); // eslint-disable-line no-console
			callback(null, null, "Mock loading "+i);
			if(!this.controller?.signal.aborted){
				if(i<10){
					setTimeout(()=>func(i+1), 1000);
				}else{
					callback(null, "Mock error finished loading", null);
				}
			}
		};
		setTimeout(()=>func(0), 1000);

	}
	release(): void {
		this.controller?.abort();
	}
    
}
