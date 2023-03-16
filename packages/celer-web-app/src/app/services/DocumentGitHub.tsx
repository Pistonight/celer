import { Params } from "react-router-dom";
import { DocumentUrl } from "./DocumentUrl";

export const createDocumentGitHub = ({user, repo, branch}: Params) => {
	return new DocumentUrl([{
		url: `https://raw.githubusercontent.com/${user}/${repo}/${branch ?? "main"}/bundle.json`,
		type: "json"
	}]);
};
