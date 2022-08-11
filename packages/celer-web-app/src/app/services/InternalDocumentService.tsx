import { useCallback } from "react";
import { Params, useParams } from "react-router-dom";
import { useAppState, ServiceContext } from "core/context";
import { SourceBundle } from "data/bundler";
import { exampleRouteScriptPresets, exampleRouteScriptFunctions } from "data/docs";
import { EmptyObject } from "data/util";
import { DocumentService } from "./type";

export const InternalDocumentServiceOld: React.FC<EmptyObject> = ({children}) => {
	const { setBundle, setRouteScript } = useAppState();
	const {reference} = useParams();
	const serviceFunction = useCallback(()=>{
		setBundle(null);
		switch(reference){
			case "presets":
				setRouteScript(exampleRouteScriptPresets as unknown as SourceBundle);
				break;
			case "functions":
				setRouteScript(exampleRouteScriptFunctions as unknown as SourceBundle);
				break;
		}
	}, [reference]);
	return (
		<ServiceContext.Provider value={serviceFunction}>
			{children}
		</ServiceContext.Provider>
	);
};

class InternalDocumentService implements DocumentService {
	private doc?: SourceBundle;
	constructor(doc?: SourceBundle){
		this.doc = doc;
	}
	start(callback: (doc: SourceBundle | null, error: string | null, status: string | null) => void): void {
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
			return new InternalDocumentService(exampleRouteScriptPresets as unknown as SourceBundle);
		case "functions":
			return new InternalDocumentService(exampleRouteScriptFunctions as unknown as SourceBundle);
	}
	return new InternalDocumentService();
	
};
