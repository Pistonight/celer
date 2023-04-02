import { useEffect, useMemo, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { LoadingFrame } from "ui/frames";
import { Compiler } from "core/compiler";
import { DocumentContext, useAppSetting, useOldAppSetting } from "core/context";
import { RouteEngine } from "core/engine";
import { useExpNewIconResolution, useExpUseNewRecentPath, useNewSettings } from "core/experiments";
import { MapEngine } from "core/map";
import {
	RouteConfig,
	RouteMetadata,
	SourceObject, wasmEnsureRouteConfig, wasmEnsureRouteMetadata
} from "data/libs";
import { addPageToRecents } from "data/storage";
import { DocumentCreator, DocumentResponse } from "./services";

export type AppDocumentProviderProps = {
	createDocument: DocumentCreator
}

const routeEngine = new RouteEngine();
const mapEngine = new MapEngine();

// AppDocumentProvider handles loading the document and passing it to the rest of the app
export const AppDocumentProvider: React.FC<AppDocumentProviderProps> = ({ createDocument, children }) => {
	const enableEarlyIconResolution = useExpNewIconResolution();

	const compiler = useMemo(()=>new Compiler(enableEarlyIconResolution), [enableEarlyIconResolution]);

	const useNew = useNewSettings();
	const { setting } = useAppSetting();
	const { splitSetting } = useOldAppSetting();
	const splits = useNew ? setting.splitSettings : splitSetting;

	const params = useParams();
	const [status, setStatus] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [routeSourceBundle, setRouteSourceBundle] = useState<SourceObject | null>(null);

	const location = useLocation();
	const enableNewPath = useExpUseNewRecentPath();
	useEffect(() => {
		if (!enableNewPath) {
			return;
		}
		const path = location.pathname;
		if (path) {
			addPageToRecents(path);
		}
	}, [enableNewPath, location]);
	// Load the document bundle
	useEffect(() => {
		const service = createDocument(params);
		const doUpdate = (response: DocumentResponse) => {
			const {doc, error, status} = response;
			if(doc){
				if(doc._globalError){
					setError(doc._globalError);
					setStatus(null);
					setRouteSourceBundle(null);
				} else {
					setError(null);
					setStatus(null);
					setRouteSourceBundle(doc);
				}
			}else{
				setError(error ?? null);
				setStatus(status ?? null);
				setRouteSourceBundle(null);
			}
		};
		const doLoad = async () => {
			try {
				doUpdate(await service.load(doUpdate));
			} catch (e) {
				console.error(e);
				setError("An error occured. Check the console for more details.");
				setStatus(null);
				setRouteSourceBundle(null);
			}
		};
		doLoad();
		if (!enableNewPath) {
			const path = service.getPath();
			if (path) {
				addPageToRecents(path);
			}
		}
		return () => {
			service.release();
		};

	}, [createDocument, params, enableNewPath]);

	// Extract the metadata, config, and route assembly from the bundle
	const { metadata, config, routeAssembly } = useMemo(() => {
		if (routeSourceBundle === null) {
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
		const metadata: RouteMetadata = wasmEnsureRouteMetadata(routeSourceBundle._project);
		const config: RouteConfig = wasmEnsureRouteConfig(routeSourceBundle._config);
		const route = routeSourceBundle._route;

		const routeAssembly = compiler.compile(route, config);

		return {
			metadata,
			config,
			routeAssembly
		};
	}, [routeSourceBundle]);

	// Compute the document lines and map data
	const { docLines, mapIcons, mapLines } = useMemo(() => {
		routeEngine.setSplitSetting(splits);
		const docLines = routeEngine.compute(routeAssembly, config.engine || {});
		const [mapIcons, mapLines] = mapEngine.compute(docLines);

		return {
			docLines,
			mapIcons,
			mapLines
		};
	}, [routeAssembly, splits, config]);

	useEffect(() => {
		if (metadata.name) {
			document.title = `${metadata.name} - Celer`;
		} else {
			document.title = "Celer";
		}
	}, [metadata]);

	if (error) {
		return <LoadingFrame error>{error}</LoadingFrame>;
	}
	if (!routeSourceBundle) {
		return <LoadingFrame>{status || "Loading Document"}</LoadingFrame>;
	}
	return (
		<DocumentContext.Provider value={{
			metadata,
			config,
			docLines,
			mapIcons,
			mapLines
		}}>
			{children}
		</DocumentContext.Provider>
	);

};
