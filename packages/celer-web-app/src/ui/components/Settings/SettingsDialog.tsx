import React, { useState } from "react";
import { Modal, View, ScrollView, Text, TouchableOpacity } from "react-native";

import { SettingCategory } from "ui/components";
import { settingsDialogStyles } from "ui/styles";

// import { useAppSetting} from "core/context";

type SettingsDialogProps = {
    isOpen: boolean;
    close: Function;
}

export enum Category {
    Document = "Document",
    Map = "Map"
}

export const SettingsDialog: React.FunctionComponent<SettingsDialogProps> = (props) => {
    const { isOpen, close } = props;

    const [category, setCategory] = useState(Category.Document);

    return (
        <View>
            {isOpen ? (
                <Modal transparent={true} visible={isOpen}>
                    {/* Apply transparent background */}
                    <View style={settingsDialogStyles.pageBackground}>
                        {/* Create the outline of the settings dialog */}
                        {/* TODO: make dialog have variable size depending on window dimenisons */}
                        <View style={settingsDialogStyles.dialogBackground}>
                            {/* Title and exit button */}
                            <View style={settingsDialogStyles.headerRow}>
                                <Text style={settingsDialogStyles.titleText}>Settings</Text>
                                <TouchableOpacity style={settingsDialogStyles.closeButton}
                                                  onPress={()=>close()}
                                                  activeOpacity={0.7}>
                                    <Text style={settingsDialogStyles.closeButtonText}>Close</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={settingsDialogStyles.menuRow}>
                                <View style={settingsDialogStyles.menuSelectionPanel}>
                                    <SettingCategory categoryName={Category.Document} selectedCategory={category} setSelected={setCategory}/>
                                    <SettingCategory categoryName={Category.Map} selectedCategory={category} setSelected={setCategory}/>
                                </View>
                                <ScrollView style={settingsDialogStyles.menu}>
                                    <Text style={settingsDialogStyles.settingHeader}>Settings will go here...</Text>
                                </ScrollView>
                            </View>
                        </View>
                    </View>
                </Modal>
            ) : (
                // If not open, return empty view
                <View></View>
            ) }
        </View>
    );
}



        // <div className = "settingsDialogBackground" 
        // style={SettingsOptions.settingsDialogBackground}>
        //     <div className = "settingsDialogContainer">
        //         <div className = "headerCloseButton">
        //             <button onClick={() => openDialog(false)}>
        //                 X
        //             </button>
        //         </div>
        //         <div className = "settingsDialogTitle">
        //             <p>     Settings     </p>
        //         </div>
        //         <div className = "settingsDialogBody">
        //             {/* <p> Body of Dialog </p> */}
        //             <div className = "settingsDialogSubmenu">
        //                 {/* <MenuItemWithValue value={getSplitSettingText(splitSetting[SplitType.Shrine])} action={function (): void {
        //                     setSplitSetting(!splitSetting[SplitType.Shrine], SplitType.Shrine);
        //                 }} text={"Shrine: "} />
        //                 <MenuItemWithValue value={getSplitSettingText(splitSetting[SplitType.Tower])} action={function (): void {
        //                     setSplitSetting(!splitSetting[SplitType.Tower], SplitType.Tower);
        //                 } } text={"Tower: "} />
        //                 <MenuItemWithValue value={getSplitSettingText(splitSetting[SplitType.Memory])} action={function (): void {
        //                     setSplitSetting(!splitSetting[SplitType.Memory], SplitType.Memory);
        //                 } } text={"Memory: "} />
        //                 <MenuItemWithValue value={getSplitSettingText(splitSetting[SplitType.Warp])} action={function (): void {
        //                     setSplitSetting(!splitSetting[SplitType.Warp], SplitType.Warp);
        //                 } } text={"Warp: "} />
        //                 <MenuItemWithValue value={getSplitSettingText(splitSetting[SplitType.Hinox])} action={function (): void {
        //                     setSplitSetting(!splitSetting[SplitType.Hinox], SplitType.Hinox, SplitType.Talus, SplitType.Molduga);
        //                 } } text={"Boss: "} />
        //                 <MenuItemWithValue value={getSplitSettingText(splitSetting[SplitType.Korok])} action={function (): void {
        //                     setSplitSetting(!splitSetting[SplitType.Korok], SplitType.Korok);
        //                 } } text={"Korok: "} />
        //                 <MenuItemWithValue value={getSplitSettingText(splitSetting[SplitType.UserDefined])} action={function (): void {
        //                     setSplitSetting(!splitSetting[SplitType.UserDefined], SplitType.UserDefined);
        //                 } } text={"Other: "} />
        //                 <MenuItemWithValue value={enableSubsplits?"On": "Off"} action={function (): void {
        //                     setEnableSubsplits(!enableSubsplits);
        //                 } } text={"Subsplits: "} /> */}
        //                 <MenuItemTogglable value={splitSetting[SplitType.Shrine]} action={function (): void {
        //                     setSplitSetting(!splitSetting[SplitType.Shrine], SplitType.Shrine);
        //                 } } text={"Shrine Toggle: "} />

        //             </div>
        //         </div>
        //         <div className = "settingsDialogFooter">
        //             <button> Cancel </button>
        //             <button> Confirm </button>
        //         </div>
        //     </div>
        // </div>
//     );
// }
