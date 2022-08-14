import { HashRouter, Outlet, Route, Routes, } from "react-router-dom";
import { AppFrame, Home, LoadingFrame } from "ui/frames";
import { EmptyObject } from "data/util";
import { AppDocumentProvider, AppDocumentProviderProps } from "./AppDocumentProvider";
import { AppExperimentsProvider } from "./AppExperiments";
import { AppStateProvider } from "./AppState";
import { AppStyleProvider } from "./AppStyleProvider";
import { 
	InternalDocumentServiceOld, 
	GitHubServiceOld, 
	WsDevServiceOld, 
	LocalServiceOld,
	createInternalDocumentService, 
	createLocalService,
	createGitHubService, 
	createWebSocketDevService 
} from "./services";

const RootLayer: React.FC = ()=>
	<AppExperimentsProvider>
		<Outlet />
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

// Router for the app
export const AppMain: React.FC<EmptyObject> = () => {
	return (
		<HashRouter>
			<Routes>
				<Route path="/" element={<RootLayer />}>
					<Route index element={<Home />} />
					<Route path="docs" element={<DocumentLayer serviceCreator={createInternalDocumentService} shouldSetBundle={false}/>}>
						<Route path=":reference" element={<InternalDocumentServiceOld><AppFrame /></InternalDocumentServiceOld>}/>
					</Route>
					<Route path="dev" element={<DocumentLayer serviceCreator={createWebSocketDevService} shouldSetBundle={true}/>}>
						<Route index element={<WsDevServiceOld><AppFrame /></WsDevServiceOld>}/>
						<Route path=":port" element={<WsDevServiceOld><AppFrame /></WsDevServiceOld>}/>
					</Route>
					<Route path="gh" element={<DocumentLayer serviceCreator={createGitHubService} shouldSetBundle={false}/>}>
						<Route path=":user/:repo" element={<GitHubServiceOld><AppFrame /></GitHubServiceOld>}/>
						<Route path=":user/:repo/:branch" element={<GitHubServiceOld><AppFrame /></GitHubServiceOld>}/>
					</Route>
					<Route path="local" element={<DocumentLayer serviceCreator={createLocalService} shouldSetBundle={true}/>}>
						<Route index element={<LocalServiceOld><AppFrame /></LocalServiceOld>}/>
					</Route>
					<Route path="*" element={<LoadingFrame error>Not Found</LoadingFrame>} />
				</Route>
			</Routes>
		</HashRouter>
	);
};
