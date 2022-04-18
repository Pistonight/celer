export {};
// // The EngineService component retrieves route data and send it to the children via context
// import React, { useContext } from "react";

// import { getRouteScriptAsync, getServiceConfig } from "app/services";
// import { BannerType, Compiler, StringType, TypedStringSingle } from "core/compiler";
// import { RouteEngine, DocLine } from "core/engine";
// import { MapCore, MapEngine, MapIcon, MapLine } from "core/map";
// import { RouteScript } from "data/bundler";
// import { exampleRouteScriptPresets, exampleRouteScript } from "data/docs";
// import { emptyObject } from "data/util";

// interface EngineContextState {
//     metadata: RouteScript["Project"];
//     docLines: DocLine[];
//     mapIcons: MapIcon[];
//     mapLines: MapLine[];
// }

// const EngineContext = React.createContext<EngineContextState>(emptyObject());

// interface EngineServiceProps {
//     mapCore: MapCore,
//     onRouteReload: ()=>void
// }

// interface EngineServiceState extends EngineContextState{
//     isReady: boolean,
//     reloadHandle?: NodeJS.Timer,
// }

// const compiler = new Compiler();
// const routeEngine = new RouteEngine();
// const mapEngine = new MapEngine();
// const placeholderLines = [{
// 	lineType: "DocLineBanner",
// 	bannerType: BannerType.Notes,
// 	text: new TypedStringSingle({
// 		content: "Loading Route...",
// 		type: StringType.Normal
// 	}),
// 	showTriangle: false
// } as const];
// const placeholderMetadata = {
// 	Name: "",
// 	Authors: [],
// 	Url: "",
// 	Version: "Unknown",
// 	Description: ""
// };

// export class EngineService extends React.Component<EngineServiceProps, EngineServiceState> {
// 	constructor(props: EngineServiceProps){
// 		super(props);
// 		this.state = {
// 			metadata: placeholderMetadata,
// 			isReady: false,
// 			docLines: [],
// 			mapIcons: [],
// 			mapLines: []
// 		};
// 	}

// 	public componentDidMount(): void {
// 		this.loadRoute();
// 	}

// 	private loadRoute(): void {
// 		if(this.state.reloadHandle){
// 			clearInterval(this.state.reloadHandle);
// 		}
// 		const config = getServiceConfig();
// 		// console.log(config);
// 		if(config.error){
// 			const errorLines: DocLine[] = [{
// 				lineType: "DocLineBanner",
// 				bannerType: BannerType.Error,
// 				text: new TypedStringSingle({
// 					content: config.error,
// 					type: StringType.Normal
// 				}),
// 				showTriangle: false
// 			}];
// 			this.setState({
// 				isReady: true,
// 				docLines: errorLines
// 			});
// 			return;
// 		}
// 		if(config.scriptUrl){
// 			this.loadRouteScriptAsync(config.scriptUrl);
// 			return;
// 		}
// 		if(config.devConfig){
// 			// load from local dev server
// 			const url = "http://localhost:"+config.devConfig.devPort;
// 			this.loadRouteScriptAsync(url);
// 			const handle = setInterval(()=>{
// 				this.props.onRouteReload();
// 				this.loadRouteScriptAsync(url);
// 			}, config.devConfig.refreshInterval);
// 			this.setState({
// 				reloadHandle: handle
// 			});
// 			return;
// 		}

// 		// Internal
// 		switch(config.id){
// 			case "RouteScript": {
// 				const routeScript = exampleRouteScript as unknown as RouteScript;
// 				this.setRouteScript(routeScript);
// 				return;
// 			}
                
// 			case "Presets":
// 				this.setRouteScript(exampleRouteScriptPresets as unknown as RouteScript);
// 				return;
// 		}

// 		// Error
// 		const errorLines: DocLine[] = [{
// 			lineType: "DocLineBanner",
// 			bannerType: BannerType.Error,
// 			text: new TypedStringSingle({
// 				content: "Invalid Internal Page: "+config.id,
// 				type: StringType.Normal
// 			}),
// 			showTriangle: false
// 		}];
// 		this.setState({
// 			isReady: true,
// 			docLines: errorLines
// 		});
// 		return;
// 	}

// 	private async loadRouteScriptAsync(url: string): Promise<void> {
// 		const routeScript = await getRouteScriptAsync(url);
// 		this.setRouteScript(routeScript);
// 	}

// 	private setRouteScript(routeScript: RouteScript) {
// 		const metadata = routeScript.Project;
// 		this.setDocLines(routeEngine.compute(compiler.compile(routeScript.compilerVersion, routeScript.Route)), metadata);
// 	}

// 	private setDocLines(docLines: DocLine[], metadata: EngineContextState["metadata"]): void {
// 		const [mapIcons, mapLines] = mapEngine.compute(docLines);
// 		this.setState({
// 			isReady: true,
// 			metadata,
// 			docLines,
// 			mapIcons,
// 			mapLines
// 		});
// 		if(metadata.Name){
// 			document.title = `${metadata.Name} - Celer`;
// 		}
// 		this.props.mapCore.setIcons(mapIcons);
// 		this.props.mapCore.setLines(mapLines);
// 	}

// 	public render(): JSX.Element {

// 		const ready = this.state.isReady;
// 		return <EngineContext.Provider value={{
// 			metadata: ready ? this.state.metadata : placeholderMetadata,
// 			docLines: ready ? this.state.docLines : placeholderLines,
// 			mapIcons: ready ? this.state.mapIcons : [],
// 			mapLines: ready ? this.state.mapLines : []
// 		}}>
            
// 			{this.props.children}

// 		</EngineContext.Provider>;
// 	}
// }

// export const useEngineService = ()=>useContext(EngineContext);
