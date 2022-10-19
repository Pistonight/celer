import { Params } from "react-router-dom";
import { UrlService } from "./UrlService";

export const createGitHubService = ({user, repo, branch}: Params, enableBinary: boolean) => {
	if (enableBinary){
		return new UrlService([{
			url: `https://raw.githubusercontent.com/${user}/${repo}/${branch ?? "main"}/bundle.bin`,
			type: "bin"
		},{
			url: `https://raw.githubusercontent.com/${user}/${repo}/${branch ?? "main"}/bundle.json`,
			type: "json"
		}], enableBinary);
	}
	return new UrlService([{
		url: `https://raw.githubusercontent.com/${user}/${repo}/${branch ?? "main"}/bundle.json`,
		type: "json"
	}], enableBinary);
};
