import React from "react";
import { View, Text } from "react-native";
import { SettingProps } from "./types";

export const SettingLabel: React.FunctionComponent<SettingProps> = ({text, children}) => {
	return (
		<View>
			<Text>{text}</Text>
			{children}
		</View>
	);
};
