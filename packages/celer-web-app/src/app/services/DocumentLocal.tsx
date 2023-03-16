import { LocalStorageWrapper } from "data/storage";
import { Consumer } from "data/util";
import { Document, DocumentResponse } from "./types";

const KEY = "TmpBundleString";

class DocumentLocal implements Document {
	load(callback: Consumer<DocumentResponse>): void {
		const bundle = LocalStorageWrapper.load<string>(KEY, "");
		if(bundle){
			const bundleJson = JSON.parse(bundle);
			if (bundleJson){
				callback({ doc: JSON.parse(bundle) });
			}
		}
		callback({ error: "Invalid Route Data" });
	}

	release(): void {
		// no-op
	}

	getPath(): string {
		return "local";
	}
}

export const createDocumentLocal = () => new DocumentLocal();
