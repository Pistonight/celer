import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native"; 

import { SettingProps } from "./Setting";
import { CelerColors } from "ui/styles";
import { DropdownStyle } from "./SettingDropdown.Style";

export interface SettingDropdownProps extends SettingProps {
    values: string[],
    selectedIndex: number,
}

export const SettingDropdown: React.FunctionComponent<SettingDropdownProps> = ({text, action, values, selectedIndex}) => {
 
    const [selected, setSelected] = useState(selectedIndex);

    const handleChange = (e: any) => {
        setSelected(e.target.value);
    }

    const valuesObj = values.map((val, i) => ({label: val, value: i}));

    return (
        <View style={DropdownStyle.container}>
            <Text style={DropdownStyle.title}>{text}</Text>
            <select value={selected} onChange={handleChange}>
                {valuesObj.map((item) => <option value={item.value}>{item.label}</option>)}
            </select>

        </View>
    );
}