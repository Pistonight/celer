import React, { useState } from "react";
import { Modal, View, Text, Pressable } from "react-native";

import { SettingProps } from "./SettingLabel";
import { CelerColors } from "ui/styles";
import { DropdownStyle } from "./SettingDropdown.Style";


export const SettingDropdown: React.FunctionComponent<SettingProps> = ({text, action, values, selectedIndex, actionWithValue, actionWithValueUpdate}) => {

    const [selected, setSelected] = useState(selectedIndex);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    return (
        <View style={DropdownStyle.container}>
            <Text style={DropdownStyle.title}>{text}</Text>
            <View style={DropdownStyle.menu}>
                <Pressable 
                    style={DropdownStyle.face}
                    onPress={() => {setDropdownOpen(!dropdownOpen)}}
                >
                    <Text style={DropdownStyle.faceText}>{values?[selectedIndex]}</Text>
                </Pressable>
                <View style={dropdownOpen ? DropdownStyle.dropdownVisible : DropdownStyle.dropdownHidden}>
                    {values?.map((item) =>
                        <View>
                            <Pressable
                                style={DropdownStyle.option}
                                onPress={() => {
                                    setSelected(values.indexOf(item));
                                    setDropdownOpen(false)}}
                            >
                                <Text style={DropdownStyle.optionText}>{item}</Text>
                            </Pressable>
                            <View style={DropdownStyle.separator}/>
                        </View>
                    )}
                </View>
            </View>
        </View>
    );
}
