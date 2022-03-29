import { ComputeStyleInputs } from "ui/styles";

export const DocLineBannerComponentStyle = ({sizes, colors}: ComputeStyleInputs)=><const>{
	bannerRootWithTriangle: {
		marginBottom: `-${sizes.bannerTriangle}`
	},
	bannerTriangle: {
		position:"relative",
		top:`-${sizes.bannerTriangle}`,
		width:0,
		height:0, 
		borderLeft: `${sizes.bannerTriangle} solid transparent`,  
		borderRight: `${sizes.bannerTriangle} solid transparent`,  
	},
	bannerTriangleColorNotes: {
		borderBottom: `${sizes.bannerTriangle} solid ${colors.bannerNotesBorder}`
	},
	bannerTriangleColorWarning: {
		borderBottom: `${sizes.bannerTriangle} solid ${colors.bannerWarningBorder}`
	},
	bannerTriangleColorError: {
		borderBottom: `${sizes.bannerTriangle} solid ${colors.bannerErrorBorder}`
	},
	bannerContainer: {
		boxSizing:"border-box", 
		padding: sizes.cellPadding
	},
	bannerContainerColorNotes: {
		backgroundColor: colors.bannerNotesBackground, 
		borderTop: `3px solid ${colors.bannerNotesBorder}`,
		color: colors.bannerNotesText, 
	},
	bannerContainerColorWarning: {
		backgroundColor: colors.bannerWarningBackground, 
		borderTop: `3px solid ${colors.bannerWarningBorder}`,
		color: colors.bannerWarningText, 
	},
	bannerContainerColorError: {
		backgroundColor: colors.bannerErrorBackground, 
		borderTop: `3px solid ${colors.bannerErrorBorder}`,
		color: colors.bannerErrorText, 
	},
	bannerContainerWithTriangle: {
		position:"relative",
		top:`-${sizes.bannerTriangle}`,
	},
	bannerContainerNoTopBorder: {
		borderTop: "none",
	},
	bannerText: {
		display: "inline-block", 
		padding: "5px", 
		margin: "0px"
	},
	bannerTextWithTriangle: {
		paddingTop: `-${sizes.bannerTriangle}`
	},
};
