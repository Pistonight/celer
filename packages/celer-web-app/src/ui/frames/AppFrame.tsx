import React, { useState } from "react";

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
import { MenuFrame } from "./MenuFrame";

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
		bundle,
	} = useDocument();
	const {
		mapDisplayMode, 
		setMapDisplayMode, 
		theme, 
		setTheme,
		splitSetting,
		setSplitSetting,
		enableSubsplits,
		setEnableSubsplits,
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

			

				<MapFrame setSetCenterListener={setCenterListener}/>
				<MenuFrame 
					show={showMenu}
					onDismiss={()=>setShowMenu(false)}
				/>

			<div className={styles.statusBarFrame}
				
				onClick={()=>{
					setShowMenu(false);
					setContextMenuRef(undefined);
				}} >
				
				<div className={styles.statusBar}>
						<div className={styles.menuAnchor} onClick={(e)=>{setShowMenu(true);e.stopPropagation();}}>
      
							<span>Options...</span>
						</div>
						<div className={styles.statusMessage}>
							<span>
							{metadata.name}
							</span>
							
						</div>
						<div className={styles.statusErrorString}>
      
							<span>{errorCount || "No"} Error{errorCount > 1 && "s"}</span>

						</div>
						
						
						
					</div>
			</div>

			
      
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
