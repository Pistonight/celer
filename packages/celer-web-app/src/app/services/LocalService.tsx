import { wasmCleanBundleJson } from "data/libs";
import { LocalStorageWrapper } from "data/storage";
import { Consumer } from "data/util";
import { DocumentService, ServiceResponse } from "./types";

const KEY = "TmpBundleString";

class LocalService implements DocumentService {
	start(callback: Consumer<ServiceResponse>): void {
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
		//no-op
	}
	addToRecentPages(): void {
		// Adding LocalService to recent pages not yet supported
	}
}

export const createLocalService = () => new LocalService();
