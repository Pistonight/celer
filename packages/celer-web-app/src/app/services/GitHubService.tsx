import { LocalStorageWrapper, RecentPages } from "data/storage";
import { UrlService } from "./UrlService";
import { ServiceCreator } from "./types";

export const createGitHubService: ServiceCreator = ({user, repo, branch}) => {
	// Define the URL being loaded
	const currentURL = `/gh/${user}/${repo}/${branch ?? "main"}`;
	// Load the 5 most recently visited pages
	let recentlyVisitedLinks = LocalStorageWrapper.load(RecentPages.KEY, RecentPages.DEFAULT, RecentPages.parseArrayFromString);
	// Adds this URL to the front of the recently visited URLs
	let last = recentlyVisitedLinks[0];
	// Push all other values backwards in the priority list. Let the last one "fall off"
	// If the page visited is already at the head of the list, skip.
	if (!(last === currentURL)) {
		recentlyVisitedLinks[0] = currentURL;
		for (let i=1; i<RecentPages.NUM_PAGES; i++) {
			if (recentlyVisitedLinks[i] === currentURL) {
				recentlyVisitedLinks[i] = last;
				break;
			} else {
				const temp = recentlyVisitedLinks[i];
				recentlyVisitedLinks[i] = last;
				last = temp;
			}
		}
	}
	// Update the new list in local storage
	LocalStorageWrapper.store(RecentPages.KEY, recentlyVisitedLinks, RecentPages.parseStringFromArray);
	// Return the URL service
	return new UrlService(`https://raw.githubusercontent.com/${user}/${repo}/${branch ?? "main"}/bundle.json`);
};
