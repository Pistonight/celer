import { HashRouter, Outlet, Route, Routes, } from "react-router-dom";
import { AppFrame, Home, LoadingFrame } from "ui/frames";
import { useExpBetterBundler, useExpPortCustomization } from "core/experiments";
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
import { useCallback } from "react";

const RootLayer: React.FC = ()=>
	<AppExperimentsProvider>
		<AppSettingProvider>
			<Outlet />
		</AppSettingProvider>
	</AppExperimentsProvider>;

const DocumentLayer: React.FC<AppDocumentProviderProps> = ({serviceCreator, shouldSetBundle})=>
	<AppDocumentProvider serviceCreator={serviceCreator} shouldSetBundle={shouldSetBundle}>
		<AppStateProvider>
			<AppStyleProvider>
				<Outlet />
			</AppStyleProvider>
		</AppStateProvider>
	</AppDocumentProvider>
;

// Need this to access exp
const WsDevDocumentLayer: React.FC = () => {
	const enableBetterBundler = useExpBetterBundler();
	const enablePortCustomization = useExpPortCustomization();
	const creatorWrapper = useCallback((params)=>{
		const port = enablePortCustomization ? params.port : undefined;
		return createWebSocketDevService(enableBetterBundler, port);
	}, [enableBetterBundler, enablePortCustomization]);
	return <DocumentLayer serviceCreator={creatorWrapper} shouldSetBundle={!enableBetterBundler}/>;
};

// Router for the app
export const AppMain: React.FC<EmptyObject> = () => {
	return (
		<HashRouter>
			<Routes>
				<Route path="/" element={<RootLayer />}>
					<Route index element={<Home />} />
					<Route path="docs" element={<DocumentLayer serviceCreator={createInternalDocumentService} shouldSetBundle={false}/>}>
						<Route path=":reference" element={<AppFrame />}/>
					</Route>
					<Route path="dev" element={<WsDevDocumentLayer />}>
						<Route index element={<AppFrame />}/>
						<Route path=":port" element={<AppFrame />}/>
					</Route>
					<Route path="gh" element={<DocumentLayer serviceCreator={createGitHubService} shouldSetBundle={false}/>}>
						<Route path=":user/:repo" element={<AppFrame />}/>
						<Route path=":user/:repo/:branch" element={<AppFrame />}/>
					</Route>
					<Route path="local" element={<DocumentLayer serviceCreator={createLocalService} shouldSetBundle={true}/>}>
						<Route index element={<AppFrame />}/>
					</Route>
					<Route path="*" element={<LoadingFrame error>Not Found</LoadingFrame>} />
				</Route>
			</Routes>
		</HashRouter>
	);
};
