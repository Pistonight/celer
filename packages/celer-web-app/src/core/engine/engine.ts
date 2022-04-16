//import { addKorok, getMissingKoroks, hasKorok, KorokData, newData } from "./korok";
// import { instructionLikeToInstructionPacket, stringToText, textLikeToTextBlock } from "./convert";
// import { EngineError, EngineErrorStrings } from "./error";
// import { txt, lcn, npc} from "./strings";
// import { InstructionData, InstructionLike,TextBlock, Text, InstructionPacket, AbilityUsage, TextLike, RouteAssemblySection, RouteAssembly } from "../../data/assembly/types";
// import { Koroks } from "./library";
// import { EngineCommand, EngineCommands } from "./command";
// import { InstructionPacketWithExtend } from "./creator";
import { DocLine } from "core/route";
import { BannerType, RouteAssembly, RouteAssemblySection, SplitType } from "data/assembly/types";
import { defaultSplitSetting, SplitTypeSetting } from "data/settings";
import { MapOf } from "data/util";
import { StringType, TypedString, TypedStringBlock, TypedStringSingle } from "data/assembly";
import { RouteCommand } from "data/assembly";

//Recharge time in seconds
const BASE_ABILITY_RECHARGE = {
	gale: 360,
	fury: 720
};
// const GALE_RECHARGE = 360;
// const FURY_RECHARGE = 720;
// const GALE_PLUS_RECHARGE = 120;
// const FURY_PLUS_RECHARGE = 240;
// Default estimate for each step is 20 seconds
// const STEP_ESTIMATE = 20;
const ROMAN_NUMERAL = ["","I","II","III","IV","V","VI","VII","VIII","IX","X","XI","XII","XIII","XIV","XV"];

//const ShrineFormat = "{{KRK}} {{Text}} {{SRN}}";
//const KorokFormat = "{{Seed}} {{ID}} {{Text}}";

export class RouteEngine{
	// Engine configuration
	private splitSetting: SplitTypeSetting<boolean> =defaultSplitSetting;

	private sectionNumber = 0;
	private lineNumber = 0;
	private step = "1";
	private korokCount = 0;
	//private korokSeed = 0;
	private shrineCount = 0;
	private memoryCount = 0;
	private towerCount = 0;
	private warpCount = 0;
	private talusCount = 0;
	private hinoxCount = 0;
	private moldugaCount = 0;
	private abilityCount = {
		gale: 3,
		fury: 3
	};
	private abilityUpgrade = {
		gale: false,
		fury: false
	};
	private abilityRechargeTime = {
		gale: 0,
		fury: 0
	};
	private isInHyruleCastle = false;
	private variables: MapOf<number> = {};

	// private korokData: KorokData = {};
	// private dupeKorok: string[] = [];

	private initialize(): void {
		this.sectionNumber = 1;
		this.lineNumber = 1;
		this.step = "1";
		this.korokCount = 0;
		//this.korokSeed = 0;
		this.shrineCount = 0;
		this.towerCount = 0;
		this.warpCount = 0;
		this.memoryCount = 0;
		this.talusCount = 0;
		this.hinoxCount = 0;
		this.moldugaCount = 0;
		this.abilityCount = {
			gale: 3,
			fury: 3
		};
		this.abilityUpgrade = {
			gale: false,
			fury: false
		};
		this.abilityRechargeTime = {
			gale: 0,
			fury: 0
		};
		this.isInHyruleCastle = false;
		
		this.variables = {};
		// this.korokData = newData();
		// this.dupeKorok = [];
	}

	public setSplitSetting(splitSetting: SplitTypeSetting<boolean>){
		this.splitSetting = splitSetting;
	}

	// private reportDebugInfo(location: string): void {
	// 	console.error({
	// 		line: this.lineNumber,
	// 		location,
	// 		snapshot: {...this}
	// 	});
	// }

	public compute(route: RouteAssemblySection[]): DocLine[] {
		this.initialize();
		const lines: DocLine[] = [];
		try{
			route.forEach(section=>this.computeSection(section, lines));
		}catch(e){
			console.error(e);
			lines.push({
				lineType: "DocLineBanner",
				text: new TypedStringSingle({
					content: "The Engine has encountered an error. Please check console logs",
					type: StringType.Normal
				}),
				bannerType: BannerType.Error,
				showTriangle: false,
				variables: {}
			});
		}
		
		return lines;
	}

	private computeSection(section: RouteAssemblySection, output: DocLine[]): void {
		if(section.name){
			output.push({
				lineType: "DocLineSection",
				sectionName: section.name,
				sectionNumber: this.sectionNumber
			});
			this.sectionNumber++;
			this.step = "1";
		}
		section.route.forEach(line=>this.computeAssembly(line, output));
	}

	private computeAssembly(data: RouteAssembly, output: DocLine[]): void {
		this.computeVariables(data.variableChange);
		this.processCommands(data.commands);
		if(data.bannerType !== undefined){
			output.push({
				lineType: "DocLineBanner",
				text: data.text,
				bannerType: data.bannerType,
				showTriangle: !!data.bannerTriangle,
				variables: {...this.variables}
			});
			return;
		}
		
		this.computeNonBannerStep(data, output);
	}

	private computeNonBannerStep(data: RouteAssembly, output: DocLine[]): void {
		let step: string | undefined = undefined;
		const error = new Set<string>();

		let galeText = "?";
		if(data.gale){
			galeText = this.processAbilityUsage("gale", data.gale, error);
		}
		let furyText = "?";
		if(data.fury){
			furyText = this.processAbilityUsage("fury", data.fury, error);
		}

		const time = data.timeOverride ?? this.estimateTime(!!data.isStep, data.splitType, data.text);
		this.processAbilityRecharge(time);

		if(data.isStep){
			step = this.step;
			this.incStep();
		}
		
		const common = {
			text: this.applyAbilityTextBlock(data.text, furyText, galeText, error),
			lineNumber: String(this.lineNumber),
			stepNumber: step,
			movements: data.movements || [],
			notes: this.applyAbilityTextBlockOptional(data.notes, furyText, galeText, error),
			variables: {...this.variables}
		};

		if(!data.icon){
			output.push({
				...common,
				lineType: "DocLineText",
			});
		}else{
			// counter
			let counter = "";
			switch(data.splitType){
				case SplitType.Shrine:
					this.shrineCount++;
					counter = String(this.shrineCount);
					if(this.splitSetting[SplitType.Shrine]){
						this.step = "1";
					}
					break;
				case SplitType.Tower:
					this.towerCount++;
					counter = ROMAN_NUMERAL[this.towerCount];
					if(this.splitSetting[SplitType.Tower]){
						this.step = "1";
					}
					break;
				case SplitType.Korok:
					this.korokCount++;
					//this.korokSeed++;
					counter = String(this.korokCount);
					if(this.splitSetting[SplitType.Korok]){
						this.step = "1";
					}
					break;
				case SplitType.Warp:
					this.warpCount++;
					counter = String(this.warpCount);
					if(this.splitSetting[SplitType.Warp]){
						this.step = "1";
					}
					break;
				case SplitType.Memory:
					this.memoryCount++;
					counter = ROMAN_NUMERAL[this.memoryCount];
					if(this.splitSetting[SplitType.Memory]){
						this.step = "1";
					}
					break;
				case SplitType.Hinox:
					this.hinoxCount++;
					counter = String(this.hinoxCount);
					if(this.splitSetting[SplitType.Hinox]){
						this.step = "1";
					}
					break;
				case SplitType.Talus:
					this.talusCount++;
					counter = String(this.talusCount);
					if(this.splitSetting[SplitType.Talus]){
						this.step = "1";
					}
					break;
				case SplitType.Molduga:
					this.moldugaCount++;
					counter = String(this.moldugaCount);
					if(this.splitSetting[SplitType.Molduga]){
						this.step = "1";
					}
					break;
			}

			common.variables.SRN = this.shrineCount;
			common.variables.KRK = this.korokCount;

			output.push({
				...common,
				lineType: "DocLineTextWithIcon",
				icon: data.icon,
				comment: this.applyAbilityTextBlockOptional(data.comment, furyText, galeText, error),
				
				counterValue: counter,
				splitType: data.splitType,
				mapLineColor: data.lineColor,
				hideIconOnMap: data.hideIconOnMap
			});
		}
		
		this.lineNumber++;

		error.forEach(e=>{
			output.push({
				lineType: "DocLineBanner",
				bannerType: BannerType.Error,
				showTriangle: true,
				text: new TypedStringSingle({content: e, type: StringType.Normal})
			});
		});
	}

	private computeVariables(variables?: MapOf<number>): void {
		if(!variables){
			return;
		}
		for(const key in variables){
			if(!(key in this.variables)){
				this.variables[key] = 0;
			}
			this.variables[key]+=variables[key];
		}
	}

	// private computeInstructions(route: RouteAssemblySection[]):DocLine[] {
	// 	//Fill empty line after each split
	// 	const filledInput:InstructionPacket[] = [];
	// 	input.forEach((line, i)=>{
	// 		filledInput.push(line);
	// 		if(line.type==="split" && i < input.length - 1 && input[i+1].type !== "split"){
	// 			filledInput.push({text:""});
	// 		}
	// 	});
	// 	const output: InstructionData[] = [];
	// 	filledInput.forEach((_, i)=>this.processInstruction(filledInput, i, output));
	// 	const missingKoroks = getMissingKoroks(this.korokData);

	// 	if(this.dupeKorok.length !== 0){
	// 		const dupeKorokInstructions: InstructionLike[] = [
	// 			"Duplicate Koroks"
	// 		];
	// 		this.dupeKorok.forEach(id=>{
	// 			const korok = Koroks[id as keyof typeof Koroks] as InstructionPacketWithExtend; 
	// 			dupeKorokInstructions.push(korok.extend({comment: "Duplicated"}));
	// 		});

	// 		const mappedInstructions = dupeKorokInstructions.map(instructionLikeToInstructionPacket);
	// 		mappedInstructions.forEach((_, i)=>this.processInstruction(mappedInstructions, i, output));
	// 	}
		
	// 	if(missingKoroks.length !== 0){
	// 		const missingKorokInstructions: InstructionLike[] = [
	// 			"Missing Koroks"
	// 		];
	// 		missingKoroks.forEach(id=>{
	// 			const korok = Koroks[id as keyof typeof Koroks] as InstructionPacketWithExtend; 
	// 			missingKorokInstructions.push(korok.extend({comment: "Missing"}));
	// 		});

	// 		const mappedInstructions = missingKorokInstructions.map(instructionLikeToInstructionPacket);
	// 		mappedInstructions.forEach((_, i)=>this.processInstruction(mappedInstructions, i, output));
	// 	}

	// 	return output;
	// }

	// private processInstruction(input: InstructionPacket[], i:number, output: InstructionData[]) {
	// 	if(input[i].type === "section"){
	// 		// No need to process anything if it's a section title
	// 		output.push({
	// 			isSectionTitle: true,
	// 			isSplit: false,
	// 			isKorok: false,
	// 			isImportant: true,
	// 			text: textLikeToTextBlock(input[i].text),
	// 			variables: {},
	// 		});
	// 		this.step = "1";
	// 		this.noDetailYet = true;
	// 		this.noImageYet = true;
	// 	}else{
	// 		this.processNoneSectionTitle(input, i, output);
	// 	}
	// }
	// private processNoneSectionTitle(input: InstructionPacket[], i:number, output: InstructionData[]): void {
	// 	const data = input[i];
	// 	const debugEnable = this.hasCommand(EngineCommands.Debug, data.command);
	// 	if(this.hasCommand(EngineCommands.EnableFuryPlus, data.command)){
	// 		this.enableFuryPlus = true;
	// 	}
	// 	if(this.hasCommand(EngineCommands.EnableGalePlus, data.command)){
	// 		this.enableGalePlus = true;
	// 	}
	// 	// Process variable change before text
	// 	if(data.variableChange){
	// 		this.processVariableChange(data.variableChange);
	// 	}
	// 	if(debugEnable){
	// 		this.reportDebugInfo("Initial");
	// 	}
	// 	const error = new Set<EngineError>();
	// 	let furyText = "?";
	// 	let galeText = "?";
	// 	if(data.ability){
	// 		[galeText, furyText] = this.processAbilityUsage(data.ability, error);
	// 	}
	// 	if(debugEnable){
	// 		this.reportDebugInfo("After Ability Usage");
	// 	}

	// 	const dataCommentRaw = data.comment && data.icon ? textLikeToTextBlock(data.comment) : undefined;
	// 	const dataTextRaw = textLikeToTextBlock(data.text);
	// 	const dataComment = this.applyAbilityTextBlock(dataCommentRaw, furyText, galeText, error);
	// 	const dataText = this.applyAbilityTextBlock(dataTextRaw, furyText, galeText, error);

	// 	// Process error suppression
	// 	const warnings: EngineError[] = [];
	// 	if(data.suppressError){
	// 		data.suppressError.forEach(suppressedError=>{
	// 			if(error.has(suppressedError)){
	// 				error["delete"](suppressedError);
	// 				warnings.push(suppressedError);
	// 			}
	// 		});
	// 	}

	// 	let lineNumberClassName = "";
	// 	let errorText = undefined;
	// 	let warningText = undefined;
	// 	if(error.size > 0){
	// 		lineNumberClassName = "indicator-color-error";
	// 		errorText = " ERROR: "+ Array.from(error).map(e=>EngineErrorStrings[e]).join(", ");
	// 	}else if(warnings.length > 0){
	// 		lineNumberClassName = "indicator-color-warning";
	// 		warningText = " WARNING: "+ warnings.map(e=>EngineErrorStrings[e]).join(", ");
	// 	}

	// 	const props: InstructionData = {
	// 		isSectionTitle: false,
	// 		isSplit: data.type === "split",
	// 		isKorok: !!data.korokCode,
	// 		isImportant: !!data.important,
	// 		splitPrefix: data.splitPrefix ? textLikeToTextBlock(data.splitPrefix) : undefined,
	// 		lineNumber: this.lineNumber,
	// 		lineNumberClassName,
	// 		text: dataText,
	// 		icon: data.icon,
	// 		comment: dataComment,
	// 		variables: {
	// 			...this.variables,
	// 			krk: this.korokCount,
	// 			seed: this.korokSeed,
	// 			srn: this.shrineCount,
	// 			fury: this.fury,
	// 			gale: this.gale
	// 		},
	// 		errors: errorText,
	// 		warnings: warningText
	// 	};

	// 	this.processStepOrSplit(data.type, props);
		
	// 	this.processAbilityRecharge(data.type === "step", data.timeOverride);
	// 	if(debugEnable){
	// 		this.reportDebugInfo("After Ability Recharge");
	// 	}

	// 	if(data.shrineChange){
	// 		this.processShrineChange(data.shrineChange, dataText, props);
	// 	}

	// 	if(data.korokChange){
	// 		this.processKorokChange(data.korokChange, dataText, props, data.korokCode);
	// 	}

	// 	if(data.memoryChange){
	// 		this.memoryCount+= data.memoryChange;
	// 		props.counterNumber = MEMORY_ROMAN[this.memoryCount];
	// 		props.counterClassName = "counter-color-memory";
	// 	}

	// 	if(data.bossType){
	// 		switch(data.bossType){
	// 			case "Talus":
	// 				this.talusCount++;
	// 				props.counterNumber  = String(this.talusCount);
	// 				props.counterClassName = "counter-color-boss";
	// 				break;
	// 			case "Hinox":
	// 				this.hinoxCount++;
	// 				props.counterNumber  = String(this.hinoxCount);
	// 				props.counterClassName = "counter-color-boss";
	// 				break;
	// 		}
	// 	}

	// 	output.push(props);
	// 	this.lineNumber++;
	// 	if(data.icon){
	// 		this.lineNumber++;
	// 	}
	// }

	private processAbilityUsage(abilityName: "gale" | "fury", useCount: number, error: Set<string>): string{
		let recharge = BASE_ABILITY_RECHARGE[abilityName];
		if(this.abilityUpgrade[abilityName]){
			recharge /= 3;
		}
		if(this.isInHyruleCastle){
			recharge /= 3;
		}
		let text = "?";
		
		if(this.abilityCount[abilityName] === 0){
			if(this.abilityRechargeTime[abilityName] < recharge){
				error.add(`Error: Ability might not be recharged. Time needed to recharge is ${recharge}. Estimated time passed is ${this.abilityRechargeTime[abilityName]}`);
			}
			this.abilityRechargeTime[abilityName] = 0;
			this.abilityCount[abilityName] = 3;
		}

		if(useCount > this.abilityCount[abilityName]){
			error.add(`Error: Doesn't have enough ${abilityName}. Need ${useCount}, has ${this.abilityCount[abilityName]}`);

		}else{
			text = this.getAbilityChangeText(this.abilityCount[abilityName], useCount);
			this.abilityCount[abilityName] -= useCount;
			if(this.abilityCount[abilityName] === 0){
				this.abilityRechargeTime[abilityName] = 0;
			}
		}
		
		return text;
	}

	private estimateTime(isStep: boolean, splitType: SplitType, text: TypedString): number {
		// Count how many .dir blocks. Usually they are wbs and takes 10 seconds-ish
		let wbCount = 0;
		text.forEach(({type})=>{
			if (type === StringType.Direction){
				wbCount++;
			}
		});

		let estimate = wbCount * 14;

		if(splitType !== SplitType.None){
			estimate += 3; // Add 3 seconds of running
		}

		if(isStep){
			estimate += 3; // Add 3 seconds to reposition/run + aim before wb
		}

		return estimate;
	}

	private processAbilityRecharge(time: number): void {

		if(this.abilityCount.gale === 0){
			this.abilityRechargeTime.gale += time;
		}
		if(this.abilityCount.fury === 0){
			this.abilityRechargeTime.fury += time;
		}
	}

	private processCommands(commands?: RouteCommand[]): void {
		if(!commands){
			return;
		}
		if(this.hasCommand(RouteCommand.ToggleHyruleCastle, commands)){
			if(this.isInHyruleCastle){
				this.updateRechargeTimeForDowngrade("fury");
				this.updateRechargeTimeForDowngrade("gale");
			}else{
				this.updateRechargeTimeForUpgrade("fury");
				this.updateRechargeTimeForUpgrade("gale");
			}
			this.isInHyruleCastle = !this.isInHyruleCastle;
		}
		if(this.hasCommand(RouteCommand.EnableFuryPlus, commands)){
			if(!this.abilityUpgrade.fury){
				this.updateRechargeTimeForUpgrade("fury");
				this.abilityUpgrade.fury = true;
			}
		}
		if(this.hasCommand(RouteCommand.EnableGalePlus, commands)){
			if(!this.abilityUpgrade.gale){
				this.updateRechargeTimeForUpgrade("gale");
				this.abilityUpgrade.gale = true;
			}
		}
	}

	private updateRechargeTimeForUpgrade(ability: "gale" | "fury"): void{
		this.abilityRechargeTime[ability] /= 3;
	}

	private updateRechargeTimeForDowngrade(ability: "gale" | "fury"): void {
		this.abilityRechargeTime[ability] *= 3;
	}

	// private processShrineChange(shrineChange: number, text: TextLike, props: InstructionData): void{
	// 	this.shrineCount += shrineChange;
	// 	if(this.korokCount===0){
	// 		props.text = txt(lcn(`${this.shrineCount} `),text);
	// 	}else{
	// 		props.text = txt(lcn(`${this.shrineCount}.${this.getKorokCountLastTwoDigits()} `), text);
	// 	}
	// 	props.counterNumber = String(this.shrineCount);
	// 	props.counterClassName = "counter-color-shrine";
	// }

	// private processKorokChange(korokChange: number, text: TextLike, props: InstructionData, korokCode?: string): void{
	// 	if(korokCode){
	// 		if(hasKorok(this.korokData, korokCode)){
	// 			this.dupeKorok.push(korokCode);
	// 		}else{
	// 			addKorok(this.korokData, korokCode);
	// 		}
	// 	}
	// 	if(korokChange > 0){
	// 		this.korokCount += korokChange;
	// 		this.korokSeed += korokChange;
	// 		props.text = txt(npc(`${this.getKorokSeedLastTwoDigits()} `),text);
	// 		props.counterNumber = String(this.korokCount);
	// 		props.counterClassName = "counter-color-korok";
	// 	}else{
	// 		this.korokSeed += korokChange;//Hestu only takes seed, not total count
	// 		props.text = txt(npc(`${this.getKorokSeedLastTwoDigits()} `),text);
	// 	}
	// }

	private incStep():void {
		if(this.step === "Z"){
			this.step = "0";
		}else if(this.step === "9"){
			this.step = "A";
		}else{
			this.step = String.fromCharCode(this.step.charCodeAt(0)+1);
		}
	}

	private hasCommand(find: RouteCommand, commands: RouteCommand[]): boolean {
		return commands.filter(e=>e===find).length>0;
	}

	// private getKorokCountLastTwoDigits(): string {
	// 	return this.getLastTwoDigits(this.korokCount);
	// }

	// private getKorokSeedLastTwoDigits(): string {
	// 	return this.getLastTwoDigits(this.korokSeed);
	// }

	// private getLastTwoDigits(value: number): string {
	// 	if(value<10){
	// 		return String(value);
	// 	}
	// 	const mod100 = value % 100;
	// 	if(mod100 < 10){
	// 		return "0" + mod100;
	// 	}
	// 	return String(mod100);
	// }

	private getAbilityChangeText(current: number, use: number): string{
		if(current === 3){
			if(use === 1){
				return "1";
			}
			return `1-${use}`;
		}
		if(current === 2){
			if(use === 1){
				return "2";
			}
			return "2-3";
		}
		return "3";
	}

	private applyAbilityTextBlockOptional(textBlock: TypedString | undefined | null, furyText: string, galeText: string, errorOut: Set<string>): TypedString | undefined {
		if(!textBlock){
			return undefined;
		}
		return this.applyAbilityTextBlock(textBlock, furyText, galeText, errorOut);
	}

	private applyAbilityTextBlock(textBlock: TypedString, furyText: string, galeText: string, errorOut: Set<string>): TypedString {
		const newBlocks = textBlock.map(({content, type})=>{
			if(type === StringType.Fury){
				if(furyText==="?"){
					errorOut.add("Error: Text include fury but the number of furies is not specified");
				}
				return new TypedStringSingle({
					content: "FURY "+furyText,
					type
				});
			}
			if(type === StringType.Gale){
				if(galeText==="?"){
					errorOut.add("Error: Text include gale but the number of gales is not specified");
				}
				return new TypedStringSingle({
					content: "GALE "+galeText,
					type
				});
			}
			return new TypedStringSingle({
				content,
				type
			});
		});
		if(newBlocks.length === 1){
			return newBlocks[0];
		}
		return new TypedStringBlock(newBlocks);
	}
}
