import { ScrollTracker } from "./ScrollTracker";

// Note that as of Jest@24, localStorage is mocked, so running these tests
// should affect the actual values stored.
describe("data/storage/ScrollTracker", () => {
	// Creating a ScrollTracker class
	const scrollTracker = new ScrollTracker();
	const scrollPos1 = 1;
	const scrollPos2 = 2;
	test("DocScrollPos is initially empty.", () => {
		const initialScrollPos = scrollTracker.getScrollPos();
		expect(initialScrollPos).toEqual(0);
	});
	test("DocScrollPos can be updated.", () => {
		scrollTracker.setScrollPos(scrollPos1);
		const currentScrollPos = scrollTracker.getScrollPos();
		expect(currentScrollPos).toEqual(scrollPos1);
	});
	test("DocScrollPos can be uploaded to LocalStorage.", () => {
		scrollTracker.storeScrollPos();
		const currentScrollPos = scrollTracker.loadScrollPos();
		expect(currentScrollPos).toEqual(scrollPos1);
	});
	test("Updating DocScrollPos without storing does not affect LocalStorage.", () => {
		scrollTracker.setScrollPos(scrollPos2);
		const storedScrollPos = scrollTracker.loadScrollPos();
		expect(storedScrollPos).toEqual(scrollPos1);
	});
});
