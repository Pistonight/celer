import React, { useState } from "react";
import { Modal, View, ScrollView, Text, TouchableOpacity } from "react-native";
import { getInterpolationFunction, SplitType } from "core/compiler";
import { useAppSetting, useDocument } from "core/context";
import { useExpNewIconResolution } from "core/experiments";
import { createLiveSplitFile, createLiveSplitFileAsync } from "core/external";
import { saveAs, SplitTypeConfig, SplitTypeKeys } from "data/libs";
import { MapOf } from "data/util";
import { SettingCategory } from "./SettingCategory";
import { SettingsContent, DocumentConfig, MapConfig } from "./SettingsContent";
import { settingsDialogStyles } from "./SettingsDialog.Style";

type SettingsDialogProps = {
	isOpen: boolean;
	close: () => void;
}

export enum Category {
	Document = "Document",
	Map = "Map"
}

export const SettingsDialog: React.FunctionComponent<SettingsDialogProps> = ({isOpen, close}) => {
	const [category, setCategory] = useState(Category.Document);
	const { docLines, metadata, config } = useDocument();
	const { setting } = useAppSetting();

	const iconAlreadyResolved = useExpNewIconResolution();

	if (!isOpen) {
		return <View><View /></View>;
	}

	return (
		<View>
			<Modal transparent={true} visible={true}>
				{/* Apply transparent background */}
				<View style={settingsDialogStyles.pageBackground}>
					{/* Create the outline of the settings dialog */}
					<View style={settingsDialogStyles.dialogBackground}>
						{/* Title and exit button */}
						<View style={settingsDialogStyles.headerRow}>
							<Text style={settingsDialogStyles.titleText}>Settings</Text>
							<TouchableOpacity style={settingsDialogStyles.closeButton} onPress={()=>close()} activeOpacity={0.7}>
								<Text style={settingsDialogStyles.closeButtonText}>Close</Text>
							</TouchableOpacity>
						</View>
						<View style={settingsDialogStyles.menuRow}>
							{/* Settings categories on left side of dialog */}
							<View style={settingsDialogStyles.menuSelectionPanel}>
								<SettingCategory categoryName={Category.Document} selectedCategory={category} setSelected={setCategory}/>
								<SettingCategory categoryName={Category.Map} selectedCategory={category} setSelected={setCategory}/>
							</View>
							{/* The individual settings themselves */}
							{/* TODO: ScrollView ouptuts an error to the console. */}
							{/* I believe either React or React-Native need to be upgraded. */}
							<ScrollView style={settingsDialogStyles.menu}>
								{category == Category.Document && <>
									{
										DocumentConfig.map((c, i) => <SettingsContent key={i} {...c} />)
									}
									{/* Temporary because we really need the download splits function */}
									<button onClick={ () => {
										const interpolationFunctions: SplitTypeConfig<(variables: MapOf<number|string>)=>string> = {};
										if(config["split-format"]){
											for (const key in config["split-format"]){
												const format = config["split-format"][key as SplitTypeKeys];
												if(format){
													interpolationFunctions[key as SplitTypeKeys] = getInterpolationFunction(format);
												}
											}
										}

										const formatter = (variables: MapOf<number>, splitType: SplitType, lineText: string)=>{
											if(!setting.splitSettings[splitType]){
												return undefined; // Split on this type is disabled
											}
											const splitTypeString = SplitType[splitType] as SplitTypeKeys;
											const interpolationFunction = interpolationFunctions[splitTypeString];
											if(interpolationFunction){
												const processed = interpolationFunction({
													...variables,
													"_": lineText
												});
												return processed;
											}
											return lineText;
										};

										if (!iconAlreadyResolved) {
											const splitContent = createLiveSplitFile(docLines, setting.enableSubsplits, formatter);
											saveAs(splitContent, (metadata.name || "celer-splits").replaceAll(" ", "-")+".lss");
											return;
										}

										const doCreateSplits = async () => {
											const splitContent = await createLiveSplitFileAsync(docLines, setting.enableSubsplits, formatter);
											saveAs(splitContent, (metadata.name || "celer-splits").replaceAll(" ", "-")+".lss");
										};
										doCreateSplits();
									} }>
										Download Splits (.lss)
									</button>
								</>}
								{category == Category.Map && MapConfig.map((c, i) => <SettingsContent key={i} {...c} />)}

							</ScrollView>
						</View>
					</View>
				</View>
			</Modal>
		</View>
	);
};
