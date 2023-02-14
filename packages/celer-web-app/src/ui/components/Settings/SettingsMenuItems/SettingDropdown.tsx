import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";

import { SettingProps } from "./SettingLabel";
import { CelerColors } from "ui/styles";
import { DropdownStyle } from "./SettingDropdown.Style";


export const SettingDropdown: React.FunctionComponent<SettingProps> = ({text, action, values, selectedIndex, actionWithValue, actionWithValueUpdate}) => {

    const [selected, setSelected] = useState(selectedIndex);

    const handleChange = (e: any) => {
        setSelected(e.target.value);
        const value = actionWithValue?.(e.target.value);
        if(value !== undefined)
        {
            console.log(e.target.value);
            actionWithValueUpdate?.(value);
        }
    }
    if(values != null)
    {
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
    return <View></View>
}
