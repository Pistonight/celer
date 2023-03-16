import { HashRouter, Outlet, Route, Routes} from "react-router-dom";
import { AppFrame, Home, LoadingFrame } from "ui/frames";
import { useExpDevServerBase64 } from "core/experiments";
import { EmptyObject } from "data/util";
import { AppDocumentProvider, AppDocumentProviderProps } from "./AppDocumentProvider";
import { AppExperimentsProvider } from "./AppExperiments";
import { AppSettingProvider } from "./AppSettingProvider";
import { AppStateProvider } from "./AppState";
import { AppStyleProvider } from "./AppStyleProvider";
import {
	createDocumentDev,
	createDocumentGitHub,
	createDocumentLocal,
	createDocumentInternal
} from "./services";
import { useCallback } from "react";

const RootLayer: React.FC = ()=>
	<AppExperimentsProvider>
		<AppSettingProvider>
			<Outlet />
		</AppSettingProvider>
	</AppExperimentsProvider>;

const DocumentLayer: React.FC<AppDocumentProviderProps> = ({createDocument})=>
	<AppDocumentProvider createDocument={createDocument}>
		<AppStateProvider>
			<AppStyleProvider>
				<Outlet />
			</AppStyleProvider>
		</AppStateProvider>
	</AppDocumentProvider>
;

// Need this to access exp
const WsDevDocumentLayer: React.FC = () => {
	const enableBase64 = useExpDevServerBase64();
	const creatorWrapper = useCallback((params)=>{
		return createDocumentDev(params, enableBase64);
	}, [enableBase64]);
	return <DocumentLayer createDocument={creatorWrapper}/>;
};

// Router for the app
export const AppMain: React.FC<EmptyObject> = () => {
	return (
		<HashRouter>
			<Routes>
				<Route path="/" element={<RootLayer />}>
					<Route index element={<Home />} />
					<Route path="docs" element={<DocumentLayer createDocument={createDocumentInternal}/>}>
						<Route path=":reference" element={<AppFrame />}/>
					</Route>
					<Route path="dev" element={<WsDevDocumentLayer />}>
						<Route index element={<AppFrame />}/>
						<Route path=":port" element={<AppFrame />}/>
					</Route>
					<Route path="gh" element={<DocumentLayer createDocument={createDocumentGitHub}/>}>
						<Route path=":user/:repo" element={<AppFrame />}/>
						<Route path=":user/:repo/:branch" element={<AppFrame />}/>
					</Route>
					<Route path="local" element={<DocumentLayer createDocument={createDocumentLocal}/>}>
						<Route index element={<AppFrame />}/>
					</Route>
					<Route path="*" element={<LoadingFrame error>Not Found</LoadingFrame>} />
				</Route>
			</Routes>
		</HashRouter>
	);
};
