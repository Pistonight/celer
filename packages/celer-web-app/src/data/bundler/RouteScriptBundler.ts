/* eslint-disable */
import { switchModule, switchSection, switchStep } from "./switch";
import { RouteScript, RouteModule, RouteSection, RouteScriptExtend, RouteStep, RouteMetadata } from "./type";
import { TARGET_VERSION } from "./version";

// Unbundled route script is what the bundler receives
// The bundler processes __use__ directives and remove unused modules
const __use__ = "__use__";
type UnbundledRouteScript = Omit<RouteScript, "compilerVersion"> & {
    [key: string]: RouteModule
};

export const addRouteScriptDeprecationMessage = (route: RouteSection[]):RouteSection[] => {
	return [
		"(?=) Deprecation Warning: You are using a legacy version of the route script that will not be supported in the future. If you are the maintainer of this document, it is recommended that you upgrade to the latest version. Please follow the .link([migration guide]https://github.com/iTNTPiston/celer/wiki/Migrate-from-legacy-route-script-.((celer-compiler)..)) here",
		...route
	];
}

export const bundleRouteScript = (script: UnbundledRouteScript): RouteScript => {
	const [ metadata, metadataDeprecated ] = ensureMetadata(script);
	
	const routeDeprecated = !script._route && script.Route;
	const route = script._route || script.Route;
	
	return {
		compilerVersion: TARGET_VERSION,
		_project: metadata,
		_route: (metadataDeprecated || routeDeprecated) 
		  ? addRouteScriptDeprecationMessage(bundleRoute(script, route))
		  : bundleRoute(script, route)
	};
}
export const ensureMetadata = (script: any): [RouteMetadata, boolean] => {
	const project:RouteMetadata = {
		name: "Unknown Project",
		authors: [],
		url: "",
		version: "Unknown",
		description: "No Description",
	};

	if(script._project) {
		return [{
			...project,
			...script._project
		}, false];
	}

	if(script.Project){
		const metadata = {...project};
		const deprecatedMetadata = script.Project as {
			Name: string,
			Authors: string[],
			Url: string,
			Version: string,
			Description: string,
		}

		// Spread expression is not parsable in dukpy so here's the workaround
		if(deprecatedMetadata.Name){
			metadata.name = deprecatedMetadata.Name;
		}
		if(deprecatedMetadata.Authors){
			metadata.authors = deprecatedMetadata.Authors;
		}
		if(deprecatedMetadata.Url){
			metadata.url = deprecatedMetadata.Url;
		}
		if(deprecatedMetadata.Version){
			metadata.version = deprecatedMetadata.Version;
		}
		if(deprecatedMetadata.Description){
			metadata.description = deprecatedMetadata.Description;
		}

		return [metadata, true];
	}
	return [{...project}, false];
}

const bundleRoute = (script: UnbundledRouteScript, route: RouteSection[]): RouteSection[] => {
	// Make sure route is actually an array
	if(!Array.isArray(route)){
		return ["(!=) Bundler Error: Route property must be an array"];
	}
	// First scan dependencies
	const dependency: {[name: string]: string[]} = {};

	route.forEach(section=>{
		switchSection(section,
			(_, module)=>{
				scanDependencyForModule(dependency, "Route", module);
			},()=>{
				// Do not process dependency if error
			});
	});

	for(const key in script){
		if(key !== "Project" && key !== "Configuration" && key !== "Route"){
			scanDependencyForModule(dependency, key, script[key]);
		}
	}
	// DFS to ensure no circular dependencies
	const circularDependency = ensureNoCircularDependency(dependency, "Route", ["Route"]);
	if(circularDependency){
		return ["(!=) Bundler Error: Circular dependency is detected, so the route is not processed. Please check all your __use__ directives to make sure there is no circular dependencies. Path hit: "+circularDependency];
	}

	const cache: {[key: string]: RouteModule} = {};
	const bundled = bundleSections(script, route, cache);
	return bundled;
}

const scanDependencyForModule = (dependency: {[name: string]: string[]}, name: string, module: RouteModule): void => {
	switchModule(module,
		(stringModule)=>{
			scanDependencyForStringStep(dependency, name, stringModule);
		},()=>{
			// Ignore preset extend
		},(arrayModule)=>{
			arrayModule.forEach(s=>{
				switchStep(s, (stringStep)=>{
					scanDependencyForStringStep(dependency, name, stringStep);
				},()=>{
					// Ignore preset extend
				},()=>{
					// Do not process dependency if error
				});
			});
		},()=>{
			// Do not process dependency if error
		});
}

const scanDependencyForStringStep = (dependency: {[name: string]: string[]}, name: string, step: string): void =>{
	const dep = getModuleNameFromStep(step);
	if(dep){
		if(!dependency[name]){
			dependency[name] = [];
		}
		dependency[name].push(dep);
	}
}

const ensureNoCircularDependency = (dependency: {[name: string]: string[]}, name: string, searchPath: string[]): string | undefined => {
	if(!dependency[name]){
		//has no dependency
		return undefined;
	}
	for(let i = 0;i < dependency[name].length; i++){
		const next = dependency[name][i];
		// Make sure next is not already hit
		for(let j = 0; j<searchPath.length;j++){
			if(next === searchPath[j]){
				return searchPath.join(" -> ")+" -> "+next;
			}
		}
		// put next on stack
		searchPath.push(next);
		const recurResult = ensureNoCircularDependency(dependency, next, searchPath);
		if(recurResult){
			return recurResult;
		}
		searchPath.pop();
	}
	return undefined;
}
const bundleSections = (script: UnbundledRouteScript, sections: RouteSection[], cache: {[key: string]: RouteModule}): RouteSection[] => {
	const returnArray: RouteSection[] = [];
	sections.forEach(section=>{
		switchSection(section,
			(name, module)=>{
				const bundledModule = bundleModule(script, undefined, cache, module);
				if(name){
					returnArray.push({[name]: bundledModule});
				}else{
					//Flatten the array if it is an array
					switchModule(bundledModule,
						(stringModule)=>{
							returnArray.push(stringModule);
						},(preset, extend)=>{
							const warningOrError: RouteStep[] = [];
							ensureValidExtend(extend,(validExtend)=>{
								returnArray.push({[preset]: validExtend});
							}, (warning)=>{
								warningOrError.push("(^?) Bundler Warning: "+warning);
							}, (error)=>{
								warningOrError.push("(^!) Bundler Error: "+error);
							});

							returnArray.push(...warningOrError);
						},(arrayModule)=>{
							arrayModule.forEach(m=>returnArray.push(m));
						},(errorString)=>{
							returnArray.push("(!=) Bundler Error: Error when bundling " + JSON.stringify(module) + ". Caused by: "+errorString);
						});
				}
			},(errorString)=>{
				returnArray.push("(!=) Bundler Error: Error when bundling section " + JSON.stringify(section) + ". Caused by: "+errorString);
			});
	});
	return returnArray;
	
}

const bundleModule = (script: UnbundledRouteScript, name: string|undefined, cache: {[key: string]: RouteModule}, unbundledModule?: RouteModule):RouteModule => {
	if(name && cache[name]){
		//Cache hit, return cached module
		return cache[name];
	}
	// Cache miss, get unbundled from script
	if(name){
		if(script[name] !== undefined){
			unbundledModule = script[name];
		}else{
			unbundledModule = "(!=) Bundler Error: Cannot find module "+name ;
		}
	}else if (!unbundledModule){
		unbundledModule = "(!=) Bundler Error: Illegal Invocation of bundledModule(): Both name and unbundledModule are undefined. This is likely a bug in the bundler.";
	}
	const bundledModule = switchModule(unbundledModule,
		(stringModule)=>{
			if(stringModule.trim().substring(0, 7) === "__use__"){
				const moduleName = stringModule.substring(7).trim();
				return bundleModule(script, moduleName, cache);
			}else{
				return stringModule;
			}
		},(preset, extend)=>{
			const container: RouteStep[] = [];
			const warningOrError: RouteStep[] = [];
			ensureValidExtend(extend,(validExtend)=>{
				container.push({[preset]: validExtend});
			}, (warning)=>{
				warningOrError.push("(^?) Bundler Warning: "+warning);
			}, (error)=>{
				warningOrError.push("(^!) Bundler Error: "+error);
			});
			container.push(...warningOrError);
			if(container.length === 1){
				return container[0];
			}
			return container;
		},(arrayModule)=>{
			const returnArray: RouteStep[] = [];
			arrayModule.forEach(s=>{
				switchStep(s,
					(stringStep)=>{
						const moduleName = getModuleNameFromStep(stringStep);
						if(moduleName){
							const bundledModule = bundleModule(script, moduleName, cache);
							switchModule(bundledModule,
								(stringModule)=>{
									returnArray.push(stringModule);
								},(preset, extend)=>{
									const warningOrError: RouteStep[] = [];
									ensureValidExtend(extend,(validExtend)=>{
										returnArray.push({[preset]: validExtend});
									}, (warning)=>{
										warningOrError.push("(^?) Bundler Warning: "+warning);
									}, (error)=>{
										warningOrError.push("(^!) Bundler Error: "+error);
									});
									returnArray.push(...warningOrError);
								},(arrayModule)=>{
									// Flatten the array
									arrayModule.forEach(m=>returnArray.push(m));
								},(errorString)=>{
									returnArray.push("(!=) Bundler Error: Unexpected @279. Please contact developer. Message: "+errorString);
								});
						}else{
							returnArray.push(stringStep);
						}
					},(preset, extend)=>{
						const warningOrError: RouteStep[] = [];
						ensureValidExtend(extend,(validExtend)=>{
							returnArray.push({[preset]: validExtend});
						}, (warning)=>{
							warningOrError.push("(^?) Bundler Warning: "+warning);
						}, (error)=>{
							warningOrError.push("(^!) Bundler Error: "+error);
						});
						returnArray.push(...warningOrError);
					},(errorString)=>{
						returnArray.push("(!=) Bundler Error: Error when bundling " + JSON.stringify(s) + ". Caused by: "+errorString);
					});
			});
			return returnArray;
		},(errorString)=>{
			return "(!=) Bundler Error: Error when bundling module with name " + name + ". Caused by: "+errorString;
		});
	
	let bundledModuleCheckedDeprecation = bundledModule;
	if(name){
		if(name.startsWith("_")){
			const message = "(?=) Deprecation Warning: This module starts with _ in the celer files. In the future, celer will disallow module name to start with _. Rename this module to fix this";
			if(Array.isArray(bundledModule)){
				bundledModuleCheckedDeprecation = [
					message,
					...bundledModule
				];
			}else{
				bundledModuleCheckedDeprecation = [
					message,
					bundledModule
				];
			}
		}
		cache[name] = bundledModuleCheckedDeprecation;
	}
	return bundledModuleCheckedDeprecation;
}

const getModuleNameFromStep = (step: string): string | undefined => {
	if(step.trim().substring(0, 7) === __use__){
		return step.substring(7).trim();
	}
	return undefined;
}

const ensureValidExtend = (
	extend: RouteScriptExtend | null | undefined, 
	successCallback: (extend: RouteScriptExtend)=>void, 
	warningCallback: (warningString: string)=>void, 
	errorCallback: (errorString: string)=>void): void => {
	if(!extend){
		errorCallback("Step extension cannot be null or undefined");
		return;
	}
	if(!isObject(extend)){
		errorCallback("Step extension must be an object (mapping)");
		return;
	}
	const validExtend: RouteScriptExtend = {};
	// Validate each field
	for(const key in extend){
		const value = extend[key as keyof typeof extend];
		switch(key){
			// String
			case "text":
			case "comment":
			case "notes":
			case "line-color":
			case "split-type":
			case "icon":
				validExtend[key] = String(extend[key]);
				break;
				// Number
			case "fury":
			case "gale":
			case "time-override":
				validExtend[key] = Number(extend[key]) || 0;
				break;
				// Boolean
			case "hide-icon-on-map":
				validExtend[key] = Boolean(extend[key]);
				break;
				// Special
			case "var-change": {
				if(value===undefined || !isObject(value)){
					warningCallback("\"var-change\" is ignored because it is not an object");
					continue;
				}
				const valueinfer = value as object;
				const validVarChange: {[key: string]: number} = {};
				for(const k in value as object){
					if(!Number.isInteger(valueinfer[k as keyof typeof value])){
						warningCallback(`Variable ${k} in var-change is ignored because it is not an integer`);
					}else{
						validVarChange[k] = valueinfer[k as keyof typeof value];
					}
				}
				validExtend[key] = validVarChange;
				break;
			}
			case "coord": {
				if(!isCoordArray(extend[key])){
					warningCallback("\"coord\" is ignored because it is not an array or it has the wrong number of values. Must be either [x, z] or [x, y, z]");
					continue;
				}
				const valueinfer = value as any[];
				validExtend[key] = valueinfer.map((x)=>Number(x) || 0);
				break;
			}
			case "movements": {
				if(!Array.isArray(extend[key])){
					warningCallback("\"movements\" is ignored because it is not an array");
					continue;
				}
				const validMovements: any[] = [];
				//validMovements.push();
				// There is a bug in dukpy that causes an error in forEach here. So we use a regular for loop
				const valueinfer = value as any[];
				for(let i = 0; i<valueinfer.length;i++){
					const movementobj = valueinfer[i];
					if(!isObject(movementobj)){
						warningCallback(`"movements[${i}]" is ignored because it is not an object`);     
					}else if(!("to" in movementobj)){
						warningCallback(`"movements[${i}]" is ignored because it is missing the required attribute "to"`);
					}else if(!isCoordArray(movementobj.to)){
						warningCallback(`"movements[${i}]" is ignored because the "to" attribute is not valid.`);
					}else{
						const validMovement = {
							to: movementobj.to,
							away: !!movementobj.away,
							warp: !!movementobj.warp
						};
						validMovements.push(validMovement);
					}
				}
				validExtend[key] = validMovements;
				break;
			}
			case "commands": {
				if(!Array.isArray(extend[key])){
					warningCallback("\"commands\" is ignored because it is not an array");
					continue;
				}
				const valueinfer = value as any[];
				validExtend[key] = valueinfer.map((x)=>String(x));
				break;
			}
			default:
				warningCallback(`"${key}" is not a valid attribute`);
		}
	}

	successCallback(validExtend);
}

const isObject=(obj: any): boolean => {
	return obj && typeof obj === "object" && !Array.isArray(obj);
}

const isCoordArray = (obj: any): boolean => {
	if(!Array.isArray(obj)){
		return false;
	}
	if(obj.length !== 2 && obj.length !== 3){
		return false;
	}
	return true;
}
