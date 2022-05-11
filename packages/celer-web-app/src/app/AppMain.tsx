import queryString from "query-string";
import { useEffect } from "react";
import { HashRouter, Outlet, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { AppFrame, Home } from "ui/frames";
import { EmptyObject } from "data/util";
import { AppExperimentsProvider } from "./AppExperiments";
import { AppStateProvider } from "./AppState";
import { AppStyleProvider } from "./AppStyleProvider";
import { DevelopmentService, InternalDocumentService, GitHubService, WsDevService } from "./services";
import { LocalService } from "./services/LocalService";

const REDIRECT_MESSAGE_KEY = "Celer.RedirectMessage";
const REDIRECT_QUERY = "Redirect";

const Redirector:React.FC<EmptyObject> = () => {
	const {pathname, search} = useLocation();
	const navigate = useNavigate();
	useEffect(()=>{
        
		if (!pathname.startsWith("/")){
			navigate(`/${pathname}${search}`);
			return;
		}
		const query = queryString.parse(search);
		// Validate redirect message
		if(REDIRECT_QUERY in query){
			if(!sessionStorage.getItem(REDIRECT_MESSAGE_KEY)){
				console.warn("Invalid redirect message. The query parameter will be removed"); // eslint-disable-line no-console
				delete query[REDIRECT_QUERY];
				navigate(`${pathname}?${queryString.stringify(query)}`);
				return;
			}
		}else{
			sessionStorage.removeItem(REDIRECT_MESSAGE_KEY);
		}

		if(query.DevPort){
			const reference = `${query.DevPort}`;
			navigate(`/pydev/${reference}`);
			return;
		}
        
	}, [pathname, search]);

	return null;
};

// Router for the app
export const AppMain: React.FC<EmptyObject> = () => {
	return (
		<HashRouter>
			<Redirector />
			<Routes>
				<Route path="/" element={
					<AppExperimentsProvider>
						<AppStateProvider>
							<AppStyleProvider>
								<Outlet />
							</AppStyleProvider>
						</AppStateProvider>
					</AppExperimentsProvider>
				}>
					<Route index element={<Home />} />
					<Route path="docs" element={<InternalDocumentService><Outlet /></InternalDocumentService>}>
						<Route path=":reference" element={<AppFrame />}/>
					</Route>
					<Route path="pydev" element={<DevelopmentService><Outlet /></DevelopmentService>}>
						<Route index element={<AppFrame />}/>
						<Route path=":port" element={<AppFrame />}/>
					</Route>
					<Route path="dev" element={<WsDevService><Outlet /></WsDevService>}>
						<Route index element={<AppFrame />}/>
						<Route path=":port" element={<AppFrame />}/>
					</Route>
					<Route path="gh" element={<GitHubService><Outlet /></GitHubService>}>
						<Route path=":user/:repo" element={<AppFrame />}/>
						<Route path=":user/:repo/:branch" element={<AppFrame />}/>
					</Route>
					<Route path="local" element={<LocalService><Outlet /></LocalService>}>
						<Route index element={<AppFrame />}/>
					</Route>
					{/* Disabled for security reasons <Route path="u" element={<UrlService><Outlet /></UrlService>}>
						<Route index element={<AppFrame />}/>
					</Route> */}
					<Route path="*" element={<div>Nothing here</div>} />

				</Route>
			</Routes>
		</HashRouter>
	);
};
