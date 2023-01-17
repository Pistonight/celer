import React, { useState } from "react";
import produce from "immer";
import { useStyles } from "ui/StyleContext";

import { MenuItem, MenuItemSubmenu, MenuItemWithValue } from "ui/components";

import { BannerType, SplitType, getInterpolationFunction } from "core/compiler";
import { useAppSetting, useAppState, useDocument } from "core/context";
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
	const styles = useStyles();
	const [showMenu, setShowMenu] = useState(false);
	const [contextMenuRef, setContextMenuRef] = useState<React.RefObject<HTMLDivElement> | undefined>(undefined);

	let errorCount = 0;
	docLines.forEach(l=>{
		if(l.lineType === "DocLineBanner" && l.bannerType === BannerType.Error){
			errorCount++;
		}
	});



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
										draft.splitSettings = produce(draft.splitSettings, (draft2) => {
											draft2[SplitType.Shrine] = !draft2[SplitType.Shrine];
										})
									}));
							} } text={"Shrine: "} />
							<MenuItemWithValue value={getSplitSettingText(setting.splitSettings[SplitType.Tower])} action={function (): void {
								setSetting(
									produce(setting, (draft) => {
										draft.splitSettings = produce(draft.splitSettings, (draft2) => {
											draft2[SplitType.Tower] = !draft2[SplitType.Tower];
										})
									}));
							} } text={"Tower: "} />
							<MenuItemWithValue value={getSplitSettingText(setting.splitSettings[SplitType.Memory])} action={function (): void {
								setSetting(
									produce(setting, (draft) => {
										draft.splitSettings = produce(draft.splitSettings, (draft2) => {
											draft2[SplitType.Memory] = !draft2[SplitType.Memory];
										})
									}));
							} } text={"Memory: "} />
							<MenuItemWithValue value={getSplitSettingText(setting.splitSettings[SplitType.Warp])} action={function (): void {
								setSetting(
									produce(setting, (draft) => {
										draft.splitSettings = produce(draft.splitSettings, (draft2) => {
											draft2[SplitType.Warp] = !draft2[SplitType.Warp];
										})
									}));
							} } text={"Warp: "} />
							<MenuItemWithValue value={getSplitSettingText(setting.splitSettings[SplitType.Hinox])} action={function (): void {
								setSetting(
									produce(setting, (draft) => {
										draft.splitSettings = produce(draft.splitSettings, (draft2) => {
											draft2[SplitType.Hinox] = !draft2[SplitType.Hinox];
											draft2[SplitType.Talus] = !draft2[SplitType.Talus];
											draft2[SplitType.Molduga] = !draft2[SplitType.Molduga];
										})
									}));
							} } text={"Boss: "} />
							<MenuItemWithValue value={getSplitSettingText(setting.splitSettings[SplitType.Korok])} action={function (): void {
								setSetting(
									produce(setting, (draft) => {
										draft.splitSettings = produce(draft.splitSettings, (draft2) => {
											draft2[SplitType.Korok] = !draft2[SplitType.Korok];
										})
									}));
							} } text={"Korok: "} />
							<MenuItemWithValue value={getSplitSettingText(setting.splitSettings[SplitType.UserDefined])} action={function (): void {
								setSetting(
									produce(setting, (draft) => {
										draft.splitSettings = produce(draft.splitSettings, (draft2) => {
											draft2[SplitType.UserDefined] = !draft2[SplitType.UserDefined];
										})
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
};
