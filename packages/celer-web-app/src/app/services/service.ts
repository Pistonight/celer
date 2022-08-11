import axios from "axios";
import { useCallback } from "react";
import { useAppState } from "core/context";
import { useExpNewDP } from "core/experiments";
import { SourceBundle } from "data/bundler";

export const getRouteScriptAsync = async (url: string): Promise<SourceBundle> => {
	try{
		const response = await axios.get(url);
		return response.data;
	}catch(e){
		console.error(e);
		return {
			_project: {
				name: "",
				authors: [],
				url: "",
				version: "Unknown",
				description: ""
			},
			_route: [
				"(!=) A network error occured when trying to load the route"
			],
			_config: {}
		};
	}

};

export const useLoadRouteAsync = (url: string) => {
	const enableDocumentProvider = useExpNewDP();
	const { setBundle, setRouteScript } = useAppState();
	return useCallback(()=>{
		if(enableDocumentProvider){
			return;
		}
		const load = async () => {
			setBundle(null);
			const routescript = await getRouteScriptAsync(url);
			setRouteScript(routescript);
		};
       
		load();
	}, [url]);
};
