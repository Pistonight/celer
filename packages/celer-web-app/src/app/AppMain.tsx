import { HashRouter, Outlet, Route, Routes} from "react-router-dom";
import { AppFrame, Home, LoadingFrame } from "ui/frames";
import { useExpBetterBundler, useExpBinaryBundle, useExpWebSocketDevClient } from "core/experiments";
import { EmptyObject } from "data/util";
import { AppDocumentProvider, AppDocumentProviderProps } from "./AppDocumentProvider";
import { AppExperimentsProvider } from "./AppExperiments";
import { AppSettingProvider } from "./AppSettingProvider";
import { AppStateProvider } from "./AppState";
import { AppStyleProvider } from "./AppStyleProvider";
import {
	createInternalDocumentService,
	createLocalService,
	createGitHubService,
	createWebSocketDevService
} from "./services";

const RootLayer: React.FC = ()=>
	<AppExperimentsProvider>
		<AppSettingProvider>
			<Outlet />
		</AppSettingProvider>
	</AppExperimentsProvider>;

const DocumentLayer: React.FC<AppDocumentProviderProps> = ({serviceCreator})=>
	<AppDocumentProvider serviceCreator={serviceCreator}>
		<AppStateProvider>
			<AppStyleProvider>
				<Outlet />
			</AppStyleProvider>
		</AppStateProvider>
	</AppDocumentProvider>
;

// Need these to access exp
const WsDevDocumentLayer: React.FC = () => {
	const enableBetterBundler = useExpBetterBundler();
	const enableWsDevClient = useExpWebSocketDevClient();
	const enableBinary = useExpBinaryBundle();
	const creatorWrapper = useCallback((params)=>{
		return createWebSocketDevService(enableBetterBundler, enableWsDevClient, enableBinary, params.port);
	}, [enableBetterBundler, enableWsDevClient, enableBinary]);
	return <DocumentLayer serviceCreator={creatorWrapper} shouldSetBundle={!enableBetterBundler}/>;
};

const GitHubDocumentLayer: React.FC = () => {
	const enableBinary = useExpBinaryBundle();
	const creatorWrapper = useCallback((params)=>{
		return createGitHubService(params, enableBinary);
	}, [enableBinary]);
	return <DocumentLayer serviceCreator={creatorWrapper} shouldSetBundle={false}/>;
}

// Router for the app
export const AppMain: React.FC<EmptyObject> = () => {
	return (
		<HashRouter>
			<Routes>
				<Route path="/" element={<RootLayer />}>
					<Route index element={<Home />} />
					<Route path="docs" element={<DocumentLayer serviceCreator={createInternalDocumentService}/>}>
						<Route path=":reference" element={<AppFrame />}/>
					</Route>
					<Route path="dev" element={<DocumentLayer serviceCreator={createWebSocketDevService}/>}>
						<Route index element={<AppFrame />}/>
						<Route path=":port" element={<AppFrame />}/>
					</Route>
					<Route path="gh" element={<DocumentLayer serviceCreator={createGitHubService}/>}>
						<Route path=":user/:repo" element={<AppFrame />}/>
						<Route path=":user/:repo/:branch" element={<AppFrame />}/>
					</Route>
					<Route path="local" element={<DocumentLayer serviceCreator={createLocalService}/>}>
						<Route index element={<AppFrame />}/>
					</Route>
					<Route path="*" element={<LoadingFrame error>Not Found</LoadingFrame>} />
				</Route>
			</Routes>
		</HashRouter>
	);
};
