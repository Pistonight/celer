import { Params } from "react-router-dom";
import { exampleRouteScriptPresets, exampleRouteScriptFunctions } from "data/docs";
import { SourceObject } from "data/libs";
import { Document, DocumentResponse } from "./types";
import { Consumer } from "data/util";

class DocumentInternal implements Document {
	private doc?: SourceObject;
	constructor(doc?: SourceObject) {
		this.doc = doc;
	}
	load(callback: Consumer<DocumentResponse>): void {
		if(this.doc){
			callback( {doc: this.doc});
		}else{
			callback({error: "The URL you entered is not a valid internal document"});
		}
	}
	release(): void {
		// no-op
	}
	addToRecentPages(): void {
		// Adding InternalDocument to recent pages not yet supported
	}
}

export const createDocumentInternal = ({ reference }: Params<string>) => {
	switch (reference) {
		case "presets":
			return new DocumentInternal(exampleRouteScriptPresets as unknown as SourceObject);
		case "functions":
			return new DocumentInternal(exampleRouteScriptFunctions as unknown as SourceObject);
	}
	return new DocumentInternal();

};
