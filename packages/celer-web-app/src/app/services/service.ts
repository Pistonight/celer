import axios from "axios";
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
