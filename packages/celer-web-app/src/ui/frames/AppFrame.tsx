import { useState } from "react";
import { MenuItem, MenuItemSubmenu, MenuItemWithValue } from "../../components/MenuItem/MenuItem";
import { useAppRoot, useExperiment } from "ui/root";
import { useStyles } from "ui/styles";
import "data/scripts";
import { DocFrame } from "./DocFrame";
import { BannerType, SplitType } from "data/assembly";
import { useEngineService } from "ui/root/EngineService";
import { MapFrame } from "./MapFrame";
import React from "react";
import { createLiveSplitFile } from "data/livesplit";
import { saveAs } from "data/scripts/external/FileSaver";
import { EmptyObject } from "data/util";
import { WebAppVersion } from "data/util/version";

const getSplitSettingText = (value: boolean) => value?"Split":"Don't Split";

const splitSettingsMenuItemRef = React.createRef<HTMLDivElement>();
export const AppFrame: React.FC<EmptyObject> = ()=>{
	const {
		mapCore, 
		mapDisplayMode, 
		setMapDisplayMode, 
		theme, 
		setTheme,
		splitSetting,
		setSplitSetting,
	} = useAppRoot();
	const styles = useStyles();
	const [showMenu, setShowMenu] = useState(false);
	const [contextMenuRef, setContextMenuRef] = useState<React.RefObject<HTMLDivElement> | undefined>(undefined);

	const downloadSplitsEnabled = useExperiment("ExportSplits");
	// const computedRoute = compiler.compile(testScript as unknown as RouteScriptSection[]);
	// console.log(computedRoute);
	// const computedLines = engine.compute(computedRoute);
	// const [mapIcons, mapLines] = mapengine.compute(computedLines);
	// console.log(mapLines);
   
	const { metadata, docLines } = useEngineService();
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
								mapCore.invalidateSize();
							} } text={"Map Size: "} />
							<hr />
							<MenuItemSubmenu selected={splitSettingsMenuItemRef === contextMenuRef} text="Split Settings..." hover={function (): void {
								setContextMenuRef(splitSettingsMenuItemRef);
								//console.log(splitSettingsMenuItemRef.current?.getBoundingClientRect());
							} } ref={splitSettingsMenuItemRef}/>
							{downloadSplitsEnabled && <MenuItem text="Download AS Splits" action={function (): void {
								const splitContent = createLiveSplitFile(docLines, (variables, splitType, lineText)=>{
									const prefixnumber = (i: number):string => {
										if (i >= 100) {return String(i);}
										if(i>=10) {return "0"+String(i);}
										return "00"+String(i);
									};
									let name: string | undefined = undefined;
									if(splitType === SplitType.Shrine){
										name = "[" + prefixnumber(variables.SRN) + "] " + lineText;
									}else if (splitType === SplitType.Warp){
										name = lineText + " Again";
									}else if (splitType !== SplitType.None){
										name = lineText;
									}
									return name;
								});
								saveAs(splitContent, "celer-splits.lss");
							} }/>}
							{downloadSplitsEnabled && <MenuItem text="Download Hundo Splits" action={function (): void {
								const splitContent = createLiveSplitFile(docLines, (variables, splitType, lineText)=>{
									let name: string | undefined = undefined;
									if(splitType === SplitType.Shrine){
										name = String(variables.KRK) + " - " + lineText;
									}else if (splitType === SplitType.Warp){
										name = lineText + " Again";
									}else if (splitType === SplitType.Tower || splitType === SplitType.UserDefined){
										name = lineText;
									}
									return name;
								});
								saveAs(splitContent, "celer-splits-hundo.lss");
							} }/>}
							{/* <hr />
    <MenuItem style={appStyle} text="Route Detail..." action={function (): void {
                          console.log(1);
                      } }/>
                                                            <MenuItemWithValue value={"Enabled"} setValueBasedOnCurrent={function (t: string): void {
                          throw new Error("Function not implemented.");
                      } } style={appStyle} text={"Route Custom Theme: "} /> */}

							<div className={styles.contribution}>&nbsp;<div className={styles.menuItemValue}>celer-engine v{WebAppVersion}</div></div>
						</div>
					</>
					}
					<div className={styles.statusBar}>
						<div className={styles.statusMessage}>
							{metadata.Name}
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

			<MapFrame />
      
			{/* <div style={{position: "fixed", backgroundColor: "rgba(0,0,0,0.5)", width: "100vw", height: "100vh", zIndex:99999}}>
      <div style={{margin: "calc( ( 100vw - 30em ) / 2 )", height: "100%"}}>
        <div style={{backgroundColor: "white", width: "30em", maxWidth: "100%",position: "absolute", top: "50%", transform: "translate(0,-50%)", padding:"10px"}}>
          <h3 style={{margin: 0, textAlign: "center"}}>About</h3>
          <hr></hr>
          <p>celer-engine v0.0.0 by iTNTPiston<br></br><a href="">Source on GitHub</a></p>
          
          <hr></hr>
          <div style={{textAlign: "right"}}><span style={{cursor: "pointer", marginLeft: "10px", marginRight: "10px", padding:"3px 10px", border: "1px solid black"}}>Close</span></div>
        </div>
      </div>
      </div> */}

		</div>
	);
};
