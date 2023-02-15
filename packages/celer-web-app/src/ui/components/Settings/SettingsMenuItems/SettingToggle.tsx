import React, { useState } from "react";
import { View, Text, Switch } from "react-native";
import { CelerColors } from "ui/styles";
import { SettingProps } from "./SettingLabel";
import { ToggleStyle } from "./SettingToggle.Style";

export const SettingToggle: React.FunctionComponent<SettingProps> = ({text, action, value}) => {
	const [isEnabled, setIsEnabled] = useState(value);
	const toggle = () => {
		setIsEnabled(!isEnabled);
		action();
	};

	return (
		<View style={ToggleStyle.row}>
			<Text style={ToggleStyle.text}>{text}</Text>
			<Switch
				value = {isEnabled}
				onValueChange = {toggle}
				trackColor = {{false: CelerColors.main1, true: CelerColors.main6}}
				style = {ToggleStyle.toggle}
			/>
		</View>
	);
};
