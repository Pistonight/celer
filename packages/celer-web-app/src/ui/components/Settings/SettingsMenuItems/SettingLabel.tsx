import React, { Consumer } from "react";
import { View, Text } from "react-native";

export interface SettingProps {
    text: string;
    action: () => void;
    value?: boolean;
    toolip?: string;
    children?: React.FC<SettingProps>[];
}

export const SettingLabel: React.FunctionComponent<SettingProps> = ({text, children}) => {
    return (
        <View>
            <Text>{text}</Text>
            {children}
        </View>
    );
}
