import { UrlService } from "./UrlService";
import { ServiceCreator } from "./types";

export const createGitHubService: ServiceCreator = ({ user, repo, branch }) => {
	return new UrlService(`https://raw.githubusercontent.com/${user}/${repo}/${branch ?? "main"}/bundle.json`);
};
