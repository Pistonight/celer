import { StyleSheet } from "react-native";
import { CelerColors } from "ui/styles";

export const settingCategoryStyles = StyleSheet.create({
    category: {
        backgroundColor: CelerColors.main1,
        borderTopLeftRadius: 5,
        borderBottomLeftRadius: 5,
        padding: 5,
    },

    categorySelected: {
        backgroundColor: CelerColors.main2,
    },

    categoryText: {
        fontSize: 16,
        fontWeight: "600",
        color: "#000000",
    },

});