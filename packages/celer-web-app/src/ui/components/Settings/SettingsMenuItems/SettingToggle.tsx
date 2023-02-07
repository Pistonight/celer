import React, { useState } from "react";
import { View, Text, Switch } from "react-native";
import { SettingProps } from "./SettingLabel";
import { CelerColors } from "ui/styles";
import { ToggleStyle } from "./SettingToggle.Style";

export const SettingToggle: React.FunctionComponent<SettingProps> = ({text, action, value}) => {
    const [isEnabled, setIsEnabled] = useState(value);
    const toggle = () => {
        console.log(text + ": " + !isEnabled);
        setIsEnabled(!isEnabled);
        action();
    }

    return (
        <View style={ToggleStyle.row}>
            <Text style={ToggleStyle.text}>{text}</Text>
            <Switch
                value = {isEnabled}
                onValueChange = {toggle}
                trackColor = {{false: CelerColors.main1, true: CelerColors.main6}}
                style = {ToggleStyle.switch}
            />
        </View>
    );
}
