import { ComputeStyleInputs } from "ui/styles";

export const MenuItemStyle =({colors}: ComputeStyleInputs)=> <const>{
	menuItem: {
		padding: "5px",
		hover: {
			backgroundColor: colors.menuHover
		}
	},
	menuItemClickable: {
		cursor: "pointer",
	},
	menuItemSelected: {
		backgroundColor: colors.menuHover
	},
	menuItemValue: {
		float: "right",
	},
};
