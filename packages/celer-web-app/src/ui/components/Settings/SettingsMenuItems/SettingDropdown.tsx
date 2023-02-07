import React, { useState } from "react";
import { View, Text, Switch } from "react-native";

import { SettingProps } from "./Setting";
import { CelerColors } from "ui/styles";
import { DropdownStyle } from "./SettingDropdown.Style";

export interface SettingDropdownProps extends SettingProps {
    values: string,
    selectedIndex: number,
}

export const SettingDropdown: React.FunctionComponent<SettingDropdownProps> = ({text, action, values, selectedIndex}) => {
    const [selected, setSelected] = useState(selectedIndex);
    const toggle = () => {
        action();
    }   

    return (
        <View style={DropdownStyle.row}>
            <Text style={DropdownStyle.text}>{text}</Text>
        </View>
    );
}