import { StyleSheet } from "react-native";
import { CelerColors } from "ui/styles";

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
        minWidth: 375,
        maxWidth: 600,
        height: "75%",
        maxHeight: 500,
        paddingHorizontal: 15,
        paddingVertical: 0,
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
        marginTop: 10,
        marginBottom: 12,
        marginRight: 3,
        flex: 1,
    },

    menuSelectionPanel: {
        flex: 1,
        minWidth: 100,
    },

    menu: {
        backgroundColor: CelerColors.main2,
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

