import { ComputeStyleInputs } from "ui/styles";

export const deprecatedStyles = ({sizes, colors}: ComputeStyleInputs) => {
    
	return {
		appFrame: {
			fontSize: sizes.font,
		},
		statusBarFrame:{
			position: "fixed", 
			width: `calc( 100vw - ${sizes.map} )`, 
			height: "100vh"
		},
		menuOverlayFrame:{
			position: "fixed", 
			bottom: "0", 
			right: `${sizes.map}`, 
			width: `calc( 100vw - ${sizes.map} )`,
		},
		statusBar: {
			position: "fixed", 
			bottom: "0", 
			width: `calc( 100vw - ${sizes.map} )`,
			right: `${sizes.map}`, 
			boxSizing:"border-box",
			height: sizes.statusBar,
			borderTop: "1px solid black", 
			backgroundColor: colors.statusBar
		},
		menu: {
			backgroundColor: colors.menuBackground,
			boxSizing:"border-box",
			border:`1px solid ${colors.menuBorder}`,
			padding: "2px",
			marginLeft:"calc( 100% - 20em )",//TODO
			marginRight: "3px",
			marginBottom:`calc( 4px + ${sizes.statusBar} )`
		},
		submenu: {
			position: "fixed",
			right: `calc( ${sizes.map} + 20em + 3px )`,
            
			width: "10em",
			backgroundColor: colors.menuBackground,
			boxSizing:"border-box",
			border:`1px solid ${colors.menuBorder}`,
			padding: "2px",
			//marginLeft:"calc( 100% - 30em - 3px )",//TODO
			//marginRight: "calc( 3px + 10em )",
			//marginBottom:`calc( 4px + ${sizes.statusBar} )`
		},

		contribution: {
			padding: "5px", 
			fontSize: "10pt",
			color: colors.subText
		},
		menuAnchor: {
			cursor: "pointer",
			position: "absolute",
			boxSizing:"border-box", 
			right: "0px",
			textAlign: 
             "right", width: sizes.menuAnchor, padding: "5px", backgroundColor: colors.statusBar,
			hover:{
				backgroundColor: colors.menuAnchorHover
			}
		},
		statusMessage: {
			width: `calc( 100% - ${sizes.menuErrorString} - ${sizes.menuAnchor} )`, 
			boxSizing:"border-box", float: "left", overflow: "hidden", textOverflow: "ellipsis",
			whiteSpace: "nowrap", padding: "5px", backgroundColor: colors.statusBar
		},
		statusErrorString: {
			position: "absolute",boxSizing:"border-box", right: sizes.menuAnchor, textAlign: "right", width: sizes.menuErrorString, padding: "5px", backgroundColor: colors.statusBar
		}
	} as const;
};
