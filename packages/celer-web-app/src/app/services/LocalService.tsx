import { useCallback } from "react";
import { useAppState, ServiceContext } from "core/context";
import { LocalStorageWrapper } from "data/storage";
import { EmptyObject } from "data/util";

const KEY = "TmpBundleString";

export const LocalService: React.FC<EmptyObject> = ({children}) => {
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
