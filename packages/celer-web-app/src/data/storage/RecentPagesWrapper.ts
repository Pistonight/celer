import { LocalStorageWrapper } from "data/storage";

const KEY = "RecentlyVisitedPages";
const NUM_PAGES = 5; // <-- Change this to increase number of pages tracked
const DEFAULT = new Array(NUM_PAGES);

export class RecentPagesWrapper {
	// Input a string, return an array of max length NUM_PAGES with
	//  that string separated by spaces.
	private static parseArrayFromString(valueString: string): string[] {
		const returnArr = new Array(NUM_PAGES);
		const currentStorage = valueString.split(" ");
		let i = 0;
		for (; i < currentStorage.length; i++) {
			returnArr[i] = currentStorage[i];
		}
		for (; i < NUM_PAGES; i++) {
			returnArr[i] = "";
		}
		return returnArr;
	}
	// Input an array, return a string of that array joined with spaces.
	private static parseStringFromArray(valueArray: string[]): string {
		const returnString = valueArray.join(" ");
		return returnString;
	}
	/**
	 * @param {string} relativeURL - the URL to add to the recent pages list
	 */
	public static addPage(url: string): void {
		// Load the 5 most recently visited pages
		const recentlyVisitedLinks = LocalStorageWrapper.load(KEY, DEFAULT, RecentPagesWrapper.parseArrayFromString);
		// Adds this URL to the front of the recently visited URLs
		let last = recentlyVisitedLinks[0];
		// Push all other values backwards in the priority list. Let the last one "fall off"
		// If the page visited is already at the head of the list, skip.
		if (!(last === url)) {
			recentlyVisitedLinks[0] = url;
			for (let i = 1; i < NUM_PAGES; i++) {
				if (recentlyVisitedLinks[i] === url) {
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
		LocalStorageWrapper.store(KEY, recentlyVisitedLinks, RecentPagesWrapper.parseStringFromArray);
	}
	/**
	 * @returns recently the visited pages list from LocalStorage as an array of URL strings
	 */
	public static load(): string[] {
		return LocalStorageWrapper.load(KEY, DEFAULT, RecentPagesWrapper.parseArrayFromString);
	}
}