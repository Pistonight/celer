import axios from "axios";
import queryString from "query-string";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { AppExperimentsContext } from "core/context";
import { EmptyObject, MapOf } from "data/util";

const CONFIG_URL = "https://raw.githubusercontent.com/iTNTPiston/celer/main/packages/celer-web-app/experiments.json";

export const AppExperimentsProvider: React.FC<EmptyObject> = ({children}) => {
	const [liveExperiments, setLiveExperiments] = useState<MapOf<boolean>>({});
	const [overrides, setOverrides] = useState<MapOf<boolean>>({});
	const {search} = useLocation();
	const mountedRef = useRef(true);
	useEffect(()=>{
		const loadLiveExperiments = async () => {
			try{
				const { data } = await axios.get(CONFIG_URL);
				if(mountedRef.current){
					setLiveExperiments(data);
					console.log("Live experiments loaded"); // eslint-disable-line no-console
				}else{
					console.warn("Component unmounted before experiments were loaded"); // eslint-disable-line no-console
				}
			}catch(e){
				console.error(e);
				console.error("Fail to load live experiments");
			}
		};
		loadLiveExperiments();
		return ()=>{
			mountedRef.current = false;
		};
	}, []);
	useEffect(()=>{
		const parsedQueryString = queryString.parse(search);
		const overrides: MapOf<boolean> = {};
		for(const key in parsedQueryString){
			if (key.startsWith("Exp.")){
				const experiment = key.substring(4);
				overrides[experiment] = parsedQueryString[key] !== "false";
				console.log(`Using override ${experiment} = ${overrides[experiment]}`); // eslint-disable-line no-console
			}
		}
		setOverrides(overrides);
	}, [search]);
	const isExperimentEnabled = useCallback((name)=>{
		if(name in overrides){
			return overrides[name] === true;
		}
		if(name in liveExperiments){
			return liveExperiments[name] === true;
		}
		return false;
	}, [liveExperiments, overrides]);
	return (
		<AppExperimentsContext.Provider value={isExperimentEnabled}>
			{children}
		</AppExperimentsContext.Provider>
	);
};
