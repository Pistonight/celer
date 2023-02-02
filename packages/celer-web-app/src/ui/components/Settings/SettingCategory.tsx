import React, { Dispatch, SetStateAction } from "react";
import { View, Text, Pressable } from "react-native";
import { Category } from "ui/components/Settings";
import { settingCategoryStyles } from "./SettingCategory.Style";

type SettingsDialogProps = {
    categoryName: Category,
    selectedCategory: Category,
    setSelected: Dispatch<SetStateAction<Category>>
}

export const SettingCategory: React.FunctionComponent<SettingsDialogProps> = (props) => {
    const { categoryName, selectedCategory, setSelected } = props;
    return (
        <View>
            {/* Always style as a category. Also style as a categorySelected if isSelected */}
            <Pressable style={[settingCategoryStyles.category, (categoryName == selectedCategory) && settingCategoryStyles.categorySelected]}
                       onPress={() => setSelected(categoryName)}>
                <Text style={settingCategoryStyles.categoryText}>{categoryName}</Text>
            </Pressable>
        </View>
    );
}
