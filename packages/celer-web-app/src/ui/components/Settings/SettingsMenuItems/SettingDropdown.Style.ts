import { StyleSheet } from "react-native";
import { CelerColors } from "ui/styles";

export const DropdownStyle = StyleSheet.create({

	container: {
		display: "flex",
		marginVertical: 5,
		padding: 5,
	},

	title: {
		fontSize: 16,
		color: "#222222",
	},

	menu: {
		margin: 5,
		position: "relative",
		display: "flex",
	},

	pageBackground: {
		backgroundColor: "#ffffff00",
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},

	dropdownVisible: {
		display: "flex",
		backgroundColor: "red",
		shadowOffset: { width: -2, height: 4 },
		shadowRadius: 6,
		shadowOpacity: 0.5,
		elevation: 3,
		zIndex: 2,
	},

	dropdownHidden: {
		display: "none",
	},

	separator: {
		borderBottomColor: "black",
		borderBottomWidth: StyleSheet.hairlineWidth,
	},

	face: {
		backgroundColor: CelerColors.main4,
		paddingVertical: 5,
		paddingHorizontal: 10,
	},

	faceText: {
		color: "white",
		fontSize: 16,
	},

	option: {
		backgroundColor: CelerColors.main5,
		paddingVertical: 5,
		paddingHorizontal: 10,
	},

	optionText: {
		color: "white",
	}

});
