import produce from "immer";
import React, { useState } from "react";
import { useStyles } from "ui/StyleContext";
import { MenuItem, MenuItemSubmenu, MenuItemWithValue } from "ui/components";
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
	const [contextMenuRef, setContextMenuRef] = useState<React.RefObject<HTMLDivElement> | undefined>(undefined);

	let errorCount = 0;
	docLines.forEach(l=>{
		if(l.lineType === "DocLineBanner" && l.bannerType === BannerType.Error){
			errorCount++;
		}
	});
	if(useNew)
	{
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
								<MenuItemWithValue value={getSplitSettingText(setting.splitSettings[SplitType.Shrine])} action={function (): void {
									setSetting(
										produce(setting, (draft) => {
											draft.splitSettings[SplitType.Shrine] = !draft.splitSettings[SplitType.Shrine];
										}));
								} } text={"Shrine: "} />
								<MenuItemWithValue value={getSplitSettingText(setting.splitSettings[SplitType.Tower])} action={function (): void {
									setSetting(
										produce(setting, (draft) => {
											draft.splitSettings[SplitType.Tower] = !draft.splitSettings[SplitType.Tower];
										}));
								} } text={"Tower: "} />
								<MenuItemWithValue value={getSplitSettingText(setting.splitSettings[SplitType.Memory])} action={function (): void {
									setSetting(
										produce(setting, (draft) => {
											draft.splitSettings[SplitType.Memory] = !draft.splitSettings[SplitType.Memory];
										}));
								} } text={"Memory: "} />
								<MenuItemWithValue value={getSplitSettingText(setting.splitSettings[SplitType.Warp])} action={function (): void {
									setSetting(
										produce(setting, (draft) => {
											draft.splitSettings[SplitType.Warp] = !draft.splitSettings[SplitType.Warp];
										}));
								} } text={"Warp: "} />
								<MenuItemWithValue value={getSplitSettingText(setting.splitSettings[SplitType.Hinox])} action={function (): void {
									setSetting(
										produce(setting, (draft) => {
											draft.splitSettings[SplitType.Hinox] = !draft.splitSettings[SplitType.Hinox];
											draft.splitSettings[SplitType.Talus] = !draft.splitSettings[SplitType.Talus];
											draft.splitSettings[SplitType.Molduga] = !draft.splitSettings[SplitType.Molduga];
										}));
								} } text={"Boss: "} />
								<MenuItemWithValue value={getSplitSettingText(setting.splitSettings[SplitType.Korok])} action={function (): void {
									setSetting(
										produce(setting, (draft) => {
											draft.splitSettings[SplitType.Korok] = !draft.splitSettings[SplitType.Korok];
										}));
								} } text={"Korok: "} />
								<MenuItemWithValue value={getSplitSettingText(setting.splitSettings[SplitType.UserDefined])} action={function (): void {
									setSetting(
										produce(setting, (draft) => {
											draft.splitSettings[SplitType.UserDefined] = !draft.splitSettings[SplitType.UserDefined];
										}));
								} } text={"Other: "} />
								<MenuItemWithValue value={setting.enableSubsplits?"On": "Off"} action={function (): void {
									setSetting(
										produce(setting, (draft) => {
											draft.enableSubsplits = !draft.enableSubsplits;
										}));
								} } text={"Subsplits: "} />
							</div>}
							<div className={styles.menu}>
								{/* <MenuItemWithValue value={"Compass"} setValueBasedOnCurrent={function (t: string): void {
							throw new Error("Function not implemented.");
						} } style={appStyle} text={"Direction Mode: "} />
								<MenuItemWithValue value={"Important Only"} setValueBasedOnCurrent={function (t: string): void {
							throw new Error("Function not implemented.");
						} } style={appStyle} text={"Display Lines: "} />
					<MenuItemWithValue value={"Errors + Warnings"} setValueBasedOnCurrent={function (t: string): void {
							throw new Error("Function not implemented.");
						} } style={appStyle} text={"Display Error: "} />
										<MenuItemWithValue value={"Default"} setValueBasedOnCurrent={function (t: string): void {
							throw new Error("Function not implemented.");
						} } style={appStyle} text={"Theme: "} /> */}
								<MenuItemWithValue value={setting.theme.name} action={function (): void {
									setSetting(
										produce(setting, (draft) => {
											draft.theme = draft.theme.next();
										}));
									setContextMenuRef(undefined);
								} } text={"Theme: "} />
								<MenuItemWithValue value={setting.mapDisplay.name} action={function (): void {
									setContextMenuRef(undefined);
									setSetting(
										produce(setting, (draft) => {
											draft.mapDisplay = draft.mapDisplay.next();
										}));
								} } text={"Map Size: "} />
								<hr />
								{/* <MenuItemWithValue value={""} action={function (): void {
									console.log("test");
								} } text={"Zoom Levels..."} />
								<MenuItemWithValue value={""} action={function (): void {
									console.log("test");
								} } text={"Zoom Thresholds..."} />
								<MenuItemWithValue value={""} action={function (): void {
									console.log("test");
								} } text={"Icon Sizes..."} />
								<MenuItemWithValue value={"Fancy"} action={function (): void {
									console.log("test");
								} } text={"Performance:"} />
								<hr /> */}
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
									const splitContent = createLiveSplitFile(docLines, setting.enableSubsplits, (variables, splitType, lineText)=>{
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
											// console.log({
											// 	processed,
											// 	lineText
											// });
											return processed;
										}
										return lineText;
									});
									saveAs(splitContent, (metadata.name || "celer-splits").replaceAll(" ", "-")+".lss");
								} }/>

								{/* <hr />
		<MenuItem style={appStyle} text="Route Detail..." action={function (): void {
							console.log(1);
						} }/>
																<MenuItemWithValue value={"Enabled"} setValueBasedOnCurrent={function (t: string): void {
							throw new Error("Function not implemented.");
						} } style={appStyle} text={"Route Custom Theme: "} /> */}

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
							{/* <MenuItemWithValue value={"Compass"} setValueBasedOnCurrent={function (t: string): void {
                          throw new Error("Function not implemented.");
                      } } style={appStyle} text={"Direction Mode: "} />
                              <MenuItemWithValue value={"Important Only"} setValueBasedOnCurrent={function (t: string): void {
                          throw new Error("Function not implemented.");
                      } } style={appStyle} text={"Display Lines: "} />
                <MenuItemWithValue value={"Errors + Warnings"} setValueBasedOnCurrent={function (t: string): void {
                          throw new Error("Function not implemented.");
                      } } style={appStyle} text={"Display Error: "} />
                                      <MenuItemWithValue value={"Default"} setValueBasedOnCurrent={function (t: string): void {
                          throw new Error("Function not implemented.");
                      } } style={appStyle} text={"Theme: "} /> */}
							<MenuItemWithValue value={theme.name} action={function (): void {
								setTheme(theme.next());
								setContextMenuRef(undefined);
							} } text={"Theme: "} />
							<MenuItemWithValue value={mapDisplayMode.name} action={function (): void {
								setContextMenuRef(undefined);
								setMapDisplayMode(mapDisplayMode.next());
							} } text={"Map Size: "} />
							<hr />
							{/* <MenuItemWithValue value={""} action={function (): void {
								console.log("test");
							} } text={"Zoom Levels..."} />
							<MenuItemWithValue value={""} action={function (): void {
								console.log("test");
							} } text={"Zoom Thresholds..."} />
							<MenuItemWithValue value={""} action={function (): void {
								console.log("test");
							} } text={"Icon Sizes..."} />
							<MenuItemWithValue value={"Fancy"} action={function (): void {
								console.log("test");
							} } text={"Performance:"} />
							<hr /> */}
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
										// console.log({
										// 	processed,
										// 	lineText
										// });
										return processed;
									}
									return lineText;
								});
								saveAs(splitContent, (metadata.name || "celer-splits").replaceAll(" ", "-")+".lss");
							} }/>

							{/* <hr />
    <MenuItem style={appStyle} text="Route Detail..." action={function (): void {
                          console.log(1);
                      } }/>
                                                            <MenuItemWithValue value={"Enabled"} setValueBasedOnCurrent={function (t: string): void {
                          throw new Error("Function not implemented.");
                      } } style={appStyle} text={"Route Custom Theme: "} /> */}

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
};
