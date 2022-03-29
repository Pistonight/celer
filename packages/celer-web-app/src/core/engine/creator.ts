export {};// import { wbex } from "./windbomb";
// import { stringToText, instructionLikeToInstructionPacket } from "./convert";
// import { cps, lcn, npc, txt, v, itm, emy, bss } from "./strings";
// import { InstructionLike, InstructionPacket, TextLike } from "../../data/assembly/types";

// export const SPLIT = "split" as const;
// export const STEP = "step" as const;

// export type InstructionPacketWithExtend = InstructionPacket &{
//     extend: (extra: Partial<InstructionPacket>)=>InstructionPacket
// }

// export const addExtend = (instruction: InstructionPacket): InstructionPacketWithExtend => {
// 	const instructionWithExtend = instruction as InstructionPacketWithExtend;
// 	instructionWithExtend.extend = (extra)=>({...instruction, ...extra});
// 	return instructionWithExtend;
// };

// export const Ingredient = (text: TextLike, material: TextLike, comment?: TextLike): InstructionPacketWithExtend => {
// 	return addExtend({
// 		icon: "item",
// 		text: itm(text),
// 		comment: txt(material, " ", comment ?? ""),
// 	});
// };

// export const setImportant = (... inst: InstructionLike[]): InstructionLike[] => {
// 	return inst.map(i=>({
// 		...instructionLikeToInstructionPacket(i),
// 		important: true
// 	}));
// };

// const WB_STEP_ESTIMATE = 15;

// export const WindbombStepCps = (movement: string): InstructionPacketWithExtend => {
// 	const [wbCount, textBlock] = wbex(cps)(movement);
// 	return addExtend({
// 		type: STEP,
// 		text: textBlock,
// 		timeOverride: WB_STEP_ESTIMATE * wbCount
// 	}); 
// };

// export const Boss = (type:string, comment?: TextLike):InstructionPacketWithExtend => {
// 	return  addExtend({
// 		icon: bossTypeToIcon(type),
// 		text: bss(type),
// 		comment,
// 		bossType: bossTypeToCounter(type)
// 	});
// };

// const bossTypeToIcon = (type:string):string => {
// 	switch(type){
// 		case "Red Hinox": return "hinox-red";
// 		case "Blue Hinox": return "hinox-blue";
// 		case "Black Hinox": return "hinox-black";
// 		case "Stalnox": return "hinox-stal";
// 		case "Molduga": return "molduga";
// 		case "Stone Talus": return "talus";
// 		case "Rare Talus": return "talus-rare";
// 		case "Luminous Talus": return "talus-luminous";
// 		case "Igneo Talus": return "talus-igneo";
// 		case "Frost Talus": return "talus-frost";
// 		case "Molduking":
// 		case "Igneo Talus Titan":
// 			return "bossdlc";
// 		default: return "";
// 	}
// };

// const bossTypeToCounter = (type:string):string => {
// 	switch(type){
// 		case "Red Hinox": 
// 		case "Blue Hinox": 
// 		case "Black Hinox": 
// 		case "Stalnox": 
// 			return "Hinox";
// 		case "Stone Talus": 
// 		case "Rare Talus": 
// 		case "Luminous Talus": 
// 		case "Igneo Talus": 
// 		case "Frost Talus": 
// 			return "Talus";
// 		default: return "";
// 	}
// };
