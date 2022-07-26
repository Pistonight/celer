import { Map } from "leaflet";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { BannerType, Compiler, Coord, RouteAssemblySection, SplitType, StringParser } from "core/compiler";
import { AppExperimentsContext, AppState as ContextState, AppStateContext } from "core/context";
import { RouteEngine } from "core/engine";
import { useExpNewASP, useExpWarnNegativeVar, useExpEnableDeprecatedRouteBundle, useExpBetterMap } from "core/experiments";
import { InGameCoordinates, MapCore, MapCoreLeaflet, MapEngine, MapIcon, MapLine } from "core/map";
import { MapDisplayMode, MapDisplayModeStorage, SplitSettingStorage, Theme, ThemeStorage } from "core/settings";
import { SourceBundle, ensureMetadata, RouteMetadata, addRouteScriptDeprecationMessage, RouteConfig, ensureConfig } from "data/bundler";
import { LocalStorageWrapper } from "data/storage";
import { EmptyObject } from "data/util";

const DOC_LINE_POS_KEY="DocLinePos";

const ENABLE_SUBSPLITS_KEY="EnableSubsplits";

type InternalState = {
	routeAssembly: RouteAssemblySection[],
}

type AppState = ContextState & InternalState;

const compiler = new Compiler();
const routeEngine = new RouteEngine();
const mapEngine = new MapEngine();

// Wrapper for L.Map which is deprecated
const deprecatedMapCore = new MapCoreLeaflet();

export const AppStateProvider: React.FC = ({children})=>{
	if(useExpNewASP()){
		return <AppStateProviderFC>{children}</AppStateProviderFC>;
	}
	return <AppStateProviderOld>{children}</AppStateProviderOld>;
};

// empty impl for pigeon map
class DummyMapCore implements MapCore {
	setMap(_map: Map): void {
		// do nothing
	}
	setIcons(_icons: MapIcon[]): void {
		// do nothing
	}
	setLines(_lines: MapLine[]): void {
		// do nothing
	}
	centerMap(_coord: Coord): void {
		// do nothing
	}
	invalidateSize(): void {
		// do nothing
	}
	
}
const dummyMapCore = new DummyMapCore();

export const AppStateProviderFC: React.FC = ({children})=>{
	routeEngine.warnNegativeNumberEnable = useExpWarnNegativeVar();
	const enableDeprecated = useExpEnableDeprecatedRouteBundle();
	const enablePigeonMap = useExpBetterMap();
	// set up AppState
	const [mapDisplayMode, setMapDisplayMode] = useState(
		()=>MapDisplayModeStorage.load()
	);
	// TODO update settings structure and only save on page close
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

	const [routeSourceBundle, setRouteSourceBundle] = useState<SourceBundle|null>(null);
	const {metadata, config, routeAssembly} = useMemo(()=>{
		if (routeSourceBundle === null){
			document.title = "Celer";
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
		if(!enablePigeonMap){
			deprecatedMapCore.setIcons(mapIcons);
			deprecatedMapCore.setLines(mapLines);
		}
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

	return (
		<AppStateContext.Provider value={{
			mapDisplayMode,
			mapCore: enablePigeonMap ? dummyMapCore : deprecatedMapCore,
			theme,
			splitSetting,
			enableSubsplits,
			docScrollToLine,
			docCurrentLine,
			mapCenter,
			metadata,
			config,
			docLines: redirectMessage ? [
				{
					lineType: "DocLineBanner" as const,
					bannerType: BannerType.Error,
					text: StringParser.parseStringBlockSimple(redirectMessage),
					showTriangle: false
				},
				...docLines
			]:docLines,
			mapIcons,
			mapLines,
			bundle,
			setMapDisplayMode,
			setTheme,
			setSplitSetting: setSplitSettingWithTypes,
			setEnableSubsplits,
			setDocScrollToLine,
			setDocCurrentLine,
			setRouteScript: setRouteSourceBundle,
			setBundle,
			setMapCenter
		}}>
			{children}
			
		</AppStateContext.Provider>
	);
};

export class AppStateProviderOld extends React.Component<EmptyObject, AppState> {
	constructor(props: EmptyObject){
		super(props);
		this.state = {
			mapDisplayMode: MapDisplayModeStorage.load(),
			theme: ThemeStorage.load(),
			splitSetting: SplitSettingStorage.load(),
			enableSubsplits: LocalStorageWrapper.load(ENABLE_SUBSPLITS_KEY, false),
			mapCore: deprecatedMapCore,
			docScrollToLine: LocalStorageWrapper.load(DOC_LINE_POS_KEY, 0),
			docCurrentLine: 0,
			mapCenter: undefined,
			metadata: {
				name: "",
				authors: [],
				url: "",
				version: "Unknown",
				description: ""
			},
			config: {},
			bundle: null,
			routeAssembly: [],
			docLines: [],
			mapIcons: [],
			mapLines: []
		};
	}

	private setMapDisplayMode(mode: MapDisplayMode) {
		MapDisplayModeStorage.save(mode);
		this.setState({
			mapDisplayMode: mode
		});
	}

	private setTheme(theme: Theme) {
		ThemeStorage.save(theme);
		this.setState({
			theme
		});
	}

	private setSplitSetting(value: boolean, ...splitType: SplitType[]){
		const newSetting = {
			...this.state.splitSetting,
		};
		splitType.forEach(t=>newSetting[t]=value);
		SplitSettingStorage.save(newSetting);
		this.setState({
			splitSetting: newSetting
		});
		routeEngine.setSplitSetting(newSetting);
		this.setRouteAssembly(this.state.routeAssembly, this.state.metadata, this.state.config);
	}

	private setEnableSubsplits(enableSubsplits: boolean) {
		LocalStorageWrapper.store(ENABLE_SUBSPLITS_KEY, enableSubsplits);
		this.setState({
			enableSubsplits
		});
	}

	private setDocCurrentLine(docCurrentLine: number): void {
		LocalStorageWrapper.store(DOC_LINE_POS_KEY, docCurrentLine);
		this.setState({
			docCurrentLine
		});
	}

	private setRouteScript(sourceBundle: SourceBundle) {
		const [metadata, metadataDeprecated] = ensureMetadata(sourceBundle);
		const config = ensureConfig(sourceBundle);
		const routeScriptUnchecked = sourceBundle as any; // eslint-disable-line @typescript-eslint/no-explicit-any
		const routeDeprecated = !sourceBundle._route && routeScriptUnchecked.Route;
		let route = sourceBundle._route || routeScriptUnchecked.Route;

		if (metadataDeprecated || routeDeprecated){
			route = addRouteScriptDeprecationMessage(route);
		}
		this.setRouteAssembly(compiler.compile(route), metadata, config);
	}

	private setRouteAssembly(routeAssembly: RouteAssemblySection[], metadata: RouteMetadata, config: RouteConfig): void {
		routeEngine.warnNegativeNumberEnable = this.context("WarnNegativeVar");
		const docLines = routeEngine.compute(routeAssembly);

		const [mapIcons, mapLines] = mapEngine.compute(docLines);
		this.setState({
			routeAssembly,
			metadata,
			docLines,
			mapIcons,
			mapLines,
			config
		});
		if(metadata.name){
			document.title = `${metadata.name} - Celer`;
		}
		const PigeonMapEnabled = this.context("BetterMap");
		if(!PigeonMapEnabled){
			this.state.mapCore.setIcons(mapIcons);
			this.state.mapCore.setLines(mapLines);
		}
	}

	private setMapCenter(igc: InGameCoordinates) {
		this.setState({mapCenter: igc});
	}

	public render(): JSX.Element {
		// Fetch redirect message 
		const redirectMessage = sessionStorage.getItem("Celer.RedirectMessage");

		return <AppStateContext.Provider value={{
			mapDisplayMode: this.state.mapDisplayMode,
			mapCore: this.state.mapCore,
			theme: this.state.theme,
			splitSetting: this.state.splitSetting,
			enableSubsplits: this.state.enableSubsplits,
			docScrollToLine: this.state.docScrollToLine,
			docCurrentLine: this.state.docCurrentLine,
			metadata: this.state.metadata,
			mapCenter: this.state.mapCenter,
			config: this.state.config,
			docLines: redirectMessage ? [
				{
					lineType: "DocLineBanner" as const,
					bannerType: BannerType.Error,
					text: StringParser.parseStringBlockSimple(redirectMessage),
					showTriangle: false
				},
				...this.state.docLines
			]:this.state.docLines,
			mapIcons: this.state.mapIcons,
			mapLines: this.state.mapLines,
			bundle: this.state.bundle,
			setMapDisplayMode: this.setMapDisplayMode.bind(this),
			setTheme: this.setTheme.bind(this),
			setSplitSetting: this.setSplitSetting.bind(this),
			setEnableSubsplits: this.setEnableSubsplits.bind(this),
			setDocScrollToLine: (docScrollToLine)=>this.setState({docScrollToLine}),
			setDocCurrentLine: this.setDocCurrentLine.bind(this),
			setRouteScript: this.setRouteScript.bind(this),
			setBundle:(bundle)=>this.setState({bundle}),
			setMapCenter: this.setMapCenter.bind(this)
		}}>
			{this.props.children}
			
		</AppStateContext.Provider>;
	}
}
AppStateProviderOld.contextType = AppExperimentsContext;
