import { Compiler } from "core/compiler"
import { DocumentContext } from "core/context/DocumentContext"
import { RouteEngine } from "core/engine"
import { useExpBetterMap, useExpEnableDeprecatedRouteBundle, useExpNewDP } from "core/experiments"
import { MapEngine } from "core/map"
import { addRouteScriptDeprecationMessage, ensureConfig, ensureMetadata, SourceBundle } from "data/bundler"
import { setegid } from "process"
import { useEffect, useMemo, useState } from "react"
import { useParams } from "react-router-dom"
import { LoadingFrame } from "ui/frames/LoadingFrame"
import { DocumentService, ServiceCreator } from "./services"

export type AppDocumentProviderProps = {
    serviceCreator: ServiceCreator,
    //temporary until devtool bundler is shipped
    shouldSetBundle: boolean
}

const compiler = new Compiler();
const routeEngine = new RouteEngine();
const mapEngine = new MapEngine();

export const AppDocumentProvider: React.FC<AppDocumentProviderProps> = ({serviceCreator, shouldSetBundle, children}) => {
    const enableDocumentProvider = useExpNewDP();
    const enableDeprecated = useExpEnableDeprecatedRouteBundle();
    
    const params = useParams();
    const [status, setStatus] = useState<string|null>(null);
    const [error, setError] = useState<string|null>(null);
    const [routeSourceBundle, setRouteSourceBundle] = useState<SourceBundle|null>(null);
    const [routeSourceBundleString, setRouteSourceBundleString] = useState<string|null>(null);

    useEffect(()=>{
        if(!enableDocumentProvider){
            return;
        }

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
        }

    }, [serviceCreator, params]);
    	
    useEffect(()=>{
        if(!shouldSetBundle || routeSourceBundle === null){
            setRouteSourceBundleString(null);
        }else{
            setRouteSourceBundleString(JSON.stringify(routeSourceBundle))
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


    if(!enableDocumentProvider){
        return <>{children}</>;
    }

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
    )
    

}
