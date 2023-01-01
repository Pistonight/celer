// Helper functions to encapsulate error handling when parsing route script

import { SourceSection, SourceModule, SourceStepCustomization, SourceStep, SingleProperty } from "./types";

export const switchSection = <T>(
	section: SourceSection,
	moduleHandler: (name: string | undefined, m: SourceModule)=>T,
	errorHandler: (error: string)=>T
):T => {
	if(!section){
		return errorHandler("Not a valid section: "+ section);
	}
	if(typeof section === "object" && !Array.isArray(section)){
		const [name, module] = switchSinglePropertyObject<SourceModule|SourceStepCustomization, [string|undefined, SourceModule | undefined]>(section, (name, moduleOrExtend)=>{
			// Need to further determine if module is a module or actually extend..
			if(name.length > 0 && name[0] === "_"){
				// if name starts with underscore, treat it as a step
				return [undefined, section as SourceModule];
			}
			// Otherwise treat as section
			return [name, moduleOrExtend as SourceModule];
		}, (errorString)=>{
			return [errorString, undefined];
		});
		if(!module){
			return errorHandler(name || "Unknown Error");
		}
		return moduleHandler(name, module as SourceModule);
	}
	//If falls through, must be unnamed section (section is a module)
	return moduleHandler(undefined, section as SourceModule);
};

export const switchModule = <T>(
	module: SourceModule,
	stringHandler: (m: string)=>T,
	extendHandler: (preset: string, extend: SourceStepCustomization)=>T,
	arrayHandler: (array: SourceStep[])=>T,
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
	return switchSinglePropertyObject<SourceStepCustomization, T>(module, extendHandler, errorHandler);

};

export const switchStep = <T>(
	step: SourceStep,
	stringHandler: (m: string)=>T,
	extendHandler: (preset: string, extend: SourceStepCustomization)=>T,
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
	return switchSinglePropertyObject<SourceStepCustomization, T>(step, extendHandler, errorHandler);
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
