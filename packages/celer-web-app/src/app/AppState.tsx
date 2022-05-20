import React from "react";
import { BannerType, Compiler, RouteAssemblySection, SplitType, StringParser } from "core/compiler";
import { AppExperimentsContext, AppState as ContextState, AppStateContext } from "core/context";
import { RouteEngine } from "core/engine";
import { MapCore, MapEngine } from "core/map";
import { MapDisplayMode, MapDisplayModeStorage, SplitSettingStorage, Theme, ThemeStorage } from "core/settings";
import { SourceBundle, ensureMetadata, RouteMetadata, addRouteScriptDeprecationMessage, RouteConfig, ensureConfig } from "data/bundler";
import { LocalStorageWrapper } from "data/storage";
import { EmptyObject } from "data/util";

const DOC_LINE_POS_KEY="DocLinePos";

const ENABLE_SUBSPLITS_KEY="EnableSubsplits";

type AppState = ContextState & {
	routeAssembly: RouteAssemblySection[]
}

const initialState: AppState ={
	mapDisplayMode: MapDisplayModeStorage.load(),
	theme: ThemeStorage.load(),
	splitSetting: SplitSettingStorage.load(),
	enableSubsplits: LocalStorageWrapper.load(ENABLE_SUBSPLITS_KEY, false),
	mapCore: new MapCore(),
	docScrollToLine: LocalStorageWrapper.load(DOC_LINE_POS_KEY, 0),
	docCurrentLine: 0,
	mapCenterGameX: 0,
	mapCenterGameY: 0,
	mapZoom: 3,
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

const compiler = new Compiler();
const routeEngine = new RouteEngine();
const mapEngine = new MapEngine();

export class AppStateProvider extends React.Component<EmptyObject, AppState> {
	constructor(props: EmptyObject){
		super(props);
		this.state = initialState;
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
		this.state.mapCore.setIcons(mapIcons);
		this.state.mapCore.setLines(mapLines);
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
			mapCenterGameX: this.state.mapCenterGameX,
			mapCenterGameY: this.state.mapCenterGameY,
			mapZoom: this.state.mapZoom,
			metadata: this.state.metadata,
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
			setBundle:(bundle)=>this.setState({bundle})
		}}>
			{this.props.children}
			
		</AppStateContext.Provider>;
	}
}
AppStateProvider.contextType = AppExperimentsContext;
