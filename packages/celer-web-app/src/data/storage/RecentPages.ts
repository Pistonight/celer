import { LocalStorageWrapper } from ".";

const KEY = "RecentlyVisitedPages";
const NUM_PAGES = 5; // <-- Change this to increase number of pages tracked
const DEFAULT = new Array(NUM_PAGES);

// Input a string, return an array of max length NUM_PAGES with
//  that string separated by spaces.
function parseArrayFromString(valueString: string): string[] {
	const returnArr = valueString.split(" ", NUM_PAGES);
	return returnArr;
}

// Input an array, return a string with the elements in the array
//  joined by spaces.
function parseStringFromArray(arr: string[]): string {
	const joinedStr = arr.join(" ");
	return joinedStr;
}

// Adds the currently visited page to the recent pages list in localStorage
export function addPageToRecents(url: string): void {
	// Load the most recently visited pages
	let recentlyVisited = LocalStorageWrapper.load(KEY, DEFAULT, parseArrayFromString);
	// Add the current URL to the list of recently visited pages
	recentlyVisited.splice(0, 0, url);
	// Remove any duplicate occurrences of the new url from the array
	for (let i = 1; i < NUM_PAGES; i++) {
		if (recentlyVisited[i] === url) {
			recentlyVisited.splice(i, 1);
			break;
		}
	}
	// Store the updated list back into LocalStorage
	LocalStorageWrapper.store(KEY, recentlyVisited, parseStringFromArray);
}

// Returns the most recently visited pages from localStorage
export function loadRecentPages(): string[] {
	return LocalStorageWrapper.load(KEY, DEFAULT, parseArrayFromString);
}
