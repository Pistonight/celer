import { WebAppVersion } from "data/util";
import { wasmLibVersion } from "data/wasmlib";
import { MenuItem, MenuItemWithValue } from "ui/components";
import { useStyles } from "ui/StyleContext";

export {};
type Props = {
    show: boolean,
    onDismiss: ()=>void
}
export const MenuFrame: React.FC<Props> = ({
    show, 
    onDismiss
})=>{
    const styles = useStyles();
    if(!show){
        return null;
    }
    return (
        <div className={styles.menuOverlayFrame} onClick={()=>onDismiss()}>
            <div style={{
                boxSizing: "border-box",
                height: "100%",
                padding: "10em"
            }}>
                <div
                onClick={(e)=>e.stopPropagation()}
                style={{
                    position: "relative",
                    backgroundColor: "#ffffff",
                    height: "100%"
                }}>
                    <div style={{
                        verticalAlign: "top",
                        width: "200px",
                        height: "100%",
                        display: "inline-block",
                        maxWidth: "20%",
                        minWidth: "100px"
                    }}>
                        <div style={{
                            padding: "5px",
                        }}>
<MenuItem  text="Appearance" action={function (): void {
                          console.log(1);
                      } }/>
                <MenuItem  text="Document" action={function (): void {
                          console.log(1);
                      } }/>
                      <MenuItem  text="Map" action={function (): void {
                          console.log(1);
                      } }/>
                      <MenuItem  text="Split" action={function (): void {
                          console.log(1);
                      } }/>
                      <MenuItem  text="Developer" action={function (): void {
                          console.log(1);
                      } }/>
                      <hr></hr>
                      <MenuItem  text="About" action={function (): void {
                          console.log(1);
                      } }/>
                      
                        </div>
                    
                    
                    </div>
                
                      <div style={{
                        
                        verticalAlign: "top",
                         display: "inline-block",
                         boxSizing: "border-box",
                        borderLeft: "1px solid black",
                        width: "80%",
                        minWidth: "calc( 100% - 200px )",
                        maxWidth: "calc( 100% - 100px )",
                        height: "100%",
                      }}>
                        <div style={{
                                                            height: "100%",

                            padding: 5
                        }}>
                            <h2 style={{
                                height: "60px",
                                margin: 0,
                                borderBottom: "1px solid black",
                                boxSizing:"border-box"
                            }}>Split Options</h2>
                            
                            <div style={{
                                height: "calc( 100% - 70px )",
                                overflowY: "auto"
                            }}>
                            <h3 style={{
                                marginTop: 20,
                                marginBottom: 0
                            }}>Export </h3>
                            <h3 style={{
                                marginTop: 20,
                                marginBottom: 0
                            }}>Export </h3>
                            <h3 style={{
                                marginTop: 20,
                                marginBottom: 0
                            }}>Export </h3>
                            <h3 style={{
                                marginTop: 20,
                                marginBottom: 0
                            }}>Export </h3>
                            <MenuItem  text="Download Splits" action={function (): void {
                          console.log(1);
                                } }/>
                            <span style={{
                                fontSize: "12pt",
                                color: "#666666",
                                paddingLeft: 5
                            }}>Download the route as a livesplit (.lss) file</span>
                            <h3 style={{
                                marginTop: 20,
                                marginBottom: 0
                            }}>Subsplit </h3>
                            <div style={{width: "20em"}}>
                                <MenuItemWithValue value={"Yes"} action={function (): void {
                                    //setSplitSetting(!splitSetting[SplitType.Shrine], SplitType.Shrine);
                                } } text={"Enable Subsplits: "} />
                            </div>
                            <span style={{
                                fontSize: "12pt",
                                color: "#666666",
                                paddingLeft: 5
                            }}>Toggle if subsplits are enabled</span>
                            <h3 style={{
                                marginTop: 20,
                                marginBottom: 0
                            }}>Split Types</h3>
                            <span style={{
                                fontSize: "12pt",
                                color: "#666666",
                                paddingLeft: 5
                            }}>Toggle if something should be included as a split when exporting</span>
                            <div style={{width: "20em"}}>
                            <MenuItemWithValue value={"Split"/*getSplitSettingText(splitSetting[SplitType.Shrine])*/} action={function (): void {
								//setSplitSetting(!splitSetting[SplitType.Shrine], SplitType.Shrine);
							} } text={"Shrine: "} />
							<MenuItemWithValue value={"Split"/*getSplitSettingText(splitSetting[SplitType.Tower])*/} action={function (): void {
								//setSplitSetting(!splitSetting[SplitType.Tower], SplitType.Tower);
							} } text={"Tower: "} />
							<MenuItemWithValue value={"Split"/*getSplitSettingText(splitSetting[SplitType.Memory])*/} action={function (): void {
								//setSplitSetting(!splitSetting[SplitType.Memory], SplitType.Memory);
							} } text={"Memory: "} />
							<MenuItemWithValue value={"Split"/*getSplitSettingText(splitSetting[SplitType.Warp])*/} action={function (): void {
								//setSplitSetting(!splitSetting[SplitType.Warp], SplitType.Warp);
							} } text={"Warp: "} />
							<MenuItemWithValue value={"Don't Split"/*getSplitSettingText(splitSetting[SplitType.Hinox])*/} action={function (): void {
								//setSplitSetting(!splitSetting[SplitType.Hinox], SplitType.Hinox, SplitType.Talus, SplitType.Molduga);
							} } text={"Boss: "} />
							<MenuItemWithValue value={"Don't Split"/*getSplitSettingText(splitSetting[SplitType.Korok])*/} action={function (): void {
								//setSplitSetting(!splitSetting[SplitType.Korok], SplitType.Korok);
							} } text={"Korok: "} />
							<MenuItemWithValue value={"Split"/*getSplitSettingText(splitSetting[SplitType.UserDefined])*/} action={function (): void {
								//setSplitSetting(!splitSetting[SplitType.UserDefined], SplitType.UserDefined);
							} } text={"Other: "} />
                            </div>
                            </div>
                            
                            
                            
                     
                            
                        </div>
                        
                        </div>


                        <div className={styles.contribution}>
                    v{WebAppVersion} (lib v{wasmLibVersion()})
                    <br></br>
                     <a href="#/">home</a> | <a href="
							https://github.com/iTNTPiston/celer/wiki">wiki</a> | <a>source</a>
							</div>



                </div>
                
            </div>
      
					
						{/* {contextMenuRef === splitSettingsMenuItemRef && <div className={styles.submenu} style={{
							bottom: `calc( 100vh - ${contextMenuRef.current?.getBoundingClientRect().bottom || 0}px )`,
						}}>
							
							<MenuItemWithValue value={enableSubsplits?"On": "Off"} action={function (): void {
								setEnableSubsplits(!enableSubsplits);
							} } text={"Subsplits: "} />
						</div>} */}
      
						{/* <div className={styles.menu}> */}
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
							{/* <MenuItemWithValue value={theme.name} action={function (): void {
								setTheme(theme.next());
								setContextMenuRef(undefined);
							} } text={"Theme: "} />
							<MenuItemWithValue value={mapDisplayMode.name} action={function (): void {
								setContextMenuRef(undefined);
								setMapDisplayMode(mapDisplayMode.next());
								mapCore.invalidateSize();
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
							{/* <MenuItemSubmenu selected={splitSettingsMenuItemRef === contextMenuRef} text="Split Settings..." hover={function (): void {
								setContextMenuRef(splitSettingsMenuItemRef);
							} } ref={splitSettingsMenuItemRef}/>
							{downloadCustomSplitsEnabled && <MenuItem text="Download Splits (.lss)" action={ () => {
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
								}, cleanSplitNamesEnabled);
								saveAs(splitContent, (metadata.name || "celer-splits").replaceAll(" ", "-")+".lss");
							} }/>}
							{bundle && <MenuItem text="Download bundle.json" action={function (): void {
								saveAs(bundle, "bundle.json");
							} }/>} */}
							{/* <hr />
    
                                                            <MenuItemWithValue value={"Enabled"} setValueBasedOnCurrent={function (t: string): void {
                          throw new Error("Function not implemented.");
                      } } style={appStyle} text={"Route Custom Theme: "} /> */}

							
						</div>

    );

}
