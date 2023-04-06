import { StyleSheet } from "react-native";
import { CelerColors } from "ui/styles";

export const notesDialogStyles = StyleSheet.create({
    pageBackground: {
		backgroundColor: "#ffffff99",
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
    
    dialogBackground: {
		backgroundColor: CelerColors.main1,
		width: "75%",
		minWidth: 200,
		maxWidth: 400,
		paddingHorizontal: 15,
		paddingTop: 10,
        paddingBottom: 20,
		borderWidth: 3,
	},

	headerRow: {
		flexDirection: "row",
		marginVertical: 12,
	},
    
	titleText: {
		flex: 3,
		fontSize: 20,
		fontWeight: "bold",
		color: CelerColors.text1,
	},

	subtitleText: {
		flex: 2,
        fontSize: 18,
		textAlign: "right",
		justifyContent: "center",
        color: CelerColors.text1,
	},
    
	closeButtonText: {
		color: "#ffffff",
	},

    noteText: {
        fontSize: 16,
    }

});