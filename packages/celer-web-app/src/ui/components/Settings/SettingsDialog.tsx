import React, { useState } from "react";
import { Modal, View, ScrollView, Text, TouchableOpacity } from "react-native";

import { SettingCategory, SettingToggle } from "ui/components";
import { settingsDialogStyles } from "./SettingsDialog.Style";
import { SettingDropdown } from "./SettingsMenuItems/SettingDropdown";

type SettingsDialogProps = {
    isOpen: boolean;
    close: Function;
}

export enum Category {
    Document = "Document",
    Map = "Map"
}

export const SettingsDialog: React.FunctionComponent<SettingsDialogProps> = ({isOpen, close}) => {
    const [category, setCategory] = useState(Category.Document);

    return (
        <View>
            {isOpen ? (
                <Modal transparent={true} visible={isOpen}>
                    {/* Apply transparent background */}
                    <View style={settingsDialogStyles.pageBackground}>
                        {/* Create the outline of the settings dialog */}
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
                                {/* Settings categories on left side of dialog */}
                                <View style={settingsDialogStyles.menuSelectionPanel}>
                                    <SettingCategory categoryName={Category.Document} selectedCategory={category} setSelected={setCategory}/>
                                    <SettingCategory categoryName={Category.Map} selectedCategory={category} setSelected={setCategory}/>
                                </View>
                                {/* The individual settings themselves */}
                                {/* TODO: ScrollView ouptuts an error to the console. */}
                                {/* I believe either React or React-Native need to be upgraded. */}
                                <ScrollView style={settingsDialogStyles.menu}>
                                    <Text style={settingsDialogStyles.settingHeader}>My Wacky Label</Text>
                                    <SettingToggle 
                                        text={"My Silly Setting"}
                                        action={() => console.log("Action being performed.")}
                                        value={false}
                                    />
                                    <SettingDropdown
                                        text={"My Epic Dropdown"}
                                        action={() => console.log("Dropdown selected.")}
                                        values={["balls", "fart"]}
                                        selectedIndex={1}
                                    />
                                </ScrollView>
                            </View>
                        </View>
                    </View>
                </Modal>
            ) : (
                // If not open, return empty
                <View/>
            ) }
        </View>
    );
}
