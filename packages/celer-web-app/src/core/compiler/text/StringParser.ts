import { nonnull } from "data/util";
import { BannerType } from "../types";
import { TypedString, StringType, TypedStringBlock, TypedStringSingle  } from "./TypedString";
import { tokenize } from "./tokenize";

const FuncMap = {
	"item": StringType.Item,
	"loc": StringType.Location,
	"npc": StringType.Npc,
	"rune": StringType.Rune,
	"boss": StringType.Boss,
	"enemy": StringType.Enemy,
	"dir": StringType.Direction,
	"link": StringType.Link,
	"v": StringType.Variable,
	"!!": StringType.Important,
	"gale": StringType.Gale,
	"fury": StringType.Fury,
	"code": StringType.Code
};

class StringParser {
	public convertToTypedString(str: string): TypedString {
		return new TypedStringSingle({
			content: str,
			type: StringType.Normal
		});
	}

	public parseStringBlockSimple(str: string): TypedString {
		return this.parseStringBlock(str).typedString;
	}

	public parseStringBlock(str: string): StringParseData {
		const [ content, header ] = this.parseStringHeader(str);

		const typedString = this.parseStringFunctions(content);
		return {
			header,
			typedString
		};
	}

	private parseStringHeader(str: string): [string, StringHeader]{
		const isStep = str.startsWith("+");
		if(isStep){
			str = str.substring(1).trimStart();
		}
		const bannerError = str.startsWith("(!=)") || str.startsWith("(^!)");
		const bannerWarning = str.startsWith("(?=)") || str.startsWith("(^?)");
		const bannerTriangle = str.startsWith("(^=)") || str.startsWith("(^!)") || str.startsWith("(^?)");
		const bannerNormal = str.startsWith("(==)") || str.startsWith("(^=)");
        
		if(bannerError || bannerWarning || bannerTriangle || bannerNormal){
			str = str.substring(4).trimStart();
		}

		let banner: Partial<StringHeader> = {};
		if(bannerError){
			banner = {
				bannerType: BannerType.Error,
				bannerTriangle
			};
		}else if(bannerWarning){
			banner = {
				bannerType: BannerType.Warning,
				bannerTriangle
			};
		}else if(bannerNormal){
			banner = {
				bannerType: BannerType.Notes,
				bannerTriangle
			};
		}
		return [str, {isStep, ...banner}];
	}

	private parseStringFunctions(str: string): TypedString{
		// Ensure string is not empty
		if(str === ""){
			return this.convertToTypedString("");
		}
		// Text => NormalText TextStar
		// Text => FunctionText TextStar
		// TextStar => NormalText TextStar | epsilon
		// TextStar => FunctionText TextStar
		// FunctionText = . <identifier> ( TextStar )
		// NormalText => <identifier>

		// Tokenize first
		const tokens = tokenize(str, /[.()]/);

		const typeStack: StringType[] = [];
		const blocks: TypedStringSingle[] = [];
		let currentType = StringType.Normal;
		let escaping = false;
		for(let i = 0; i<tokens.length;i++){
			const token = tokens[i];
            
			if(token === "." && i<tokens.length-1 && tokens[i+1] === "("){
				// .( for escaping ..)
				if(escaping){
					this.appendText(blocks, currentType, token);
					continue;
				}
				escaping = true;
				i = i + 1;
			}else if(token === "." && i<tokens.length-2 && tokens[i+1] === "." && tokens[i+2] === ")"){
				//  ..) to end escaping
				if(!escaping){
					this.appendText(blocks, currentType, token);
					continue;
				}
				escaping = false;
				i = i + 2;
			}else if(token === "." && i<tokens.length-3 && tokens[i+2] === "("){
				//Need at least 3 more tokens to process a function: . name ( )
				if(escaping){
					this.appendText(blocks, currentType, token);
					continue;
				}
				const funcName = tokens[i+1];
				if(funcName in FuncMap){
					const type = FuncMap[funcName as keyof typeof FuncMap];
					typeStack.push(currentType);
					currentType = type;
					//Special case for fury/gale, because they accept 0 args
					//Need to detect this case and push a block with empty string
					if(tokens[i+3]===")" && (currentType === StringType.Fury || currentType === StringType.Gale)){
						this.appendText(blocks, currentType, "");
					}
				}else{
					this.appendText(blocks, currentType,  `.${funcName}(`);
				}
				i = i + 2;
			}else if(token === ")"){
				if(escaping){
					this.appendText(blocks, currentType, token);
					continue;
				}
				if(typeStack.length > 0){
					currentType = nonnull(typeStack.pop());
				}else{
					this.appendText(blocks, currentType, ")");
				}
			}else{
				this.appendText(blocks, currentType, token);
			}

		}

		// Small optimization
		// At least one block since empty string case is already handled
		if(blocks.length === 1) {
			return blocks[0];
		}else{
			return new TypedStringBlock(blocks);
		}
	}

	private appendText(blocks: TypedStringSingle[], type: StringType, content: string) {
		if(blocks.length > 0 && blocks[blocks.length-1].getType() === type) {
			blocks[blocks.length-1] = new TypedStringSingle({type, content: blocks[blocks.length-1].toString() + content});
			return;
		}
		blocks.push(new TypedStringSingle({type, content}));

	}

}

type StringHeader = {
    isStep: boolean,
    bannerType?: BannerType,
    bannerTriangle?: boolean,
}

type StringParseData = {
    header: StringHeader,
    typedString: TypedString
}

export default new StringParser();
