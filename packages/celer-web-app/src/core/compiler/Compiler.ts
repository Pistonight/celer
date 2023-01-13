import {
	EngineError,
	SourceSection,
	SourceStep,
	SourceStepCustomization,
	switchModule,
	switchSection,
	switchStep
} from "data/libs";
import { MapOf } from "data/util";
import { getModules,CompilerPresetModule } from "./modules";
import { StringParser } from "./text";
import { BannerType, RouteAssembly, RouteAssemblySection, RouteCommand, Movement, SplitType } from "./types";

export class Compiler {
	private modules: CompilerPresetModule[];

	constructor(useNewKorokComment: boolean) {
		this.modules = getModules(useNewKorokComment);
	}

	public compile(sections: SourceSection[]): RouteAssemblySection[] {
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

	private compileSections(sections: SourceSection[]): RouteAssemblySection[] {
		if(Array.isArray(sections)){
			return sections.map(this.compileSection.bind(this));
		}

		return [{
			route: [
				this.makeCompilerError("Not a valid route object: " + JSON.stringify(sections))
			]
		}];
	}

	private compileSection(section: SourceSection): RouteAssemblySection{
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

	private compileStep(step: SourceStep): RouteAssembly[]{
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

	private compilePresetExtend(preset:string, extend: SourceStepCustomization): RouteAssembly[] | undefined{
		const { header, typedString } = StringParser.parseStringBlock(preset);
		for(let i = 0;i<this.modules.length;i++){
			const stepAssembly = this.modules[i].compile(typedString);
			if(stepAssembly){
				const lines = this.applyExtend(stepAssembly, extend);
				if(header.isStep){
					stepAssembly.isStep = true;
				}
				// Check for icon on splits
				if(stepAssembly.splitType !== SplitType.None && !stepAssembly.icon) {
					lines.push(
						this.makeCompilerWarningWithTriangle("The above step has a split type, but has no icon. A split must have an icon, or it will be ignored when exporting splits")
					);
				}
				return lines;
			}
		}
		return [this.makeCompilerError("Unexpected Error Compiler.compilePresetExtend. This is likely a bug in the compiler")];
	}

	private applyExtend(data: RouteAssembly, extend: SourceStepCustomization): RouteAssembly[] {
		const lines = [data];
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
			}else{
				lines.push(this.makeCompilerErrorWithTriangle(`Invalid split type: ${customSplitTypeString}`));
			}
		}

		if(extend.commands){
			const validCommands: RouteCommand[] = [];
			extend.commands.forEach(cString=>{
				if(RouteCommand[RouteCommand[cString as keyof typeof RouteCommand]] === cString){
					validCommands.push(RouteCommand[cString as keyof typeof RouteCommand]);
				}else{
					lines.push(this.makeCompilerErrorWithTriangle(`Invalid command: ${cString}`));
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

		// suppress
		if(extend.suppress){
			const validSuppress: EngineError[] = [];
			extend.suppress.forEach(cString=>{
				if(EngineError[EngineError[cString as keyof typeof EngineError]] === cString){
					validSuppress.push(EngineError[cString as keyof typeof EngineError]);
				}else{
					lines.push(this.makeCompilerErrorWithTriangle(`Invalid command: ${cString}`));
				}
			});
			data.suppress = validSuppress;
		}

		return lines;
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
		return this.makeBanner(error, false, false);
	}

	private makeCompilerErrorWithTriangle(error: string): RouteAssembly {
		return this.makeBanner(error, true, false);
	}

	private makeCompilerWarningWithTriangle(error: string): RouteAssembly {
		return this.makeBanner(error, true, true);
	}

	private makeBanner(error: string, triangle: boolean, isWarning: boolean): RouteAssembly {
		const type = isWarning ? BannerType.Warning : BannerType.Error;
		const text = isWarning ? "Warning" : "Error";
		return  {
			text: StringParser.convertToTypedString(`Compiler ${text}: ${error}`),
			bannerTriangle: triangle,
			bannerType: type,
			splitType: SplitType.None
		};
	}

}
