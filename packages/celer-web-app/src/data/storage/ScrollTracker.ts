import { LocalStorageWrapper } from "./LocalStorageWrapper";

const SCROLLPOS_STORAGE_KEY = "DocScrollPos";

export class ScrollTracker {
	scrollPosition: number;

	constructor() {
		this.scrollPosition = this.loadScrollPos();
	}

	loadScrollPos(): number {
		return LocalStorageWrapper.load<number>(SCROLLPOS_STORAGE_KEY, 0);
	}

	storeScrollPos(): void {
		LocalStorageWrapper.store<number>(SCROLLPOS_STORAGE_KEY, this.scrollPosition);
	}

	getScrollPos(): number {
		return this.scrollPosition;
	}

	setScrollPos(scrollPos: number): void {
		this.scrollPosition = scrollPos;
	}

}