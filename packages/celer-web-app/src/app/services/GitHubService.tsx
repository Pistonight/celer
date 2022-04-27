import { useCallback } from "react";
import { useParams } from "react-router-dom";
import { useAppState,ServiceContext, useService } from "core/context";
import { EmptyObject } from "data/util";
import { getRouteScriptAsync } from "./service";

export const GitHubService: React.FC<EmptyObject> = ({children}) => {
	const { setRouteScript } = useAppState();
	const serviceFunction = useCallback((path)=>{
		const load = async () => {
			const routescript = await getRouteScriptAsync(path);
			setRouteScript(routescript);
		};
       
		load();
	}, []);
	return (
		<ServiceContext.Provider value={serviceFunction}>
			{children}
		</ServiceContext.Provider>
	);
};

export const GitHubResolver: React.FC<EmptyObject> = ({children})=>{
	const {user, repo, branch} = useParams();
	const url = `https://raw.githubusercontent.com/${user}/${repo}/${branch ?? "main"}/bundle.json`;
	useService(url);
	return <>{children}</>;
};
