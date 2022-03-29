import { RouteScript, TARGET_VERSION } from "data/compile";
import queryString from "query-string";
import axios from "axios";

export interface ServiceConfig {
    scriptUrl?: string,
    id: string,
    devConfig?: {
        devPort: number,
        refreshInterval: number,
    },
    error?: string,
}

const getStringConfig = (config: string | (string|null)[] | null): string | null => {
	if(Array.isArray(config)){
		return null;
	}
	return config;
};

export const getServiceConfig = ():ServiceConfig => {
	const parsedQueryString = queryString.parse(window.location.search);
	const id = parsedQueryString.Id;

	// internal mode: engine will load internal example route
	if(parsedQueryString.Internal){
		return {
			id: getStringConfig(id) ?? getStringConfig(parsedQueryString.Internal) ?? "RouteScript"
		};
	}
	// dev mode: load from local
	if(parsedQueryString.DevPort){
		const refreshInterval = Number(parsedQueryString.RefreshInterval) || 5000;
		return {
			id: "",
			devConfig:{
				devPort: Number(parsedQueryString.DevPort),
				refreshInterval
			}
		};
	}
	if(parsedQueryString.Service){
		const service = getStringConfig(parsedQueryString.Service);
		if(service === "gh"){
			return {
				scriptUrl: `https://raw.githubusercontent.com/${id}`,
				id: String(id)
			};
		}
	}

	// Error
	return {
		id: "",
		error: "Service Error: Cannot load route script. Please check if your URL is correct"
	};
};

export const getRouteScriptAsync = async (url: string): Promise<RouteScript> => {
	try{
		const response = await axios.get(url);
		return response.data;
	}catch(e){
		console.error(e);
		return {
			Project: {
				Name: "",
				Authors: [],
				Url: "",
				Version: "Unknown",
				Description: ""
			},
			compilerVersion: TARGET_VERSION,
			Route: [
				"(!=) A network error occured when trying to load the route"
			]
		};
	}

};
