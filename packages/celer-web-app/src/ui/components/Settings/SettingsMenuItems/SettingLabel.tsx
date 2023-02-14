import { Setting } from "core/context";
import React from "react";
import { View, Text } from "react-native";

export interface SettingProps {
    text: string;
    action: () => void;
    value?: boolean;
    toolip?: string;
    children?: React.FC<SettingProps>[];
    values?: string[];
    selectedIndex?: number;
    actionWithValue?: (setting: number) => (draft: Setting) => void;
    actionWithValueUpdate?: (updateFunction: (draft: Setting) => void) => void;
}

export const SettingLabel: React.FunctionComponent<SettingProps> = ({text, children}) => {
    return (
        <View>
            <Text>{text}</Text>
            {children}
        </View>
    );
}
