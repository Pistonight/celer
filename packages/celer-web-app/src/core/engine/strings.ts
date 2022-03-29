export {};// import { stringToText } from "./convert";
// import { Text, TextLike, TextBlock } from "../../data/assembly/types";

// const textHelper = (t: TextLike[], color?: string): TextBlock => {
// 	if(t.length === 0){
// 		return stringToText("", color);
// 	}
// 	const output:Text[] = [];
// 	t.forEach(block=>{
// 		if(typeof block === "string"){
// 			output.push(stringToText(block, color));
// 		}else if(Array.isArray(block)){
// 			block.forEach(b=>output.push({
// 				colorClass: b.colorClass ?? color,
// 				content: b.content
// 			}));
// 		}else{
// 			output.push({
// 				colorClass: block.colorClass ?? color,
// 				content: block.content
// 			});
// 		}
// 	});
// 	if(output.length===1){
// 		return output[0];
// 	}
// 	return output;
// };

// export const txt = (...t: TextLike[]):TextBlock => textHelper(t);
// export const itm = (...t: TextLike[]):TextBlock => textHelper(t, "color-item");
// export const lcn = (...t: TextLike[]):TextBlock => textHelper(t, "color-location");
// export const npc = (...t: TextLike[]):TextBlock => textHelper(t, "color-npc");
// export const rne = (...t: TextLike[]):TextBlock => textHelper(t, "color-rune");
// export const bss = (...t: TextLike[]):TextBlock => textHelper(t, "color-boss");
// export const emy = (...t: TextLike[]):TextBlock => textHelper(t, "color-enemy");
// export const cps = (t: string):TextBlock => textHelper([t], "color-direction-compass");
// export const clk = (t: string):TextBlock => textHelper([t], "color-direction-clock");
// export const lnk = (t: string):TextBlock => textHelper([t], "color-link");
// export const sm = (...t: TextLike[]):TextBlock => textHelper(t, "color-sm");
// export const bg = (...t: TextLike[]):TextBlock => textHelper(t, "color-bg");
// export const v = (t: string):TextBlock => textHelper([t], "color-variable");
// export const important= (...t: TextLike[]):TextBlock => textHelper(t, "color-important");
// export const gale = ():TextBlock => textHelper([""], "color-gale");
// export const fury = ():TextBlock => textHelper([""], "color-fury");

// export const renderTextBlock = (text: TextBlock, variables: {[key:string]: number}): string => {
// 	if(Array.isArray(text)){
// 		return text.map(t=>renderText(t,variables)).join("");
// 	}
// 	return renderText(text, variables);
// };

// const renderText = (text: Text, variables: {[key:string]: number}): string => {
// 	if(text.colorClass === "color-variable"){
// 		return String(variables[text.content]);
// 	}
// 	return text.content;
// };

// export const ingredient = (key: string, total: number): TextBlock=>{
// 	return txt(v(key), "/", String(total));
// };
