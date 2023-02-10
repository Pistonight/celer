import React, { useState } from "react";
import { Modal, View, Text, Pressable } from "react-native"; 

import { SettingProps } from "./Setting";
import { CelerColors } from "ui/styles";
import { DropdownStyle } from "./SettingDropdown.Style";

export interface SettingDropdownProps extends SettingProps {
    values: string[],
    selectedIndex: number,
}

export const SettingDropdown: React.FunctionComponent<SettingDropdownProps> = ({text, action, values, selectedIndex}) => {
    const [selected, setSelected] = useState(selectedIndex);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const valuesObj = values.map((val, i) => ({label: val, index: i}));

    return (
        <View style={DropdownStyle.container}>
            <Text style={DropdownStyle.title}>{text}</Text>
            <View style={DropdownStyle.menu}>
                <Pressable 
                    style={DropdownStyle.face}
                    onPress={() => {setDropdownOpen(!dropdownOpen)}}
                >
                    <Text style={DropdownStyle.faceText}>{valuesObj[selected].label}</Text>
                </Pressable>
                <View style={dropdownOpen ? DropdownStyle.dropdownVisible : DropdownStyle.dropdownHidden}>
                    {valuesObj.map((item) =>
                        <View>
                            <Pressable
                                style={DropdownStyle.option}
                                onPress={() => {
                                    setSelected(item.index);
                                    setDropdownOpen(false)}}
                            >
                                <Text style={DropdownStyle.optionText}>{item.label}</Text>
                            </Pressable>
                            <View style={DropdownStyle.separator}/>
                        </View>
                    )}
                </View>
            </View>
        </View>
    );
}