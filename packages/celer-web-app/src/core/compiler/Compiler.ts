import { RouteScriptExtend, RouteSection, RouteStep, switchModule, switchSection, switchStep} from "data/bundler";
import { MapOf } from "data/util";
import { getModules,CompilerPresetModule } from "./modules";
import { StringParser } from "./text";
import { BannerType, RouteAssembly, RouteAssemblySection, RouteCommand, Movement, SplitType } from "./types";

export class Compiler {
	private modules: CompilerPresetModule[] = getModules();

	public compile(sections: RouteSection[]): RouteAssemblySection[] {
		try{
			const compiled = this.compileSections(sections);
			
			//put 20 empty lines at the end
			const emptyLines = [];
			for(let i = 0; i<20;i++){
				emptyLines.push({
					text: StringParser.parseStringBlockSimple(""),
					splitType: SplitType.None
				});
			}
			compiled.push({route: emptyLines});
			return compiled;
		}catch(e){
			console.error(e);
			return [{
				route:[this.makeCompilerError("The compiler has encountered an error. Please check console logs.")]
			}];
		}
        
	}

	private compileSections(sections: RouteSection[]): RouteAssemblySection[] {
		if(Array.isArray(sections)){
			return sections.map(this.compileSection.bind(this));
		}
        
		return [{
			route: [
				this.makeCompilerError("Not a valid route object: " + JSON.stringify(sections))
			]
		}];
	}

	private compileSection(section: RouteSection): RouteAssemblySection{
		const sectionErrorHandler = (s: string)=>({
			route: [
				this.makeCompilerError("Error when compiling section, caused by: " + s)
			]
		});
		return switchSection(section,
			(name, module)=>{
				return switchModule(module,
					(stringModule)=>{
						return {
							name,
							route: this.compileStep(stringModule)
						};
					}, (preset, extend)=>{
						return {
							name,
							route: this.compileStep({[preset]: extend})
						};
					}, (arrayModule)=>{
						const route: RouteAssembly[] = [];
						arrayModule.forEach(m=>route.push(...this.compileStep(m)));
						return {
							name,
							route
						};
					},sectionErrorHandler);
			},sectionErrorHandler);
	}

	private compileStep(step: RouteStep): RouteAssembly[]{
		return switchStep<RouteAssembly[]>(step, 
			(stringStep)=>{
				if(stringStep.startsWith("_")){
					const stepAssembly = this.compilePresetExtend(stringStep, {});
					if(stepAssembly) {
						return stepAssembly;
					}
				}
				return [this.compileStepString(stringStep.trim())];
			},(preset, extend)=>{
				const stepAssembly = this.compilePresetExtend(preset, extend);
				if(stepAssembly) {
					return stepAssembly;
				}
				return [this.makeCompilerError("Unknown step preset: " + JSON.stringify(preset))];
			},(errorString)=>{
				return [this.makeCompilerError("Error when compiling step, caused by " + errorString)];
			});
	}

	private compileStepString(stepString: string): RouteAssembly{
		const { header, typedString } = StringParser.parseStringBlock(stepString);

		if (header.bannerType !== undefined){
			return {
				text: typedString,
				bannerTriangle: header.bannerTriangle,
				bannerType: header.bannerType,
				splitType: SplitType.None
			};
		}

		// Attempt to parse preset
		for(let i = 0;i<this.modules.length;i++){
			const stepAssembly = this.modules[i].compile(typedString);
			if(stepAssembly){
				if(header.isStep){
					stepAssembly.isStep = true;
				}
				return stepAssembly;
			}
		}

		return this.makeCompilerError("Unexpected Error Compiler.compileStepString. This is likely a bug in the compiler");
	}

	private compilePresetExtend(preset:string, extend: RouteScriptExtend): RouteAssembly[] | undefined{
		const { header, typedString } = StringParser.parseStringBlock(preset);
		for(let i = 0;i<this.modules.length;i++){
			const stepAssembly = this.modules[i].compile(typedString);
			if(stepAssembly){
				this.applyExtend(stepAssembly, extend);
				if(header.isStep){
					stepAssembly.isStep = true;
				}
				// Check for icon on splits
				if(stepAssembly.splitType !== SplitType.None && !stepAssembly.icon) {
					return [
						stepAssembly,
						this.makeCompilerWarningWithTriangle("The above step has a split type, but has no icon. A split must have an icon, or it will be ignored when exporting splits")
					];
				}
				return [stepAssembly];
			}
		}
		return [this.makeCompilerError("Unexpected Error Compiler.compilePresetExtend. This is likely a bug in the compiler")];
	}

	private applyExtend(data: RouteAssembly, extend: RouteScriptExtend): void {
		if(extend.text){
			data.text = StringParser.parseStringBlockSimple(extend.text);
		}

		if(extend.comment){
			data.comment = StringParser.parseStringBlockSimple(extend.comment);
		}

		if(extend.icon){
			data.icon = extend.icon;
		}

		if(extend.notes){
			data.notes =  StringParser.parseStringBlockSimple(extend.notes);
		}

		if(extend["line-color"]){
			data.lineColor = extend["line-color"];
		}
		if(extend["hide-icon-on-map"]){
			data.hideIconOnMap = extend["hide-icon-on-map"];
		}
		if(extend.gale){
			data.gale = extend.gale;
		}
		if(extend.fury){
			data.fury = extend.fury;
		}
		if(extend["time-override"]){
			data.timeOverride = extend["time-override"];
		}
      
		if(extend["split-type"]){
			const customSplitTypeString = extend["split-type"];
			data.splitType = SplitType.None;
			// Make sure split type is valid using typescript enum mapping
			if(SplitType[SplitType[customSplitTypeString as keyof typeof SplitType]] === customSplitTypeString){
				data.splitType = SplitType[customSplitTypeString as keyof typeof SplitType];
			}
		}

		if(extend.commands){
			const validCommands: RouteCommand[] = [];
			extend.commands.forEach(cString=>{
				if(RouteCommand[RouteCommand[cString as keyof typeof RouteCommand]] === cString){
					validCommands.push(RouteCommand[cString as keyof typeof RouteCommand]);
				}
			});
			data.commands = validCommands;
		}

		// Doing minimal error checking here, since the bundler is supposed to check the errors
		if(extend.movements){
			const movements = extend.movements.map(this.processExtendMovement.bind(this)).filter(m=>m);
			data.movements = movements as Movement[];
		}else if(extend.coord){
			const x = extend.coord[0];
			let z = extend.coord[1];
			if(extend.coord.length === 3){
				z = extend.coord[2];
			}
			data.movements = [{
				to: {x, z},
				isWarp: false,
				isAway: false,
			}];
		}
		if(extend["var-change"]){
			const varMap = extend["var-change"];
			const validatedMap: MapOf<number> = {};
			for(const key in varMap){
				const num = Number(varMap[key]);
				if(num){
					validatedMap[key]=num;
				}
			}
			data.variableChange = validatedMap;
		}
	}

	private processExtendMovement(movement: {to?: number[], warp?: boolean, away?: boolean}): Movement | undefined {
		if(!movement.to || !Array.isArray(movement.to) || movement.to.length < 2){
			return undefined;
		}
		const x = movement.to[0];
		let z = movement.to[1];
		if(movement.to.length === 3){
			z = movement.to[2];
		}
		return {
			to: {x, z},
			isAway: !!movement.away,
			isWarp: !!movement.warp
		};
	}

	private makeCompilerError(error: string): RouteAssembly {
		return  {
			text: StringParser.convertToTypedString("Compile Error: "+error),
			bannerTriangle: false,
			bannerType: BannerType.Error,
			splitType: SplitType.None
		};
	}

	private makeCompilerWarningWithTriangle(error: string): RouteAssembly {
		return  {
			text: StringParser.convertToTypedString("Compile Warning: "+error),
			bannerTriangle: true,
			bannerType: BannerType.Warning,
			splitType: SplitType.None
		};
	}

}
