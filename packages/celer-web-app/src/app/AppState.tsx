import React, { useCallback, useEffect, useMemo, useState } from "react";
import { BannerType, Compiler, SplitType, StringParser } from "core/compiler";
import { AppStateContext, useDocument } from "core/context";
import { RouteEngine } from "core/engine";
import { useExpWarnNegativeVar, useExpEnableDeprecatedRouteBundle, useExpInferCoord, useExpNewDP } from "core/experiments";
import { InGameCoordinates, MapEngine } from "core/map";
import { MapDisplayModeStorage, SplitSettingStorage, ThemeStorage } from "core/settings";
import { ensureMetadata, addRouteScriptDeprecationMessage, ensureConfig } from "data/bundler";
import { SourceObject } from "data/libs";
import { LocalStorageWrapper } from "data/storage";

const DOC_LINE_POS_KEY="DocLinePos";

const ENABLE_SUBSPLITS_KEY="EnableSubsplits";

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
	const enableDeprecated = useExpEnableDeprecatedRouteBundle();
	// set up AppState
	const [mapDisplayMode, setMapDisplayMode] = useState(
		()=>MapDisplayModeStorage.load()
	);
	// TODO update settings structure
	useEffect(()=>{
		MapDisplayModeStorage.save(mapDisplayMode);
	}, [mapDisplayMode]);
	const [theme, setTheme] = useState(
		()=>ThemeStorage.load()
	);
	useEffect(()=>{
		ThemeStorage.save(theme);
	}, [theme]);
	const [splitSetting, setSplitSetting] = useState(()=>SplitSettingStorage.load());
	useEffect(()=>{
		SplitSettingStorage.save(splitSetting);
		routeEngine.setSplitSetting(splitSetting);

	}, [splitSetting]);
	const setSplitSettingWithTypes = useCallback((value: boolean, ...splitType: SplitType[])=>{
		const newSetting = {
			...splitSetting,
		};
		splitType.forEach(t=>newSetting[t]=value);
		setSplitSetting(newSetting);
	}, [splitSetting]);
	const [enableSubsplits, setEnableSubsplits] = useState(
		()=>LocalStorageWrapper.load(ENABLE_SUBSPLITS_KEY, false)
	);
	useEffect(()=>{
		LocalStorageWrapper.store(ENABLE_SUBSPLITS_KEY, enableSubsplits);
	}, [enableSubsplits]);
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
		const [metadata, metadataDeprecated] = ensureMetadata(routeSourceBundle);
		const config = ensureConfig(routeSourceBundle);
		let route = routeSourceBundle._route;
		if(enableDeprecated){
			const routeScriptUnchecked = routeSourceBundle as any; // eslint-disable-line @typescript-eslint/no-explicit-any
			const routeDeprecated = !routeSourceBundle._route && routeScriptUnchecked.Route;
			route = route ?? routeScriptUnchecked.Route;
	
			if (metadataDeprecated || routeDeprecated){
				route = addRouteScriptDeprecationMessage(route);
			}
		}
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
			mapDisplayMode,
			theme,
			splitSetting,
			enableSubsplits,
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
			setMapDisplayMode,
			setTheme,
			setSplitSetting: setSplitSettingWithTypes,
			setEnableSubsplits,
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
