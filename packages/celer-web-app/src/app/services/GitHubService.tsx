import { useParams } from "react-router-dom";
import { ServiceContext } from "core/context";
import { EmptyObject } from "data/util";
import { useLoadRouteAsync } from "./service";

export const GitHubService: React.FC<EmptyObject> = ({children}) => {

	const {user, repo, branch} = useParams();
	const url = `https://raw.githubusercontent.com/${user}/${repo}/${branch ?? "main"}/bundle.json`;

	const serviceFunction = useLoadRouteAsync(url);
	return (
		<ServiceContext.Provider value={serviceFunction}>
			{children}
		</ServiceContext.Provider>
	);
};

// export const GitHubResolver: React.FC<EmptyObject> = ({children})=>{
// 	const {user, repo, branch} = useParams();
// 	const url = `https://raw.githubusercontent.com/${user}/${repo}/${branch ?? "main"}/bundle.json`;
// 	useService(url);
// 	return <>{children}</>;
// };
