import { Params } from "react-router-dom";
import { exampleRouteScriptPresets, exampleRouteScriptFunctions } from "data/docs";
import { SourceObject } from "data/libs";
import { Consumer } from "data/util";
import { Document, DocumentResponse } from "./types";

class DocumentInternal implements Document {
	private doc?: SourceObject;
	private reference: string;
	constructor(reference: string, doc?: SourceObject) {
		this.doc = doc;
		this.reference = reference;
	}
	async load(): Promise<DocumentResponse> {
		if(this.doc){
			return {doc: this.doc};
		}else{
			return {error: "The URL you entered is not a valid internal document"};
		}
	}
	release(): void {
		// no-op
	}

	getPath(): string {
		return "docs/" + this.reference; // Remove with useExpUseNewRecentPath
	}
}

export const createDocumentInternal = ({ reference }: Params<string>) => {
	switch (reference) {
		case "presets":
			return new DocumentInternal(reference, exampleRouteScriptPresets as unknown as SourceObject);
		case "functions":
			return new DocumentInternal(reference, exampleRouteScriptFunctions as unknown as SourceObject);
	}
	return new DocumentInternal(reference ?? "");

};
