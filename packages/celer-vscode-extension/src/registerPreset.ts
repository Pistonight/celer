import * as vscode from 'vscode';
import { BossPreset } from './presets/Boss';
import { ChestPreset } from './presets/Chest';
import { EquipmentPreset } from './presets/Equipment';
import { KorokPreset } from './presets/Korok';
import { MemoryPreset } from './presets/Memory';
import { NpcPreset } from './presets/Npc';
import { CelerPreset } from "./presets/Preset";
import { ShrinePreset } from './presets/Shrine';
import { SimplePreset } from './presets/Simple';
import { SnapPreset } from './presets/Snap';
import { TodPreset } from './presets/Tod';
import { TowerPreset } from './presets/Tower';
import { WarpPreset } from './presets/Warp';

let registered = false;
const prefixCompletionItemMap: {[prefix: string]: vscode.CompletionItem[]} = {};
const presetCompletionItems: vscode.CompletionItem[] = [];

const registerPresets = (): void => {
    registerPreset(new ShrinePreset());
    registerPreset(new TowerPreset());
    registerPreset(new MemoryPreset());
    registerPreset(new BossPreset());
    registerPreset(new WarpPreset());
    registerPreset(new TodPreset());
    registerPreset(new KorokPreset());
    registerPreset(new EquipmentPreset());
    registerPreset(new ChestPreset());
    registerPreset(new SimplePreset("Material", "Parameterized preset for materials. First parameter is the display name of the material. Second optional parameter is the number of materials acquired. If the number is provided, the engine also adds it to the variable whose name is the display name without spaces or special characters"));
    registerPreset(new SimplePreset("Shop", "Parameterized preset for shops"));
    registerPreset(new SimplePreset("Cook", "Parameterized preset for cooking"));
    registerPreset(new SimplePreset("Discover", "Parameterized preset for missable locations"));
    registerPreset(new SnapPreset());
    registerPreset(new NpcPreset());
    registered = true;
}

const registerPreset = (preset: CelerPreset): void => {
	const primaryClass = preset.getPrimaryClass();
	const completionItem = new vscode.CompletionItem(`_${primaryClass}`);
	completionItem.kind = vscode.CompletionItemKind.Class;
    if (preset.hasMember()){
        completionItem.insertText=`${primaryClass}::`;
    }else{
        completionItem.insertText=primaryClass;
    }
	
	completionItem.detail=`(Preset) ${primaryClass}`;
    completionItem.documentation = preset.getDocumentation();
	completionItem.command = { command: 'editor.action.triggerSuggest', title: 'Re-trigger completions...' };
	presetCompletionItems.push(completionItem);

	preset.registerEnums((name, description, subclass, isSubNamespace)=>{
		if(subclass){
            addPrefixCompletionItem(`${primaryClass}::${subclass}::`, name, description, !!isSubNamespace);
            addPrefixCompletionItem(`${primaryClass}::`, `${subclass}::${name}`, description, !!isSubNamespace);
		}else{
            addPrefixCompletionItem(`${primaryClass}::`, name, description, !!isSubNamespace);
		}
	});
};

const addPrefixCompletionItem = (prefix: string, name: string, description: string, isSubNamespace: boolean): void => {
    if(!(prefix in prefixCompletionItemMap)){
        prefixCompletionItemMap[prefix] = [];
    }
    const enumCompletionItem = new vscode.CompletionItem(name);
    enumCompletionItem.kind = isSubNamespace ? vscode.CompletionItemKind.Class : vscode.CompletionItemKind.EnumMember;
    enumCompletionItem.detail=description;
    prefixCompletionItemMap[prefix].push(enumCompletionItem);
};

export const getPresetCompletionItems = (): vscode.CompletionItem[] => {
    if(!registered){
        registerPresets();
    }
    return presetCompletionItems;
}

export const getPrefixCompletionItems = (line: string): vscode.CompletionItem[] | undefined => {
    if(!registered){
        registerPresets();
    }
    for(const prefix in prefixCompletionItemMap){
        if(line.endsWith(prefix)){
            return prefixCompletionItemMap[prefix];
        }
    }
    return undefined;
}
