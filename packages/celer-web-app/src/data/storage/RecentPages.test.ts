import { addPageToRecents, loadRecentPages, MAX_RECENT_PAGES } from "./RecentPages";

// Note that as of Jest@24, localStorage is mocked, so running these tests
// should affect the actual values stored.
describe("data/storage/RecentPages", () => {
	const pages = new Array<string>(MAX_RECENT_PAGES + 1);
	for (let i = 0; i < MAX_RECENT_PAGES + 1; i++) {
		pages[i] = "page" + i;
	}
	test("LocalStorage is initially empty.", () => {
		const recentPages = loadRecentPages();
		expect(recentPages).toEqual([]);
	});
	test("A page can be added to LocalStorage.", () => {
		addPageToRecents(pages[0]);
		const recentPages = loadRecentPages();
		const expected = [pages[0]];
		expect(recentPages).toEqual(expected);
	});
	test("Adding a page already in LocalStorage won't be duplicated.", () => {
		addPageToRecents(pages[0]);
		const recentPages = loadRecentPages();
		const expected = [pages[0]];
		expect(recentPages).toEqual(expected);
	});
	test("Additional pages can be added to LocalStorage.", () => {
		for (let i = 1; i < MAX_RECENT_PAGES; i++) {
			addPageToRecents(pages[i]);
		}
		const recentPages = loadRecentPages();
		const expected = new Array<string>(MAX_RECENT_PAGES);
		for (let i = 0; i < MAX_RECENT_PAGES; i++) {
			expected[i] = pages[MAX_RECENT_PAGES - 1 - i];
		}
		expect(recentPages).toEqual(expected);
	});
	test("Adding an existing page moves that page to the front of the queue in LocalStorage.", () => {
		addPageToRecents(pages[0]);
		const recentPages = loadRecentPages();
		const expected = new Array<string>(MAX_RECENT_PAGES);
		expected[0] = pages[0];
		for (let i = 1; i < MAX_RECENT_PAGES; i++) {
			expected[i] = pages[MAX_RECENT_PAGES - i];
		}
		expect(recentPages).toEqual(expected);
	});
	test("Maximum size of recent pages list in LocalStorage is maintained.", () => {
		addPageToRecents(pages[MAX_RECENT_PAGES]);
		const recentPages = loadRecentPages();
		const expected = new Array<string>(MAX_RECENT_PAGES);
		expected[0] = pages[MAX_RECENT_PAGES];
		expected[1] = pages[0];
		for (let i = 2; i < MAX_RECENT_PAGES; i++) {
			expected[i] = pages[MAX_RECENT_PAGES - i + 1];
		}
		expect(recentPages).toEqual(expected);
	});
});
