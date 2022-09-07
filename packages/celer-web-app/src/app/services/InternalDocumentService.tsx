import { Params } from "react-router-dom";
import { exampleRouteScriptPresets, exampleRouteScriptFunctions } from "data/docs";
import { SourceObject } from "data/libs";
import { DocumentService } from "./types";

class InternalDocumentService implements DocumentService {
	private doc?: SourceObject;
	constructor(doc?: SourceObject){
		this.doc = doc;
	}
	start(callback: (doc: SourceObject | null, error: string | null, status: string | null) => void): void {
		if(this.doc){
			callback(this.doc, null, null);
		}else{
			callback(null, "The URL you entered is not a valid internal document", null);
		}
		
	}
	release(): void {
		//no-op
	}
}

export const createInternalDocumentService = ({reference}: Params<string>)=>{
	switch(reference){
		case "presets":
			return new InternalDocumentService(exampleRouteScriptPresets as unknown as SourceObject);
		case "functions":
			return new InternalDocumentService(exampleRouteScriptFunctions as unknown as SourceObject);
	}
	return new InternalDocumentService();
	
};
