// Helper functions to encapsulate error handling when parsing route script

import { RouteSection, RouteModule, RouteScriptExtend, RouteStep, SingleProperty } from "./type";

export const switchSection = <T>(
	section: RouteSection,
	moduleHandler: (name: string | undefined, m: RouteModule)=>T,
	errorHandler: (error: string)=>T
):T => {
	if(!section){
		return errorHandler("Not a valid section: "+ section);
	}
	if(typeof section === "object" && !Array.isArray(section)){
		const [name, module] = switchSinglePropertyObject<RouteModule|RouteScriptExtend, [string|undefined, RouteModule | undefined]>(section, (name, moduleOrExtend)=>{
			// Need to further determine if module is a module or actually extend..
			if(name.length > 0 && name[0] === "_"){
				// if name starts with underscore, treat it as a step
				return [undefined, section as RouteModule];
			}
			// Otherwise treat as section
			return [name, moduleOrExtend as RouteModule];
		}, (errorString)=>{
			return [errorString, undefined];
		});
		if(!module){
			return errorHandler(name || "Unknown Error");
		}
		return moduleHandler(name, module as RouteModule);
	}
	//If falls through, must be unnamed section (section is a module)
	return moduleHandler(undefined, section as RouteModule);
};

export const switchModule = <T>(
	module: RouteModule, 
	stringHandler: (m: string)=>T, 
	extendHandler: (preset: string, extend: RouteScriptExtend)=>T,
	arrayHandler: (array: RouteStep[])=>T,
	errorHandler: (error: string)=>T
): T => {
	if (typeof module === "string"){
		return stringHandler(module);
	}
	if(!module){
		return errorHandler("Not a valid step: " + JSON.stringify(module));
	}
	if (Array.isArray(module)){
		return arrayHandler(module);
	}
	return switchSinglePropertyObject<RouteScriptExtend, T>(module, extendHandler, errorHandler);

};

export const switchStep = <T>(
	step: RouteStep,
	stringHandler: (m: string)=>T, 
	extendHandler: (preset: string, extend: RouteScriptExtend)=>T,
	errorHandler: (error: string)=>T
):T => {
	if (typeof step === "string"){
		return stringHandler(step);
	}
	if(!step){
		return errorHandler("Not a valid step: " + JSON.stringify(step));
	}
	if (Array.isArray(step)){
		return errorHandler("Step cannot be an array: " + JSON.stringify(step));
	}
	return switchSinglePropertyObject<RouteScriptExtend, T>(step, extendHandler, errorHandler);
};
 
const switchSinglePropertyObject = <T, R>(
	spo: SingleProperty<T>,
	okHandler: (key: string, value: T)=>R,
	errorHandler: (error: string)=>R
): R => {
	if(!spo || typeof spo !== "object"){
		return errorHandler("Not a valid step: " + JSON.stringify(spo));
	}
	const keys = Object.keys(spo);
	if (keys.length !== 1){
		return errorHandler("A valid step must have exactly 1 key, received: " + JSON.stringify(spo));
	}
	const key = keys[0];
	return okHandler(key, spo[key]);
};
