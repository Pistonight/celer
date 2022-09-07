import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { LoadingFrame } from "ui/frames";
import { Compiler } from "core/compiler";
import { DocumentContext, useAppSetting } from "core/context";
import { RouteEngine } from "core/engine";
import { useExpBetterBundler, useExpInferCoord, useExpWarnNegativeVar } from "core/experiments";
import { MapEngine } from "core/map";
import { 
	ensureConfig, 
	ensureMetadata, 
} from "data/bundler";
import {
	RouteMetadata,
	SourceObject, wasmEnsureRouteConfig, wasmEnsureRouteMetadata
} from "data/libs";
import { ServiceCreator } from "./services";

export type AppDocumentProviderProps = {
    serviceCreator: ServiceCreator,
    //still need this for local document...
    shouldSetBundle: boolean
}

const compiler = new Compiler();
const routeEngine = new RouteEngine();
const mapEngine = new MapEngine();

export const AppDocumentProvider: React.FC<AppDocumentProviderProps> = ({serviceCreator, shouldSetBundle, children}) => {
	const warnNegativeVar = useExpWarnNegativeVar();
	const enableInferCoord = useExpInferCoord();
	const enableBetterBundler = useExpBetterBundler();

	const { splitSetting } = useAppSetting();

	useEffect(()=>{
		routeEngine.warnNegativeNumberEnable = warnNegativeVar;
		routeEngine.inferCoord = enableInferCoord;
	}, [warnNegativeVar, enableInferCoord]);
    
	const params = useParams();
	const [status, setStatus] = useState<string|null>(null);
	const [error, setError] = useState<string|null>(null);
	const [routeSourceBundle, setRouteSourceBundle] = useState<SourceObject|null>(null);
	const [routeSourceBundleString, setRouteSourceBundleString] = useState<string|null>(null);

	useEffect(()=>{
		const service = serviceCreator(params);
		service.start((doc, error, status)=>{
			if(doc){
				if(doc._globalError){
					setError(doc._globalError);
					setStatus(null);
					setRouteSourceBundle(null);
				}else{
					setError(null);
					setStatus(null);
					setRouteSourceBundle(doc);
				}
			}else{
				setError(error);
				setStatus(status);
				setRouteSourceBundle(null);
			}
		});

		return ()=>{
			service.release();
		};

	}, [serviceCreator, params]);

	useEffect(()=>{
		// If better bundler is enabled, don't set bundle string
		// set shouldSetBundle = false when removing experiment
		if(!shouldSetBundle || routeSourceBundle === null || enableBetterBundler){
			setRouteSourceBundleString(null);
		}else{
			setRouteSourceBundleString(JSON.stringify(routeSourceBundle));
		}
	}, [routeSourceBundle, shouldSetBundle]);

	const {metadata, config, routeAssembly} = useMemo(()=>{
		if (routeSourceBundle === null){
			// This is likely when doc is still loading
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
		const metadata: RouteMetadata = enableBetterBundler ? wasmEnsureRouteMetadata(routeSourceBundle._project) : ensureMetadata(routeSourceBundle)[0];
		const config = enableBetterBundler ? wasmEnsureRouteConfig(routeSourceBundle._config) : ensureConfig(routeSourceBundle);
		const route = routeSourceBundle._route;

		const routeAssembly = compiler.compile(route);
		
		return {
			metadata,
			config,
			routeAssembly
		};
	}, [routeSourceBundle]);

	const {docLines, mapIcons, mapLines} = useMemo(()=>{
		routeEngine.setSplitSetting(splitSetting);
		const docLines = routeEngine.compute(routeAssembly);
		const [mapIcons, mapLines] = mapEngine.compute(docLines);

		return {
			docLines,
			mapIcons,
			mapLines
		};
	}, [routeAssembly, splitSetting]);

	useEffect(()=>{
		if(metadata.name){
			document.title = `${metadata.name} - Celer`;
		}else{
			document.title = "Celer";
		}
	}, [metadata]);

	if(error){
		return <LoadingFrame error>{error}</LoadingFrame>;
	}
	if(!routeSourceBundle){
		return <LoadingFrame>{status || "Loading Document"}</LoadingFrame>;
	}
	return (
		<DocumentContext.Provider value={{
			metadata,
			config,
			docLines,
			mapIcons,
			mapLines,
			bundle: routeSourceBundleString
		}}> 
			{children}
		</DocumentContext.Provider>
	);

};
