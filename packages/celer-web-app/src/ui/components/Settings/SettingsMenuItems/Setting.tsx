import React from "react";
import { View, Text } from "react-native";

export interface SettingProps {
    text: string;
    action?: () => void;
    toolip?: string;
}

export const Setting: React.FunctionComponent<SettingProps> = ({text, action, toolip}) => {
    return (
        <View>
            <Text>settings menu item</Text>
        </View>
    );
}
