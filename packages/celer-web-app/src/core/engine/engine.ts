import {
	BannerType,
	RouteAssembly,
	RouteAssemblySection,
	SplitType,
	StringType,
	TypedString,
	TypedStringBlock,
	TypedStringSingle,
	RouteCommand,
} from "core/compiler";
import { DocLine } from "core/engine";
import { defaultSplitSetting, SplitTypeSetting } from "core/settings";
import { EngineConfig, EngineError } from "data/libs";
import { MapOf } from "data/util";
import { postProcessLines } from "./postprocess";

//Recharge time in seconds
const BASE_ABILITY_RECHARGE = {
	gale: 360,
	fury: 720
};

// Default estimate for each step is 20 seconds
// const STEP_ESTIMATE = 20;
const ROMAN_NUMERAL = ["","I","II","III","IV","V","VI","VII","VIII","IX","X","XI","XII","XIII","XIV","XV"];

//const ShrineFormat = "{{KRK}} {{Text}} {{SRN}}";
//const KorokFormat = "{{Seed}} {{ID}} {{Text}}";

enum ErrorAction {
	Ignore,
	Warn,
	Error
}

export class RouteEngine{
	// Engine configuration
	private splitSetting: SplitTypeSetting<boolean> = defaultSplitSetting;

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

	private config: EngineConfig = {};
	private errors: string[] = [];
	private warnings: string[] = [];

	private initialize(config: EngineConfig): void {
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
		this.config = config;
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

	public compute(route: RouteAssemblySection[], config: EngineConfig): DocLine[] {
		this.initialize(config);
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

		return postProcessLines(lines);
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
		this.errors = [];
		this.warnings = [];
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

		let galeText = "?";
		if(data.gale){
			galeText = this.processAbilityUsage(data, "gale", data.gale);
		}
		let furyText = "?";
		if(data.fury){
			furyText = this.processAbilityUsage(data, "fury", data.fury);
		}

		const time = data.timeOverride ?? this.estimateTime(!!data.isStep, data.splitType, data.text);
		this.processAbilityRecharge(time);

		if(data.isStep){
			step = this.step;
			this.incStep();
		}
		if(data.variableChange){
			for (const key in data.variableChange){
				if(this.variables[key] < 0){
					this.addError(data, EngineError.NegativeVar, `Variable "${key}" has a negative value`);
				}
			}
		}

		const common = {
			text: this.applyAbilityTextBlock(data, data.text, furyText, galeText),
			lineNumber: String(this.lineNumber),
			stepNumber: step,
			movements: data.movements || [],
			notes: this.applyAbilityTextBlockOptional(data, data.notes, furyText, galeText),
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

			// Legacy 3 letter variables
			common.variables = {
				...common.variables,
				SRN: this.shrineCount,
				KRK: this.korokCount,
				Shrine: this.shrineCount,
				Korok: this.korokCount,
				Tower: this.towerCount,
				Warp: this.warpCount,
				Talus: this.talusCount,
				Hinox: this.hinoxCount,
				Molduga: this.moldugaCount
			};

			output.push({
				...common,
				lineType: "DocLineTextWithIcon",
				icon: data.icon,
				comment: this.applyAbilityTextBlockOptional(data, data.comment, furyText, galeText),
				counterValue: counter,
				splitType: data.splitType,
				mapLineColor: data.lineColor,
				hideIconOnMap: data.hideIconOnMap
			});
		}

		this.lineNumber++;

		this.applyErrorAndWarnings(output);
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

	private processAbilityUsage(data: RouteAssembly, abilityName: "gale" | "fury", useCount: number): string{
		let recharge = BASE_ABILITY_RECHARGE[abilityName];
		if(this.abilityUpgrade[abilityName]){
			recharge /= 3;
		}
		if(this.isInHyruleCastle){
			recharge /= 3;
		}
		let text = "";

		if(this.abilityCount[abilityName] === 0){
			if(this.abilityRechargeTime[abilityName] < recharge){
				const errorType = abilityName === "gale" ? EngineError.GaleRecharge : EngineError.FuryRecharge;
				this.addError(data, errorType, `Ability might not be recharged. Time needed to recharge is ${recharge}. Estimated time passed is ${this.abilityRechargeTime[abilityName]}`);
			}
			this.abilityRechargeTime[abilityName] = 0;
			this.abilityCount[abilityName] = 3;
		}

		if(useCount > this.abilityCount[abilityName]){
			const errorType = abilityName === "gale" ? EngineError.GaleOveruse : EngineError.FuryOveruse;
			this.addError(data, errorType, `Doesn't have enough ${abilityName}. Need ${useCount}, has ${this.abilityCount[abilityName]}`);
			text = "?";
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
		if(commands.includes(RouteCommand.ToggleHyruleCastle)){
			if(this.isInHyruleCastle){
				this.updateRechargeTimeForDowngrade("fury");
				this.updateRechargeTimeForDowngrade("gale");
			}else{
				this.updateRechargeTimeForUpgrade("fury");
				this.updateRechargeTimeForUpgrade("gale");
			}
			this.isInHyruleCastle = !this.isInHyruleCastle;
		}
		if(commands.includes(RouteCommand.EnableFuryPlus)){
			if(!this.abilityUpgrade.fury){
				this.updateRechargeTimeForUpgrade("fury");
				this.abilityUpgrade.fury = true;
			}
		}
		if(commands.includes(RouteCommand.EnableGalePlus)){
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

	private incStep():void {
		if(this.step === "Z"){
			this.step = "0";
		}else if(this.step === "9"){
			this.step = "A";
		}else{
			this.step = String.fromCharCode(this.step.charCodeAt(0)+1);
		}
	}

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

	private applyAbilityTextBlockOptional(data: RouteAssembly, textBlock: TypedString | undefined | null, furyText: string, galeText: string): TypedString | undefined {
		if(!textBlock){
			return undefined;
		}
		return this.applyAbilityTextBlock(data, textBlock, furyText, galeText);
	}

	private applyAbilityTextBlock(data: RouteAssembly, textBlock: TypedString, furyText: string, galeText: string): TypedString {
		const newBlocks = textBlock.map(({content, type})=>{
			if(type === StringType.Fury){
				if(furyText===""){
					this.addError(data, EngineError.FuryUnspecified, "Text include fury but the number of furies is not specified");
				}
				return new TypedStringSingle({
					content: "FURY "+furyText,
					type
				});
			}
			if(type === StringType.Gale){
				if(galeText===""){
					this.addError(data, EngineError.GaleUnspecified, "Text include gale but the number of gales is not specified");
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

	private applyErrorAndWarnings(output: DocLine[]) {
		this.errors.forEach(e=>{
			output.push({
				lineType: "DocLineBanner",
				bannerType: BannerType.Error,
				showTriangle: true,
				text: new TypedStringSingle({content: "Error: "+e, type: StringType.Normal})
			});
		});

		this.warnings.forEach(e=>{
			output.push({
				lineType: "DocLineBanner",
				bannerType: BannerType.Warning,
				showTriangle: true,
				text: new TypedStringSingle({content: "Warning: "+e, type: StringType.Normal})
			});
		});
	}

	private addError(data: RouteAssembly, type: EngineError, text: string) {
		let action: ErrorAction | undefined = undefined;
		// config level precedence: step override > user override (in the future) > route default > engine default
		// step override
		if (data.suppress && data.suppress.includes(type)) {
			return;
		}

		// route default
		// config contains strings so need to convert them using enum mapping
		if(this.config.ignore && this.config.ignore.includes(EngineError[type] as keyof typeof EngineError)){
			return;
		}
		if (this.config.error && this.config.error.includes(EngineError[type] as keyof typeof EngineError)){
			action = action || ErrorAction.Error;
		}else if(this.config.warn && this.config.warn.includes(EngineError[type] as keyof typeof EngineError)){
			action = action || ErrorAction.Warn;
		}

		// engine default
		if (!action){
			switch(type){
				case EngineError.NegativeVar:
				case EngineError.FuryRecharge:
				case EngineError.GaleRecharge:
					action = ErrorAction.Warn;
					break;
				case EngineError.FuryOveruse:
				case EngineError.GaleOveruse:
				case EngineError.FuryUnspecified:
				case EngineError.GaleUnspecified:
					action = ErrorAction.Error;
					break;
			}
		}

		switch(action){
			case ErrorAction.Error:
				this.errors.push(text+` (${EngineError[type]})`);
				break;
			case ErrorAction.Warn:
				this.warnings.push(text+` (${EngineError[type]})`);
				break;
			default: break;
		}
	}

}
