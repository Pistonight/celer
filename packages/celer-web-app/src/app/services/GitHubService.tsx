import { addPageToRecents } from "data/storage";
import { UrlService } from "./UrlService";
import { ServiceCreator } from "./types";

export const createGitHubService: ServiceCreator = ({ user, repo, branch }) => {
	// Define the URL being loaded
	const currentURL = `gh/${user}/${repo}/${branch ?? "main"}`;
	// Add that URL to local storage
	addPageToRecents(currentURL);
	// Return the URL service
	return new UrlService(`https://raw.githubusercontent.com/${user}/${repo}/${branch ?? "main"}/bundle.json`);
};
