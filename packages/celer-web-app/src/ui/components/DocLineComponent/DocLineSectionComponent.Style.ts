import { ComputeStyleInputs } from "ui/styles";

export const DocLineSectionComponentStyle =({colors, sizes}: ComputeStyleInputs)=> <const>{
	sectionTitleRoot: {
		backgroundColor: colors.sectionTitleBackground,
	},
	sectionNumberContainer: {
		display: "inline-block",
		paddingLeft: sizes.cellPadding,
		paddingRight: sizes.cellPadding,
		paddingTop: "10px",
		paddingBottom: "10px",
		width: `calc( ${sizes.lineNumber} + ${sizes.counterNumber} )`,
		boxSizing: "border-box",
		borderRight: `3px solid ${colors.sectionTitleBorder}`,
		borderBottom: `3px solid ${colors.sectionNumberBorder}`,
		borderTop: `3px solid ${colors.sectionNumberBorder}`,
		backgroundColor: colors.sectionNumberBackground,
		color: colors.sectionNumberColor,
		textAlign: "right",
		verticalAlign: "bottom",
	},
	sectionNumber: {
		display: "inline-block",
		fontSize: sizes.sectionTitleFont,
	},
	sectionTitleContainer: {
		display: "inline-block",
		paddingLeft: sizes.cellPadding,
		paddingRight: sizes.cellPadding,
		paddingTop: "10px",
		paddingBottom: "10px",
		width: `calc( 100% - ${sizes.lineNumber} - ${sizes.counterNumber} )`,
		margin: "0px",
		boxSizing: "border-box",
		borderBottom: `3px solid ${colors.sectionTitleBorder}`,
		borderTop: `3px solid ${colors.sectionTitleBorder}`,
		backgroundColor: colors.sectionTitleBackground,
		color: colors.sectionTitleColor,
		verticalAlign: "bottom",
	},
	sectionTitle: {
		fontSize: sizes.sectionTitleFont,
		marginLeft: "20px"
	}
};
