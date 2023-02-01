import React, { Dispatch, SetStateAction } from "react";
import { View, Text, Pressable } from "react-native";
import { Category } from "ui/components/Settings";
import { settingsCategoryStyles, settingsDialogStyles } from "ui/styles";

type SettingsDialogProps = {
    categoryName: Category,
    selectedCategory: Category,
    setSelected: Dispatch<SetStateAction<Category>>
}

export const SettingCategory: React.FunctionComponent<SettingsDialogProps> = (props) => {
    const { categoryName, selectedCategory, setSelected } = props;
    return (
        <View>
            {/* Style as a category. Also style as a categorySelected if isSelected */}
            <Pressable style={[categoryName == selectedCategory ? settingsCategoryStyles.categorySelected : settingsCategoryStyles.category]}
                       onPress={() => setSelected(categoryName)}>
                <Text style={settingsCategoryStyles.categoryText}>{categoryName}</Text>
            </Pressable>
        </View>
    );
}
