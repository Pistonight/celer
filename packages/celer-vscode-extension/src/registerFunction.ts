import * as vscode from "vscode";

let registered = false;

const functionCompletionItems: vscode.CompletionItem[] = [];
// item loc npc rune boss enemy code dir !! v gale fury link
const registerFunctions = (): void => {
	registerFunction("dir", "Direction", "A direction string either in the compass or clock format (XX:XX). If it's a valid clock or supported compass format, it can be automatically converted between the two modes");
	registerFunction("item", "Item", "String with item color");
	registerFunction("loc", "Location", "String with location color");
	registerFunction("npc", "NPC", "String with NPC color");
	registerFunction("rune", "Rune", "String with rune color");
	registerFunction("boss", "Boss", "String with overworld boss color");
	registerFunction("enemy", "Enemy", "String with enemy color");
	registerFunction("code", "Code", "String in a monospace font");
	registerFunction("!!", "Important", "String with \"important\" color");
	registerFunction("v", "Variable", "The content will be treated as the variable name and the value of the variable is interpolated into the string when rendering");
	registerFunction("gale", "Gale", "The content of the string will be ignored and the gale usage will be inserted into the string based on the \"gale\" property");
	registerFunction("fury", "Fury", "The content of the string will be ignored and the fury usage will be inserted into the string based on the \"fury\" property");
	registerFunction("link", "Link", "The text will be a clickable link. If the text is formatted like \"[text]www.example.com\", then the content inside the square brackets (\"[\" and \"]\") will be the link text");
	registered = true;
};

const registerFunction = (name: string, description: string, documentation: string): void => {
	const functionCompletionItem = new vscode.CompletionItem(name);
	functionCompletionItem.kind = vscode.CompletionItemKind.Function;
	functionCompletionItem.detail = `(function) ${description}`;
	functionCompletionItem.documentation = documentation;
	functionCompletionItems.push(functionCompletionItem);
};

export const getFunctionCompletionItem = (): vscode.CompletionItem[] => {
	if(!registered){
		registerFunctions();
	}
	return functionCompletionItems;
};
