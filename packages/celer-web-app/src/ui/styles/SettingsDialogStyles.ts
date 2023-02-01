import { Dimensions, StyleSheet } from "react-native";

import { CelerColors } from "./Colors";

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;


export const settingsDialogStyles = StyleSheet.create({
    pageBackground: {
        backgroundColor: "#ffffff99",
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },

    dialogBackground: {
        backgroundColor: CelerColors.main1,
        width: "75%",
        maxWidth: 600,
        height: "75%",
        maxHeight: 500,
        paddingHorizontal: 15,
        paddingVertical: 0,
        borderRadius: 10,
        borderWidth: 3,
    },

    headerRow: {
        flexDirection: "row",
        marginVertical: 12,
    },

    titleText: {
        flex: 6,
        fontSize: 28,
        fontWeight: "bold",
        color: CelerColors.text1,
    },

    closeButton: {
        backgroundColor: CelerColors.main6,
        borderRadius: 3,
        borderWidth: 1,
        borderColor: "#ffffff",
        textAlign: "center",
        justifyContent: "center",
        flex: 1,
    },

    closeButtonText: {
        color: "#ffffff",
    },

    menuRow: {
        flexDirection: "row",
        marginVertical: 10,
        marginHorizontal: 5,
        flex: 1,
    },

    menuSelectionPanel: {
        flex: 1,
        minWidth: 100,
    },

    menu: {
        backgroundColor: CelerColors.main2,
        borderRadius: 10,
        borderTopLeftRadius : 0,
        padding: 10,
        marginBottom: 5,
        flexGrow: 2,
    },

    settingHeader: {
        color: "#444444",
        fontSize: 15,
    }
    
});

export const settingsCategoryStyles = StyleSheet.create({
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