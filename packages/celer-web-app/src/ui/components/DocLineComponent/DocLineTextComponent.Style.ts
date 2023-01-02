import { ComputeStyleInputs } from "ui/styles";

export const DocLineTextComponentStyle =({colors, sizes}: ComputeStyleInputs)=> <const>{
	commentFont: {
		fontSize: sizes.commentFont,
	},
	lineContainer: {
		backgroundColor: colors.docLineBackground
	},
	lineContainerAlt: {
		backgroundColor: colors.docLineBackgroundAlt
	},
	lineNumber: {
		cursor: "pointer",
		display: "inline-block",
		padding: sizes.cellPadding,
		width: sizes.lineNumber,
		boxSizing:"border-box",
		borderRight: `1px solid ${colors.lineNumberBorder}`,
		borderTop: "1px solid transparent",
		borderBottom: "1px solid transparent",
		textAlign: "right",
		backgroundColor: colors.lineNumberBackground,
		color: colors.lineNumberColor
	},
	lineNumberWithIcon: {
		verticalAlign: "top",
	},
	counterNumber: {
		display: "inline-block",
		padding: sizes.cellPadding,
		width: sizes.counterNumber,
		boxSizing: "border-box",
		textAlign: "right",

	},
	counterNumberContainer: {
		display: "inline-block",
		width: sizes.counterNumber,
		verticalAlign: "top",
	},
	counterTypeNone: {
		border: "1px solid transparent",
		color: colors.counterText
	},
	counterBorder: {
		border: `1px solid ${colors.counterNumberBorder}`,
	},
	stepNumber: {
		display: "inline-block",
		padding: sizes.cellPadding,
		width: sizes.stepNumber,
		backgroundColor: colors.stepNumberBackground,
		color: colors.stepNumberText,
		borderTop: "1px solid transparent",
		borderLeft: `1px solid ${colors.stepNumberBorder}`,
		borderBottom: `1px solid ${colors.stepNumberBorder}`,
		boxSizing: "border-box",
		overflow: "visible",
		whitespace: "nowarp",
		textAlign: "center"
	},
	instruction: {
		width: `calc( ${sizes.instruction} + ${sizes.instructionIcon} )`,

		display: "inline-block",
		borderLeft: `1px solid ${colors.docTextBorder}`,
		borderRight: `1px solid ${colors.docTextBorder}`,
		borderBottom: `1px solid ${colors.docTextBorder}`,
		borderTop: "1px solid transparent",
		padding: sizes.cellPadding,
		margin: "0",
		boxSizing: "border-box"
	},
	instructionDefaultColor: {
		backgroundColor: colors.docTextBackground,
		color: colors.docTextColor,
	},
	instructionWithIcon: {
		verticalAlign: "top",
	},

	counterShrineColor: {
		color: colors.counterShrineText,
		backgroundColor: colors.counterShrineBackground
	},
	counterTowerColor: {
		color: colors.counterTowerText,
		backgroundColor: colors.counterTowerBackground
	},
	counterWarpColor: {
		color: colors.counterWarpText,
		backgroundColor: colors.counterWarpBackground
	},
	counterMemoryColor: {
		color: colors.counterMemoryText,
		backgroundColor: colors.counterMemoryBackground
	},
	counterKorokColor: {
		color: colors.counterKorokText,
		backgroundColor: colors.counterKorokBackground
	},
	counterHinoxColor: {
		color: colors.counterHinoxText,
		backgroundColor: colors.counterHinoxBackground
	},
	counterTalusColor: {
		color: colors.counterTalusText,
		backgroundColor: colors.counterTalusBackground
	},
	counterMoldugaColor: {
		color: colors.counterMoldugaText,
		backgroundColor: colors.counterMoldugaBackground
	},

	instructionShrineColor: {
		color: colors.instructionShrineText,
		backgroundColor: colors.instructionShrineBackground
	},
	instructionTowerColor: {
		color: colors.instructionTowerText,
		backgroundColor: colors.instructionTowerBackground
	},
	instructionWarpColor: {
		color: colors.instructionWarpText,
		backgroundColor: colors.instructionWarpBackground
	},
	instructionMemoryColor: {
		color: colors.instructionMemoryText,
		backgroundColor: colors.instructionMemoryBackground
	},
	instructionKorokColor: {
		color: colors.instructionKorokText,
		backgroundColor: colors.instructionKorokBackground
	},
	instructionHinoxColor: {
		color: colors.instructionHinoxText,
		backgroundColor: colors.instructionHinoxBackground
	},
	instructionTalusColor: {
		color: colors.instructionTalusText,
		backgroundColor: colors.instructionTalusBackground
	},
	instructionMoldugaColor: {
		color: colors.instructionMoldugaText,
		backgroundColor: colors.instructionMoldugaBackground
	},

	icon: {
		float: "left",
		width: "2.5em",
		height: "0px",
		padding: "0px",
	},
	iconSideText: {
		marginLeft: "2.5em"
	},
	commentColor: {
		color: colors.docTextColor
	},
	notes: {
		position: "relative",
		display: "inline-block",
		float: "right",
		width: `calc( 100% - ${sizes.lineNumber} - ${sizes.counterNumber} - ${sizes.stepNumber} - ${sizes.instruction} - ${sizes.instructionIcon} )`,
		backgroundColor: colors.docNotesBackground,
		borderTop: "1px solid transparent",
		borderBottom: "1px solid transparent",
		boxSizing: "border-box",
		padding: sizes.cellPadding,
		color: colors.docNotesColor
	},
	notesAlt: {
		backgroundColor: colors.docNotesBackgroundAlt,
		color: colors.docNotesColorAlt
	},

};
