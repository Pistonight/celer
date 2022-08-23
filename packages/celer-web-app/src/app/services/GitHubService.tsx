import { useParams } from "react-router-dom";
import { ServiceContext } from "core/context";
import { EmptyObject } from "data/util";
import { UrlService } from "./UrlService";
import { useLoadRouteAsync } from "./service";
import { ServiceCreator } from "./types";

export const GitHubServiceOld: React.FC<EmptyObject> = ({children}) => {

	const {user, repo, branch} = useParams();
	const url = `https://raw.githubusercontent.com/${user}/${repo}/${branch ?? "main"}/bundle.json`;

	const serviceFunction = useLoadRouteAsync(url);
	return (
		<ServiceContext.Provider value={serviceFunction}>
			{children}
		</ServiceContext.Provider>
	);
};

export const createGitHubService: ServiceCreator = ({user, repo, branch}) => {
	return new UrlService(`https://raw.githubusercontent.com/${user}/${repo}/${branch ?? "main"}/bundle.json`);
};
