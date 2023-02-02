import React, { useState } from "react";
import { View, Text, Switch } from "react-native";

import { SettingProps } from "./Setting";
import { CelerColors } from "ui/styles";
import { SettingStyle } from "./SettingToggle.Style";

export interface SettingToggleProps extends SettingProps {
    value: boolean;
}

export const SettingToggle: React.FunctionComponent<SettingToggleProps> = ({text, action, value}) => {
    const [isEnabled, setIsEnabled] = useState(value);
    const toggle = () => {
        console.log(text + ": " + !isEnabled);
        setIsEnabled(!isEnabled);
        action();
    }   

    return (
        <View style={SettingStyle.toggleRow}>
            <Text style={SettingStyle.toggleText}>{text}</Text>
            <Switch
                value = {isEnabled}
                onValueChange = {toggle}
                trackColor = {{false: CelerColors.main1, true: CelerColors.main6}}
                style = {SettingStyle.toggleSwitch}
            />
        </View>
    );
}