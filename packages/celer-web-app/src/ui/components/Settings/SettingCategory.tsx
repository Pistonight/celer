import React from "react";
import { View, Text, Pressable } from "react-native";

import { settingsCategoryStyles, settingsDialogStyles } from "ui/styles";

type SettingsDialogProps = {
    categoryName: string,
    initiallySelected: boolean,
}

export const SettingCategory: React.FunctionComponent<SettingsDialogProps> = (props) => {
    const { categoryName, initiallySelected } = props;

    let [isSelected, setIsSelected] = React.useState(initiallySelected);

    return (
        <View>
            {/* Style as a category. Also style as a categorySelected if isSelected */}
            <Pressable style={[settingsCategoryStyles.category, isSelected && settingsCategoryStyles.categorySelected]}
                       onPress={() => {setIsSelected(!isSelected)}}>
                <Text style={settingsCategoryStyles.categoryText}>{categoryName}</Text>
            </Pressable>
        </View>
    );
}
