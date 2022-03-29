
// Use webpack require context to import all images under image directory and create a map

import { MapOf, ReadonlyMapOf } from "data/util";

// Type declaration to pass compiler check
interface requirecontext extends Function {
	keys: ()=>string[]
}

type webpackrequire = {
	context: (dir: string, recursive: boolean, regex: RegExp)=>requirecontext
}

const r = require as unknown as webpackrequire;

const images = ((requireContext)=>{
	const imgMap: MapOf<string> = {};
	requireContext.keys().forEach((k: string)=>{
		if(k.startsWith("./") && k.endsWith(".png")){
			const module = requireContext(k);
			// Clean image path ./name.png => name

			const name = k.substring(2, k.length - 4);
			if(typeof module === "string"){
				imgMap[name] = module;
			}else if (typeof module === "object" && "default" in module){
				imgMap[name] = module["default"];
			}else{
				console.error("Failed to load image: ", k);
			}
		}
	});
	return imgMap;
})(r.context(".", false, /\.png$/));

export default images as ReadonlyMapOf<string>;
