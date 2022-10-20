import { UrlService } from "./UrlService";
import { ServiceCreator } from "./types";
import { LocalStorageWrapper } from "data/storage";
import { parseArrayFromString,
		 parseStringFromArray,
		 NUM_RECENTPAGES,
		 RECENTPAGES_KEY } from "data/storage/RecentlyVisitedPages";

export const createGitHubService: ServiceCreator = ({user, repo, branch}) => {
	// Define the URL being loaded
	const currentURL = `${user}/${repo}/${branch ?? "main"}`;
	// Load the 5 most recently visited pages
	let recentlyVisitedLinks = LocalStorageWrapper.load(RECENTPAGES_KEY, new Array(NUM_RECENTPAGES), parseArrayFromString);
	// Adds this URL to the front of the recently visited URLs
	let last = recentlyVisitedLinks[0];
	recentlyVisitedLinks[0] = currentURL;
	// Push all other values backwards in the priority list. Let the last one "fall off"
	for (let i=1; i<NUM_RECENTPAGES; i++) {
		if (recentlyVisitedLinks[i] === currentURL) {
			recentlyVisitedLinks[i] = last;
			break;
		} else {
			const temp = recentlyVisitedLinks[i];
			recentlyVisitedLinks[i] = last;
			last = temp;
		}
	}
	// Update the new list in local storage
	LocalStorageWrapper.store(RECENTPAGES_KEY, recentlyVisitedLinks, parseStringFromArray);
	// Return the URL service
	return new UrlService(`https://raw.githubusercontent.com/${user}/${repo}/${branch ?? "main"}/bundle.json`);
};
