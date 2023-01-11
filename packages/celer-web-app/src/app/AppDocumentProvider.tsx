import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { LoadingFrame } from "ui/frames";
import { Compiler } from "core/compiler";
import { DocumentContext, useAppSetting } from "core/context";
import { RouteEngine } from "core/engine";
import { useExpWarnNegativeVar, useNewKorokComment } from "core/experiments";
import { MapEngine } from "core/map";
import {
	RouteConfig,
	RouteMetadata,
	SourceObject, wasmEnsureRouteConfig, wasmEnsureRouteMetadata
} from "data/libs";
import { ServiceCreator } from "./services";

export type AppDocumentProviderProps = {
	serviceCreator: ServiceCreator
}

const routeEngine = new RouteEngine();
const mapEngine = new MapEngine();

export const AppDocumentProvider: React.FC<AppDocumentProviderProps> = ({ serviceCreator, children }) => {
	const warnNegativeVar = useExpWarnNegativeVar();
	const enableNewKorokComment = useNewKorokComment();

	const compiler = useMemo(()=>new Compiler(enableNewKorokComment), [enableNewKorokComment]);

	const { setting } = useAppSetting();

	useEffect(() => {
		routeEngine.warnNegativeNumberEnable = warnNegativeVar;
	}, [warnNegativeVar]);

	const params = useParams();
	const [status, setStatus] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [routeSourceBundle, setRouteSourceBundle] = useState<SourceObject | null>(null);

	useEffect(() => {
		const service = serviceCreator(params);
		service.start((doc, error, status) => {
			// After starting the service, add it to recent pages
			if (doc) {
				if (doc._globalError) {
					setError(doc._globalError);
					setStatus(null);
					setRouteSourceBundle(null);
				} else {
					setError(null);
					setStatus(null);
					setRouteSourceBundle(doc);
				}
			} else {
				setError(error);
				setStatus(status);
				setRouteSourceBundle(null);
			}
		});
		service.addToRecentPages();
		return () => {
			service.release();
		};

	}, [serviceCreator, params]);

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

		const routeAssembly = compiler.compile(route);

		return {
			metadata,
			config,
			routeAssembly
		};
	}, [routeSourceBundle]);

	const { docLines, mapIcons, mapLines } = useMemo(() => {
		routeEngine.setSplitSetting(setting.splitSettings);
		const docLines = routeEngine.compute(routeAssembly, config.engine || {});
		const [mapIcons, mapLines] = mapEngine.compute(docLines);

		return {
			docLines,
			mapIcons,
			mapLines
		};
	}, [routeAssembly, setting.splitSettings, config]);

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
