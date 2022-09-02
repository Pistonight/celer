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

const compiler = new Compiler();
const routeEngine = new RouteEngine();
const mapEngine = new MapEngine();

export const AppStateProvider: React.FC = ({children})=>{
	const warnNegativeVar = useExpWarnNegativeVar();
	const enableInferCoord = useExpInferCoord();
	const enableDocumentProvider = useExpNewDP();

	useEffect(()=>{
		routeEngine.warnNegativeNumberEnable = warnNegativeVar;
		routeEngine.inferCoord = enableInferCoord;
	}, [warnNegativeVar, enableInferCoord]);

	// set up state
	const [docCurrentLine, setDocCurrentLine] = useState(
		0
	);
	useEffect(()=>{
		LocalStorageWrapper.store(DOC_LINE_POS_KEY, docCurrentLine);
	}, [docCurrentLine]);
	const [docScrollToLine, setDocScrollToLine] = useState(()=>LocalStorageWrapper.load(DOC_LINE_POS_KEY, 0));

	const [routeSourceBundle, setRouteSourceBundle] = useState<SourceObject|null>(null);
	const {metadata, config, routeAssembly} = useMemo(()=>{
		// Return dummy data if NewDP is on
		if (routeSourceBundle === null || enableDocumentProvider){
			if(routeSourceBundle === null){
				document.title = "Celer";
			}
			return {
				metadata: {
					name: "",
					authors: [],
					url: "",
					version: "Unknown",
					description: ""
				},
				config: {},
				routeAssembly: []
			};
		}
		const [metadata] = ensureMetadata(routeSourceBundle);
		const config = ensureConfig(routeSourceBundle);
		let route = routeSourceBundle._route;

		const routeAssembly = compiler.compile(route);
		if(metadata.name){
			document.title = `${metadata.name} - Celer`;
		}
		return {
			metadata,
			config,
			routeAssembly
		};
	}, [routeSourceBundle]);

	const {docLines, mapIcons, mapLines} = useMemo(()=>{
		const docLines = routeEngine.compute(routeAssembly);
		const [mapIcons, mapLines] = mapEngine.compute(docLines);

		return {
			docLines,
			mapIcons,
			mapLines
		};
	}, [routeAssembly]);

	// Temporary until devtools can emit bundle.json locally
	const [bundle, setBundle] = useState<string|null>(null);

	const redirectMessage = sessionStorage.getItem("Celer.RedirectMessage");

	const [mapCenter, setMapCenter] = useState<InGameCoordinates | undefined>(undefined);

	const newDPDocument = useDocument();

	return (
		<AppStateContext.Provider value={{
			docScrollToLine,
			docCurrentLine,
			mapCenter,
			metadata:enableDocumentProvider?newDPDocument.metadata:metadata,
			config:enableDocumentProvider?newDPDocument.config:config,
			docLines:enableDocumentProvider?newDPDocument.docLines:redirectMessage ? [
				{
					lineType: "DocLineBanner" as const,
					bannerType: BannerType.Error,
					text: StringParser.parseStringBlockSimple(redirectMessage),
					showTriangle: false
				},
				...docLines
			]:docLines,
			mapIcons:enableDocumentProvider?newDPDocument.mapIcons:mapIcons,
			mapLines:enableDocumentProvider?newDPDocument.mapLines:mapLines,
			bundle:enableDocumentProvider?newDPDocument.bundle:bundle,
			setDocScrollToLine,
			setDocCurrentLine,
			setRouteScript: setRouteSourceBundle,
			setBundle,
			setMapCenter,
		}}>
			{children}
			
		</AppStateContext.Provider>
	);
};
