import { LocalStorageWrapper } from "data/storage";
import { Document, DocumentResponse } from "./types";

const KEY = "TmpBundleString";

class DocumentLocal implements Document {
	async load(): Promise<DocumentResponse> {
		const bundle = LocalStorageWrapper.load<string>(KEY, "");
		if(bundle){
			const bundleJson = JSON.parse(bundle);
			if (bundleJson){
				return { doc: bundleJson };
			}
		}
		return { error: "Invalid Route Data" };
	}

	release(): void {
		// no-op
	}

	getPath(): string {
		return "local"; // Remove with useExpUseNewRecentPath
	}
}

export const createDocumentLocal = () => new DocumentLocal();
