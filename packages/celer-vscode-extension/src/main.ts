import * as vscode from 'vscode';
import { getFunctionCompletionItem } from './registerFunction';
import { getPrefixCompletionItems, getPresetCompletionItems } from './registerPreset';

export function activate(context: vscode.ExtensionContext) {


	const UnderscoreProvider = vscode.languages.registerCompletionItemProvider({language: "celer"}, {

		provideCompletionItems(document: vscode.TextDocument, position: vscode.Position) {

			const linePrefix = document.lineAt(position).text.substring(0, position.character);
			if(linePrefix.endsWith("_")){
				return getPresetCompletionItems();
			}
			return undefined;
		},
		
	},"_");

	const ColonProvider = vscode.languages.registerCompletionItemProvider(
		{language: "celer"},
		{
			provideCompletionItems(document: vscode.TextDocument, position: vscode.Position) {

				const linePrefix = document.lineAt(position).text.substring(0, position.character);
				return getPrefixCompletionItems(linePrefix);

			}
		},
		":"
	);

	const FunctionProvider = vscode.languages.registerCompletionItemProvider(
		{language: "celer"},
		{
			provideCompletionItems(document: vscode.TextDocument, position: vscode.Position) {

				const linePrefix = document.lineAt(position).text.substring(0, position.character);
				if(!linePrefix.endsWith(".")){
					return undefined;
				}
				return getFunctionCompletionItem();
			}
		},
		'.' // triggered whenever a '.' is being typed
	);

	context.subscriptions.push(UnderscoreProvider, ColonProvider, FunctionProvider);
}
