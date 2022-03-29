export {};
// import { switchModule, switchSection, switchStep } from "./switch";
// import { RouteScript, RouteModule, RouteSection, RouteScriptExtend, RouteStep, RouteMetadata } from "./type";
// import { TARGET_VERSION } from "./version";

// // Unbundled route script is what the bundler receives
// // The bundler processes __use__ directives and remove unused modules
// const __use__ = "__use__";
// type UnbundledRouteScript = Omit<RouteScript, "compilerVersion"> & {
//     [key: string]: RouteModule
// };

// // Debug flag
// const ENABLE_DEBUG = false;
// const debugInfo: any[] = [];

// class RouteScriptBundler {
// 	bundle(script: UnbundledRouteScript): RouteScript {
// 		return {
// 			compilerVersion: TARGET_VERSION,
// 			Project: this.ensureProject(script),
// 			Route: this.bundleRoute(script, script.Route)
// 		};
// 	}
// 	private ensureProject(script: UnbundledRouteScript): RouteMetadata {
// 		const project:RouteMetadata = {
// 			Name: "Untitled Project",
// 			Authors: [],
// 			Url: "",
// 			Version: "Unknown",
// 			Description: "No Description",
// 		};

// 		if(script.Project){
// 			// Spread expression is not parsable in dukpy so here's the workaround
// 			if(script.Project.Name){
// 				project.Name = script.Project.Name;
// 			}
// 			if(script.Project.Authors){
// 				project.Authors = script.Project.Authors;
// 			}
// 			if(script.Project.Url){
// 				project.Url = script.Project.Url;
// 			}
// 			if(script.Project.Version){
// 				project.Version = script.Project.Version;
// 			}
// 			if(script.Project.Description){
// 				project.Description = script.Project.Description;
// 			}
// 		}
// 		return project;
// 	}

// 	private bundleRoute(script: UnbundledRouteScript, route: RouteSection[]): RouteSection[]{
// 		// Make sure route is actually an array
// 		if(!Array.isArray(route)){
// 			return ["(!=) Bundler Error: Route property must be an array"];
// 		}
// 		// First scan dependencies
// 		const dependency: {[name: string]: string[]} = {};

// 		route.forEach(section=>{
// 			switchSection(section,
// 				(_, module)=>{
// 					this.scanDependencyForModule(dependency, "Route", module);
// 				},()=>{
// 					// Do not process dependency if error
// 				});
// 		});

// 		for(const key in script){
// 			if(key !== "Project" && key !== "Configuration" && key !== "Route"){
// 				this.scanDependencyForModule(dependency, key, script[key]);
// 			}
// 		}
// 		// DFS to ensure no circular dependencies
// 		const circularDependency = this.ensureNoCircularDependency(dependency, "Route", ["Route"]);
// 		if(circularDependency){
// 			return ["(!=) Bundler Error: Circular dependency is detected, so the route is not processed. Please check all your __use__ directives to make sure there is no circular dependencies. Path hit: "+circularDependency];
// 		}

// 		const cache: {[key: string]: RouteModule} = {};
// 		const bundled = this.bundleSections(script, route, cache);
// 		//debug trace
// 		if(ENABLE_DEBUG){
// 			bundled.push(JSON.stringify(cache));
// 			bundled.push(JSON.stringify(debugInfo));
// 		} 
// 		return bundled;
// 	}

// 	private scanDependencyForModule(dependency: {[name: string]: string[]}, name: string, module: RouteModule): void {
// 		switchModule(module,
// 			(stringModule)=>{
// 				this.scanDependencyForStringStep(dependency, name, stringModule);
// 			},()=>{
// 				// Ignore preset extend
// 			},(arrayModule)=>{
// 				arrayModule.forEach(s=>{
// 					switchStep(s, (stringStep)=>{
// 						this.scanDependencyForStringStep(dependency, name, stringStep);
// 					},()=>{
// 						// Ignore preset extend
// 					},()=>{
// 						// Do not process dependency if error
// 					});
// 				});
// 			},()=>{
// 				// Do not process dependency if error
// 			});
// 	}

// 	private scanDependencyForStringStep(dependency: {[name: string]: string[]}, name: string, step: string): void{
// 		const dep = this.getModuleNameFromStep(step);
// 		if(dep){
// 			if(!dependency[name]){
// 				dependency[name] = [];
// 			}
// 			dependency[name].push(dep);
// 		}
// 	}

// 	private ensureNoCircularDependency(dependency: {[name: string]: string[]}, name: string, searchPath: string[]): string | undefined {
// 		if(!dependency[name]){
// 			//has no dependency
// 			return undefined;
// 		}
// 		for(let i = 0;i < dependency[name].length; i++){
// 			const next = dependency[name][i];
// 			// Make sure next is not already hit
// 			for(let j = 0; j<searchPath.length;j++){
// 				if(next === searchPath[j]){
// 					return searchPath.join(" -> ")+" -> "+next;
// 				}
// 			}
// 			// put next on stack
// 			searchPath.push(next);
// 			const recurResult = this.ensureNoCircularDependency(dependency, next, searchPath);
// 			if(recurResult){
// 				return recurResult;
// 			}
// 			searchPath.pop();
// 		}
// 		return undefined;
// 	}
// 	private bundleSections(script: UnbundledRouteScript, sections: RouteSection[], cache: {[key: string]: RouteModule}): RouteSection[] {
// 		const returnArray: RouteSection[] = [];
// 		sections.forEach(section=>{
// 			switchSection(section,
// 				(name, module)=>{
// 					debugInfo.push(module);
// 					const bundledModule = this.bundleModule(script, undefined, cache, module);
// 					if(name){
// 						returnArray.push({[name]: bundledModule});
// 					}else{
// 						//Flatten the array if it is an array
// 						switchModule(bundledModule,
// 							(stringModule)=>{
// 								returnArray.push(stringModule);
// 							},(preset, extend)=>{
// 								const warningOrError: RouteStep[] = [];
// 								this.ensureValidExtend(extend,(validExtend)=>{
// 									returnArray.push({[preset]: validExtend});
// 								}, (warning)=>{
// 									warningOrError.push("(^?) Bundler Warning: "+warning);
// 								}, (error)=>{
// 									warningOrError.push("(^!) Bundler Error: "+error);
// 								});
// 								returnArray.push.apply(returnArray, warningOrError);
// 							},(arrayModule)=>{
// 								arrayModule.forEach(m=>returnArray.push(m));
// 							},(errorString)=>{
// 								returnArray.push("(!=) Bundler Error: Error when bundling " + JSON.stringify(module) + ". Caused by: "+errorString);
// 							});
// 					}
// 				},(errorString)=>{
// 					returnArray.push("(!=) Bundler Error: Error when bundling section " + JSON.stringify(section) + ". Caused by: "+errorString);
// 				});
// 		});
// 		return returnArray;
        
// 	}

// 	private bundleModule(script: UnbundledRouteScript, name: string|undefined, cache: {[key: string]: RouteModule}, unbundledModule?: RouteModule):RouteModule {
// 		if(name && cache[name]){
// 			//Cache hit, return cached module
// 			return cache[name];
// 		}
// 		// Cache miss, get unbundled from script
// 		if(name){
// 			if(script[name] !== undefined){
// 				unbundledModule = script[name];
// 			}else{
// 				unbundledModule = "(!=) Bundler Error: Cannot find module "+name ;
// 			}
// 		}else if (!unbundledModule){
// 			unbundledModule = "(!=) Bundler Error: Illegal Invocation of bundledModule(): Both name and unbundledModule are undefined. This is likely a bug in the bundler.";
// 		}
// 		const bundledModule = switchModule(unbundledModule,
// 			(stringModule)=>{
// 				if(stringModule.trim().substring(0, 7) === "__use__"){
// 					const moduleName = stringModule.substring(7).trim();
// 					return this.bundleModule(script, moduleName, cache);
// 				}else{
// 					return stringModule;
// 				}
// 			},(preset, extend)=>{
// 				const container: RouteStep[] = [];
// 				const warningOrError: RouteStep[] = [];
// 				this.ensureValidExtend(extend,(validExtend)=>{
// 					container.push({[preset]: validExtend});
// 				}, (warning)=>{
// 					warningOrError.push("(^?) Bundler Warning: "+warning);
// 				}, (error)=>{
// 					warningOrError.push("(^!) Bundler Error: "+error);
// 				});
// 				container.push.apply(container,warningOrError);
// 				if(container.length === 1){
// 					return container[0];
// 				}
// 				return container;
// 			},(arrayModule)=>{
// 				const returnArray: RouteStep[] = [];
// 				arrayModule.forEach(s=>{
// 					switchStep(s,
// 						(stringStep)=>{
// 							const moduleName = this.getModuleNameFromStep(stringStep);
// 							if(moduleName){
// 								const bundledModule = this.bundleModule(script, moduleName, cache);
// 								switchModule(bundledModule,
// 									(stringModule)=>{
// 										returnArray.push(stringModule);
// 									},(preset, extend)=>{
// 										const warningOrError: RouteStep[] = [];
// 										this.ensureValidExtend(extend,(validExtend)=>{
// 											returnArray.push({[preset]: validExtend});
// 										}, (warning)=>{
// 											warningOrError.push("(^?) Bundler Warning: "+warning);
// 										}, (error)=>{
// 											warningOrError.push("(^!) Bundler Error: "+error);
// 										});
// 										returnArray.push.apply(returnArray, warningOrError);
// 									},(arrayModule)=>{
// 										// Flatten the array
// 										arrayModule.forEach(m=>returnArray.push(m));
// 									},(errorString)=>{
// 										returnArray.push("(!=) Bundler Error: Unexpected @279. Please contact developer. Message: "+errorString);
// 									});
// 							}else{
// 								returnArray.push(stringStep);
// 							}
// 						},(preset, extend)=>{
// 							const warningOrError: RouteStep[] = [];
// 							this.ensureValidExtend(extend,(validExtend)=>{
// 								returnArray.push({[preset]: validExtend});
// 							}, (warning)=>{
// 								warningOrError.push("(^?) Bundler Warning: "+warning);
// 							}, (error)=>{
// 								warningOrError.push("(^!) Bundler Error: "+error);
// 							});
// 							returnArray.push.apply(returnArray, warningOrError);
// 						},(errorString)=>{
// 							returnArray.push("(!=) Bundler Error: Error when bundling " + JSON.stringify(s) + ". Caused by: "+errorString);
// 						});
// 				});
// 				return returnArray;
// 			},(errorString)=>{
// 				return "(!=) Bundler Error: Error when bundling module with name " + name + ". Caused by: "+errorString;
// 			});
        
// 		if(name){
// 			cache[name] = bundledModule;
// 		}
// 		return bundledModule;
// 	}

// 	private getModuleNameFromStep(step: string): string | undefined {
// 		if(step.trim().substring(0, 7) === __use__){
// 			return step.substring(7).trim();
// 		}
// 		return undefined;
// 	}

// 	private ensureValidExtend(
// 		extend: RouteScriptExtend | null | undefined, 
// 		successCallback: (extend: RouteScriptExtend)=>void, 
// 		warningCallback: (warningString: string)=>void, 
// 		errorCallback: (errorString: string)=>void): void {
// 		if(!extend){
// 			errorCallback("Step extension cannot be null or undefined");
// 			return;
// 		}
// 		if(!this.isObject(extend)){
// 			errorCallback("Step extension must be an object (mapping)");
// 			return;
// 		}
// 		const validExtend: RouteScriptExtend = {};
// 		// Validate each field
// 		for(const key in extend){
// 			switch(key){
// 				// String
// 				case "text":
// 				case "comment":
// 				case "notes":
// 				case "line-color":
// 				case "split-type":
// 				case "icon":
// 					validExtend[key] = String(extend[key]);
// 					break;
// 					// Number
// 				case "fury":
// 				case "gale":
// 				case "time-override":
// 					validExtend[key] = Number(extend[key]) || 0;
// 					break;
// 					// Boolean
// 				case "hide-icon-on-map":
// 					validExtend[key] = Boolean(extend[key]);
// 					break;
// 					// Special
// 				case "var-change":
// 					if(!this.isObject(extend[key])){
// 						warningCallback("\"var-change\" is ignored because it is not an object");
// 						continue;
// 					}
// 					const validVarChange: {[key: string]: number} = {};
// 					for(const k in extend[key]){
// 						// @ts-ignore
// 						if(!Number.isInteger(extend[key][k])){
// 							warningCallback(`Variable ${k} in var-change is ignored because it is not an integer`);
// 						}else{
// 							// @ts-ignore
// 							validVarChange[k] = extend[key][k];
// 						}
// 					}
// 					validExtend[key] = validVarChange;
// 					break;
// 				case "coord":
// 					if(!this.isCoordArray(extend[key])){
// 						warningCallback("\"coord\" is ignored because it is not an array or it has the wrong number of values. Must be either [x, z] or [x, y, z]");
// 						continue;
// 					}
// 					// @ts-ignore
// 					validExtend[key] = extend[key].map((x)=>Number(x) || 0);
// 					break;
// 				case "movements":
// 					if(!Array.isArray(extend[key])){
// 						warningCallback("\"movements\" is ignored because it is not an array");
// 						continue;
// 					}
// 					const validMovements: any[] = [];
// 					//validMovements.push();
// 					// There is a bug in dukpy that causes an error in forEach here. So we use a regular for loop
// 					// @ts-ignore
// 					for(let i = 0; i<extend[key].length;i++){
// 						// @ts-ignore
// 						const movementobj = extend[key][i];
// 						if(!this.isObject(movementobj)){
// 							warningCallback(`"movements[${i}]" is ignored because it is not an object`);     
// 							// @ts-ignore               
// 						}else if(!("to" in movementobj)){
// 							warningCallback(`"movements[${i}]" is ignored because it is missing the required attribute "to"`);
// 						}else if(!this.isCoordArray(movementobj.to)){
// 							warningCallback(`"movements[${i}]" is ignored because the "to" attribute is not valid.`);
// 						}else{
// 							const validMovement = {
// 								to: movementobj.to,
// 								away: !!movementobj.away,
// 								warp: !!movementobj.warp
// 							};
// 							validMovements.push(validMovement);
// 						}
// 					}
// 					validExtend[key] = validMovements;
// 					break;
// 				case "commands":
// 					// @ts-ignore
// 					if(!Array.isArray(extend[key])){
// 						warningCallback("\"commands\" is ignored because it is not an array");
// 						continue;
// 					}
// 					// @ts-ignore
// 					validExtend[key] = extend[key].map((x)=>String(x));
// 					break;
// 				default:
// 					warningCallback(`"${key}" is not a valid attribute`);
// 			}
// 		}

// 		successCallback(validExtend);
// 	}

// 	private isObject(obj: any): boolean {
// 		return obj && typeof obj === "object" && !Array.isArray(obj);
// 	}

// 	private isCoordArray(obj: any): boolean {
// 		if(!Array.isArray(obj)){
// 			return false;
// 		}
// 		if(obj.length !== 2 && obj.length !== 3){
// 			return false;
// 		}
// 		return true;
// 	}
// }

// export default new RouteScriptBundler();
