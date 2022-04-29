import axios from "axios";
import { RouteScript, TARGET_VERSION } from "data/bundler";

export const getRouteScriptAsync = async (url: string): Promise<RouteScript> => {
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
			compilerVersion: TARGET_VERSION,
			_route: [
				"(!=) A network error occured when trying to load the route"
			]
		};
	}

};
