import { LocalStorageWrapper } from "data/storage";

// The key in LocalStorage to use
const KEY = "RecentlyVisitedPages";
// Maximum number of pages tracked to avoid cluttering home page
export const MAX_RECENT_PAGES = 5;

// Adds the currently visited page to the recent pages list in localStorage
export function addPageToRecents(url: string): void {
	// Load the most recently visited pages
	const recentlyVisited = loadRecentPages();
	// Add the current URL to the list of recently visited pages
	recentlyVisited.splice(0, 0, url);
	// Remove any duplicate occurrences of the current from the array
	let i = 1;
	for (; i < recentlyVisited.length && i <= MAX_RECENT_PAGES; i++) {
		if (recentlyVisited[i] === url) {
			recentlyVisited.splice(i, 1);
			break;
		}
	}
	// If the array is larger than the maximum size (meaning the list
	//  is full and no repeats were deleted), delete the last item.
	if (i > MAX_RECENT_PAGES) {
		recentlyVisited.splice(-1, 1);
	}
	// Store the updated list back into LocalStorage
	LocalStorageWrapper.store(KEY, recentlyVisited);
}

// Returns the most recently visited pages from localStorage
export function loadRecentPages(): string[] {
	return LocalStorageWrapper.load<string[]>(KEY, []);
}
