import React, { useEffect, useMemo, useState } from "react";
import { BannerType, Compiler, StringParser } from "core/compiler";
import { AppStateContext, useDocument } from "core/context";
import { RouteEngine } from "core/engine";
import { useExpWarnNegativeVar, useExpInferCoord, useExpNewDP } from "core/experiments";
import { InGameCoordinates, MapEngine } from "core/map";
import { ensureMetadata, ensureConfig } from "data/bundler";
import { SourceObject } from "data/libs";
import { LocalStorageWrapper } from "data/storage";

const DOC_LINE_POS_KEY="DocLinePos";

//const ENABLE_SUBSPLITS_KEY="EnableSubsplits";

//const compiler = new Compiler();
//const routeEngine = new RouteEngine();
//const mapEngine = new MapEngine();

export const AppStateProvider: React.FC = ({children})=>{
	// const warnNegativeVar = useExpWarnNegativeVar();
	// const enableInferCoord = useExpInferCoord();
	// //const enableDocumentProvider = true;

	// useEffect(()=>{
	// 	routeEngine.warnNegativeNumberEnable = warnNegativeVar;
	// 	routeEngine.inferCoord = enableInferCoord;
	// }, [warnNegativeVar, enableInferCoord]);

	// set up state
	const [docCurrentLine, setDocCurrentLine] = useState(
		0
	);
	useEffect(()=>{
		LocalStorageWrapper.store(DOC_LINE_POS_KEY, docCurrentLine);
	}, [docCurrentLine]);
	const [docScrollToLine, setDocScrollToLine] = useState(()=>LocalStorageWrapper.load(DOC_LINE_POS_KEY, 0));

	//const [routeSourceBundle, setRouteSourceBundle] = useState<SourceObject|null>(null);
	// const {metadata, config, routeAssembly} = useMemo(()=>{
	// 	// Return dummy data if NewDP is on
	// 	if (routeSourceBundle === null || enableDocumentProvider){
	// 		if(routeSourceBundle === null){
	// 			document.title = "Celer";
	// 		}
	// 		return {
	// 			metadata: {
	// 				name: "",
	// 				authors: [],
	// 				url: "",
	// 				version: "Unknown",
	// 				description: ""
	// 			},
	// 			config: {},
	// 			routeAssembly: []
	// 		};
	// 	}
	// 	const [metadata] = ensureMetadata(routeSourceBundle);
	// 	const config = ensureConfig(routeSourceBundle);
	// 	let route = routeSourceBundle._route;

	// 	const routeAssembly = compiler.compile(route);
	// 	if(metadata.name){
	// 		document.title = `${metadata.name} - Celer`;
	// 	}
	// 	return {
	// 		metadata,
	// 		config,
	// 		routeAssembly
	// 	};
	// }, [routeSourceBundle]);

	// const {docLines, mapIcons, mapLines} = useMemo(()=>{
	// 	const docLines = routeEngine.compute(routeAssembly);
	// 	const [mapIcons, mapLines] = mapEngine.compute(docLines);

	// 	return {
	// 		docLines,
	// 		mapIcons,
	// 		mapLines
	// 	};
	// }, [routeAssembly]);

	// Temporary until devtools can emit bundle.json locally
	//const [bundle, setBundle] = useState<string|null>(null);

	const [mapCenter, setMapCenter] = useState<InGameCoordinates | undefined>(undefined);

	//const newDPDocument = useDocument();

	return (
		<AppStateContext.Provider value={{
			docScrollToLine,
			docCurrentLine,
			mapCenter,
			// metadata:newDPDocument.metadata,
			// config:newDPDocument.config,
			// docLines:newDPDocument.docLines,
			// mapIcons:newDPDocument.mapIcons,
			// mapLines:newDPDocument.mapLines,
			// bundle:newDPDocument.bundle,
			//setMapDisplayMode,
			//setTheme,
			//setSplitSetting: setSplitSettingWithTypes,
			//setEnableSubsplits,
			setDocScrollToLine,
			setDocCurrentLine,
			//setRouteScript: setRouteSourceBundle,
			//setBundle,
			setMapCenter,
		}}>
			{children}
			
		</AppStateContext.Provider>
	);
};
