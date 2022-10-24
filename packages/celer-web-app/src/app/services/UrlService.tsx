import axios from "axios";
import { SourceObject } from "data/libs";
import { DocumentService } from "./types";

export class UrlService implements DocumentService {
	private url: string;
	private controller: AbortController = new AbortController();

	constructor(url: string) {
		this.url = url;
	}

	start(callback: (doc: SourceObject | null, error: string | null, status: string | null) => void): void {
		axios.get(this.url, { signal: this.controller.signal }).then(response => {
			callback(response.data, null, null);
		}, (rejectReason) => {
			if (typeof rejectReason === "string") {
				callback(null, rejectReason, null);
			} else if (rejectReason && rejectReason.message) {
				callback(null, rejectReason.message, null);
			} else {
				callback(null, "Unknown Error", null);
			}
		});
	}
	release(): void {
		this.controller.abort();
	}
	getDocPath(): string {
		return this.url;
	}
}
