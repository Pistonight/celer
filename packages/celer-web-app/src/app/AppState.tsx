import React from "react";
import { BannerType, Compiler, SplitType, StringParser } from "core/compiler";
import { AppExperimentsContext, AppState, AppStateContext } from "core/context";
import { DocLine, RouteEngine } from "core/engine";
import { MapCore, MapEngine } from "core/map";
import { MapDisplayMode, MapDisplayModeStorage, SplitSettingStorage, Theme, ThemeStorage } from "core/settings";
import { RouteScript, ensureMetadata, RouteMetadata, addRouteScriptDeprecationMessage } from "data/bundler";
import { LocalStorageWrapper } from "data/storage";
import { EmptyObject } from "data/util";

const DOC_LINE_POS_KEY="DocLinePos";

const initialState: AppState ={
	mapDisplayMode: MapDisplayModeStorage.load(),
	theme: ThemeStorage.load(),
	splitSetting: SplitSettingStorage.load(),
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
	}

	private setDocCurrentLine(docCurrentLine: number): void {
		LocalStorageWrapper.store(DOC_LINE_POS_KEY, docCurrentLine);
		this.setState({
			docCurrentLine
		});
	}

	private setRouteScript(routeScript: RouteScript) {
		const [metadata, metadataDeprecated] = ensureMetadata(routeScript);
		const routeScriptUnchecked = routeScript as any;
		const routeDeprecated = !routeScript._route && routeScriptUnchecked.Route;
		let route = routeScript._route || routeScriptUnchecked.Route;

		const useAppExperiment = this.context;
		const DisableCompilerVersionCheck = useAppExperiment("DisableCompilerVersionCheck");
		console.log(DisableCompilerVersionCheck);
		if (metadataDeprecated || routeDeprecated){
			route = addRouteScriptDeprecationMessage(route);
		}

		this.setDocLines(routeEngine.compute(compiler.compile(DisableCompilerVersionCheck, routeScript.compilerVersion, route)), metadata);
	}

	private setDocLines(docLines: DocLine[], metadata: RouteMetadata): void {
		const [mapIcons, mapLines] = mapEngine.compute(docLines);
		this.setState({
			metadata,
			docLines,
			mapIcons,
			mapLines
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
            
			docScrollToLine: this.state.docScrollToLine,
			docCurrentLine: this.state.docCurrentLine,
			mapCenterGameX: this.state.mapCenterGameX,
			mapCenterGameY: this.state.mapCenterGameY,
			mapZoom: this.state.mapZoom,
			metadata: this.state.metadata,
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
			setMapDisplayMode: this.setMapDisplayMode.bind(this),
			setTheme: this.setTheme.bind(this),
			setSplitSetting: this.setSplitSetting.bind(this),
			setDocScrollToLine: (docScrollToLine)=>this.setState({docScrollToLine}),
			setDocCurrentLine: this.setDocCurrentLine.bind(this),
			setRouteScript: this.setRouteScript.bind(this)
		}}>
			{this.props.children}
			
		</AppStateContext.Provider>;
	}
}
AppStateProvider.contextType = AppExperimentsContext;
