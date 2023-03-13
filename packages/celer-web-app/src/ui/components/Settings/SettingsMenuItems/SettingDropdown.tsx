import React, { useState } from "react";
import { View, Text, Pressable } from "react-native";
import { DropdownStyle } from "./SettingDropdown.Style";
import { SettingProps } from "./types";

export const SettingDropdown: React.FunctionComponent<SettingProps> = ({text, values, selectedIndex, actionWithValue, actionWithValueUpdate}) => {

	const [dropdownOpen, setDropdownOpen] = useState(false);
	return (
		<View style={DropdownStyle.container}>
			<Text style={DropdownStyle.title}>{text}</Text>
			<View style={DropdownStyle.menu}>
				<Pressable
					style={DropdownStyle.face}
					onPress={() => {setDropdownOpen(!dropdownOpen);}}
				>
					{ values !== undefined && selectedIndex !== undefined &&
						<Text style={DropdownStyle.faceText}>{values[selectedIndex]}</Text>
					}
				</Pressable>
				<View style={dropdownOpen ? DropdownStyle.dropdownVisible : DropdownStyle.dropdownHidden}>
					{values?.map((item, i) =>
						<View key={i}>
							<Pressable
								style={DropdownStyle.option}
								onPress={() => {
									const value = actionWithValue?.(values.indexOf(item));
									if(value !== undefined)
									{
										actionWithValueUpdate?.(value);
									}
									setDropdownOpen(false);}}
							>
								<Text style={DropdownStyle.optionText}>{item}</Text>
							</Pressable>
							<View style={DropdownStyle.separator}/>
						</View>
					)}
				</View>
			</View>
		</View>
	);
};
