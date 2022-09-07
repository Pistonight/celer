import { SourceObject } from "data/libs";
import { LocalStorageWrapper } from "data/storage";
import { DocumentService } from "./types";

const KEY = "TmpBundleString";

class LocalService implements DocumentService {
	start(callback: (doc: SourceObject | null, error: string | null, status: string | null) => void): void {
		const bundle = LocalStorageWrapper.load<string>(KEY, "");
		if(bundle){
			callback(JSON.parse(bundle), null, null);
		}
	}
	release(): void {
		//no-op
	}
	
}

export const createLocalService = ()=>new LocalService();
