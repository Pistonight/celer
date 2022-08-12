import { useCallback } from "react";
import { useAppState, ServiceContext } from "core/context";
import { SourceBundle } from "data/bundler";
import { LocalStorageWrapper } from "data/storage";
import { EmptyObject } from "data/util";
import { DocumentService } from "./type";

const KEY = "TmpBundleString";

export const LocalServiceOld: React.FC<EmptyObject> = ({children}) => {
	const { setBundle, setRouteScript } = useAppState();
	const serviceFunction = useCallback(()=>{
		setBundle(null);
		const bundle = LocalStorageWrapper.load<string>(KEY, "");
		if(bundle){
			setRouteScript(JSON.parse(bundle));
			setBundle(bundle);
		}
	}, []);
	return (
		<ServiceContext.Provider value={serviceFunction}>
			{children}
		</ServiceContext.Provider>
	);
};

class LocalService implements DocumentService {
	start(callback: (doc: SourceBundle | null, error: string | null, status: string | null) => void): void {
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
