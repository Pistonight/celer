import queryString from "query-string";
import { useEffect } from "react";
import { HashRouter, Outlet, Route, Routes, useLocation, useNavigate, useParams } from "react-router-dom";
import { useService } from "core/context";
import { EmptyObject } from "data/util";
import { AppExperimentsProvider } from "./AppExperiments";
import { AppStateProvider } from "./AppState";
import { AppStyleProvider } from "./AppStyleProvider";
import { DevelopmentService, InternalDocumentService, GitHubResolver, GitHubService } from "./services";

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
        
		// Deprecated Service=Internal
		if(query.Service === "Internal"){
			const reference = (`${query.Id}` || "presets").toLowerCase();
			const message = `The URL you are visiting uses a deprecated query parameter (Service=Internal). Please visit this page using .link(https://celer.itntpiston.app/#/docs/${reference}) in the future.`;
			sessionStorage.setItem(REDIRECT_MESSAGE_KEY, message);
			delete query.Service;
			delete query.Id;
			query[REDIRECT_QUERY]="true";
			navigate(`/docs/${reference}?${queryString.stringify(query)}`);
			return;
		}
		if(query.Internal){
			const reference = (`${query.Internal}` || "presets").toLowerCase();
			const message = `The URL you are visiting uses a deprecated query parameter (Internal). Please visit this page using: .link(https://celer.itntpiston.app/#/docs/${reference}) in the future.`;
			sessionStorage.setItem(REDIRECT_MESSAGE_KEY, message);
			delete query.Internal;

			query[REDIRECT_QUERY]="true";
			navigate(`/docs/${reference}?${queryString.stringify(query)}`);
			return;
		}
		if(query.DevPort){
			const reference = `${query.DevPort}`;
			navigate(`/pydev/${reference}`);
			return;
		}
		if(query.Service === "gh"){
			const reference = `${query.Id}`;
			const refParts = reference.split("/").filter((s)=>s);
			while(refParts.length<2){
				refParts.push("unknown");
			}
			let ghPath = refParts[0]+"/"+refParts[1];
			if(refParts.length>2 && refParts[2]!=="main"){
				ghPath+="/"+refParts[2];
			}
			const message = `The URL you are visiting uses a deprecated query parameter (Service=gh). If you are the author of this document, share your document with .link(https://celer.itntpiston.app/#/gh/${ghPath}) instead. We now only support loading bundle.json from the root of the repo (in any branch).`;
			sessionStorage.setItem(REDIRECT_MESSAGE_KEY, message);
			delete query.Service;
			delete query.Id;
			query[REDIRECT_QUERY]="true";
			navigate(`/gh/${ghPath}?${queryString.stringify(query)}`);
			return;
		}
        
	}, [pathname, search]);

	return null;
};

// Router for the app
export const AppRouter: React.FC<EmptyObject> = ({children}) => {
	return (
		<HashRouter>
			<Redirector />
			<Routes>
				<Route path="/" element={
					<AppExperimentsProvider>
						<AppStateProvider>
							<AppStyleProvider>
								<Outlet />
								{/* <EngineService mapCore={this.state.mapCore} onRouteReload={()=>{
                            // Prevent doc from going back to previous scroll position on reload
                            this.setState({docScrollToLine: this.state.docCurrentLine});
                        }}>
                            
                        </EngineService> */}
							</AppStyleProvider>
						</AppStateProvider>
					</AppExperimentsProvider>
				}>
					<Route index element={<div>
						<h1>
                            Home page is working in progress.
						</h1> 
						<p>
                            If you are using the python dev server, click <a href="#/pydev">here</a>
						</p>
						<p>
                                If you are trying to view the route, open the route URL directly.
						</p>
					</div>} />
					<Route path="docs" element={<InternalDocumentService><Outlet /></InternalDocumentService>}>
						<Route path=":reference" element={<RefResolver>{children}</RefResolver>}/>
					</Route>
					<Route path="pydev" element={<DevelopmentService><Outlet /></DevelopmentService>}>
						<Route index element={<DefaultRefResolver reference="2222">{children}</DefaultRefResolver>}/>
						<Route path=":reference" element={<RefResolver>{children}</RefResolver>}/>

					</Route>
					<Route path="gh" element={<GitHubService><Outlet/></GitHubService>}>
						<Route path=":user/:repo" element={<GitHubResolver>{children}</GitHubResolver>}/>
						<Route path=":user/:repo/:branch" element={<GitHubResolver>{children}</GitHubResolver>}/>
					</Route>
					<Route path="*" element={<div>Nothing here</div>} />

				</Route>
			</Routes>
		</HashRouter>
	);
};

const RefResolver: React.FC<EmptyObject> = ({children})=>{
	const {reference} = useParams();
	useService(reference);
	return <>{children}</>;
};

const DefaultRefResolver: React.FC<{reference: string}> = ({reference, children})=>{
	useService(reference);
	return <>{children}</>;
};
