import { Params } from "react-router-dom";
import { exampleRouteScriptPresets, exampleRouteScriptFunctions } from "data/docs";
import { SourceObject } from "data/libs";
import { DocumentService, ServiceResponse } from "./types";
import { Consumer } from "data/util";

class InternalDocumentService implements DocumentService {
	private doc?: SourceObject;
	constructor(doc?: SourceObject) {
		this.doc = doc;
	}
	start(callback: Consumer<ServiceResponse>): void {
		if(this.doc){
			callback( {doc: this.doc});
		}else{
			callback({error: "The URL you entered is not a valid internal document"});
		}
	}
	release(): void {
		//no-op
	}
	addToRecentPages(): void {
		// Adding InternalDocument to recent pages not yet supported
	}
}

export const createInternalDocumentService = ({ reference }: Params<string>) => {
	switch (reference) {
		case "presets":
			return new InternalDocumentService(exampleRouteScriptPresets as unknown as SourceObject);
		case "functions":
			return new InternalDocumentService(exampleRouteScriptFunctions as unknown as SourceObject);
	}
	return new InternalDocumentService();

};
