import React, { useState } from "react";
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
	} else {
		return (
			<div className={styles.appFrame}>
			<DocFrame docLines={docLines} />
			<div className={styles.statusBarFrame}
				style={{ zIndex:showMenu?99999:-1}}
				onClick={()=>{
					setShowMenu(false);
					setContextMenuRef(undefined);
				}} >
				<div className={styles.menuOverlayFrame}style={showMenu?{ height: "auto" } : undefined}>
					{showMenu && <>
						{contextMenuRef === splitSettingsMenuItemRef && <div className={styles.submenu} style={{
							bottom: `calc( 100vh - ${contextMenuRef.current?.getBoundingClientRect().bottom || 0}px )`,
						}}>
							<MenuItemWithValue value={getSplitSettingText(splitSetting[SplitType.Shrine])} action={function (): void {
								setSplitSetting(!splitSetting[SplitType.Shrine], SplitType.Shrine);
							} } text={"Shrine: "} />
							<MenuItemWithValue value={getSplitSettingText(splitSetting[SplitType.Tower])} action={function (): void {
								setSplitSetting(!splitSetting[SplitType.Tower], SplitType.Tower);
							} } text={"Tower: "} />
							<MenuItemWithValue value={getSplitSettingText(splitSetting[SplitType.Memory])} action={function (): void {
								setSplitSetting(!splitSetting[SplitType.Memory], SplitType.Memory);
							} } text={"Memory: "} />
							<MenuItemWithValue value={getSplitSettingText(splitSetting[SplitType.Warp])} action={function (): void {
								setSplitSetting(!splitSetting[SplitType.Warp], SplitType.Warp);
							} } text={"Warp: "} />
							<MenuItemWithValue value={getSplitSettingText(splitSetting[SplitType.Hinox])} action={function (): void {
								setSplitSetting(!splitSetting[SplitType.Hinox], SplitType.Hinox, SplitType.Talus, SplitType.Molduga);
							} } text={"Boss: "} />
							<MenuItemWithValue value={getSplitSettingText(splitSetting[SplitType.Korok])} action={function (): void {
								setSplitSetting(!splitSetting[SplitType.Korok], SplitType.Korok);
							} } text={"Korok: "} />
							<MenuItemWithValue value={getSplitSettingText(splitSetting[SplitType.UserDefined])} action={function (): void {
								setSplitSetting(!splitSetting[SplitType.UserDefined], SplitType.UserDefined);
							} } text={"Other: "} />
							<MenuItemWithValue value={enableSubsplits?"On": "Off"} action={function (): void {
								setEnableSubsplits(!enableSubsplits);
							} } text={"Subsplits: "} />
						</div>}
						<div className={styles.menu}>
							<MenuItemWithValue value={theme.name} action={function (): void {
								setTheme(theme.next());
								setContextMenuRef(undefined);
							} } text={"Theme: "} />
							<MenuItemWithValue value={mapDisplayMode.name} action={function (): void {
								setContextMenuRef(undefined);
								setMapDisplayMode(mapDisplayMode.next());
							} } text={"Map Size: "} />
							<hr />
							<MenuItemSubmenu selected={splitSettingsMenuItemRef === contextMenuRef} text="Split Settings..." hover={function (): void {
								setContextMenuRef(splitSettingsMenuItemRef);
							} } ref={splitSettingsMenuItemRef}/>
							<MenuItem text="Download Splits (.lss)" action={ () => {
								const interpolationFunctions: SplitTypeConfig<(variables: MapOf<number|string>)=>string> = {};
								if(config["split-format"]){
									for (const key in config["split-format"]){
										const format = config["split-format"][key as SplitTypeKeys];
										if(format){
											interpolationFunctions[key as SplitTypeKeys] = getInterpolationFunction(format);
										}
									}
								}
								const splitContent = createLiveSplitFile(docLines, enableSubsplits, (variables, splitType, lineText)=>{
									if(!splitSetting[splitType]){
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
								});
								saveAs(splitContent, (metadata.name || "celer-splits").replaceAll(" ", "-")+".lss");
							} }/>
							<div className={styles.contribution}>
								&nbsp;
								<div className={styles.menuItemValue}>
									v{WebAppVersion} (lib v{wasmLibVersion()}) | <a href="#/">home</a> | <a href="
							https://github.com/iTNTPiston/celer/wiki">wiki</a>
								</div>
							</div>
						</div>
					</>
					}
					<div className={styles.statusBar}>
						<div className={styles.statusMessage}>
							{metadata.name}
						</div>
						<div className={styles.statusErrorString}>

							<span>{errorCount || "No"} Error{errorCount > 1 && "s"}</span>

						</div>
						<div className={styles.menuAnchor} onClick={(e)=>{setShowMenu(true);e.stopPropagation();}}>

							<span >Options</span>
						</div>
					</div>
				</div>
			</div>
			<MapFrame manualCenter={mapCenter}/>
		</div>
		);
	}
};
