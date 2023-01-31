import produce from "immer";
import React, { useState } from "react";
import { View, Text, Button, Modal } from "react-native";

import { useStyles } from "ui/StyleContext";

import { MenuItem, MenuItemSubmenu, MenuItemWithValue, SettingsDialog } from "ui/components";

import { BannerType, SplitType, getInterpolationFunction } from "core/compiler";
import { useAppSetting, useOldAppSetting, useAppState, useDocument } from "core/context";
import { useNewSettings } from "core/experiments";
import { createLiveSplitFile } from "core/external";
import {
	saveAs,
	wasmLibVersion,
	SplitTypeConfig,
	SplitTypeKeys
} from "data/libs";
import { EmptyObject, MapOf, WebAppVersion } from "data/util";

import { DocFrame } from "./DocFrame";
import { MapFrame } from "./MapFrame";

const getSplitSettingText = (value: boolean) => value?"Split":"Don't Split";

const splitSettingsMenuItemRef = React.createRef<HTMLDivElement>();

export const AppFrame: React.FC<EmptyObject> = ()=>{
	const useNew = useNewSettings();
	const {
		mapCenter,
	} = useAppState();
	const {
		metadata,// clean up these once new DP rolls out
		config,
		docLines,
	} = useDocument();
	const {
		setting,
		setSetting
	} = useAppSetting();
	const {
		mapDisplayMode,
		setMapDisplayMode,
		theme,
		setTheme,
		splitSetting,
		setSplitSetting,
		enableSubsplits,
		setEnableSubsplits,
	} = useOldAppSetting();
	const styles = useStyles();
	const [showMenu, setShowMenu] = useState(false);
	const [settingPage, setSettingPage] = useState("Map");
	const [settingsDialogOpen, setSettingsDialogOpen] = useState(false);
	const [contextMenuRef, setContextMenuRef] = useState<React.RefObject<HTMLDivElement> | undefined>(undefined);

	let errorCount = 0;
	docLines.forEach(l=>{
		if(l.lineType === "DocLineBanner" && l.bannerType === BannerType.Error){
			errorCount++;
		}
	});

	// Return the new settings dialog if new experiment is being used
	if(useNew)
	{
		return (
			<div className={styles.appFrame}>
			<DocFrame docLines={docLines}/>
			<div className={styles.statusBarFrame}
				style={{ zIndex:showMenu?99999:-1}}
				onClick={()=>{
					setShowMenu(false);
					setContextMenuRef(undefined);
				}} >
				<div className={styles.menuOverlayFrame}style={showMenu?{ height: "auto" } : undefined}>
					<div className={styles.statusBar}>
						<div className={styles.statusMessage}>
							{metadata.name}
						</div>
						<div className={styles.statusErrorString}>
							<span>{errorCount || "No"} Error{errorCount > 1 && "s"}</span>
						</div>
						<div className={styles.menuAnchor} onClick={(e)=>{setShowMenu(true);e.stopPropagation();}}>
							<span onClick = {() => {
								console.log("Click");
								setSettingsDialogOpen(true);
							}}>
								Options
							</span>
						</div>
					</div>
				</div>
			</div>
			<MapFrame manualCenter={mapCenter}/>
			<SettingsDialog {... { isOpen: settingsDialogOpen, close: () => {setSettingsDialogOpen(false)}}}/>
		</div>
		);
	}
	return (
		<div className={styles.appFrame}>
			<DocFrame docLines={docLines}/>
			<div className={styles.statusBarFrame}
				style={{ zIndex:showMenu?99999:-1}}
				onClick={()=>{
					setShowMenu(false);
					setContextMenuRef(undefined);
				}} >
				<div className={styles.menuOverlayFrame}style={showMenu?{ height: "auto" } : undefined}>
					<div className={styles.statusBar}>
						<div className={styles.statusMessage}>
							{metadata.name}
						</div>
						<div className={styles.statusErrorString}>
							<span>{errorCount || "No"} Error{errorCount > 1 && "s"}</span>
						</div>
						<div className={styles.menuAnchor} onClick={(e)=>{setShowMenu(true);e.stopPropagation();}}>
							<span onClick = {() => {
								console.log("Click");
								setSettingsDialogOpen(true);
							}}>
								Options
							</span>
						</div>
					</div>
				</div>
			</div>
			<MapFrame manualCenter={mapCenter}/>
			<SettingsDialog {... { isOpen: settingsDialogOpen, close: () => {setSettingsDialogOpen(false)}}}/>
		</div>
	);
};
