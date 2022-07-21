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

		
		menuAnchor: {
			cursor: "pointer",
			boxSizing:"border-box", 
			textAlign: "left", 
			width: sizes.menuAnchor, 
			overflow: "hidden", 
			textOverflow: "ellipsis",
			whiteSpace: "nowrap", 
			padding: "5px", 
			display: "inline-block",
			backgroundColor: colors.statusBar,
			hover:{
				backgroundColor: colors.menuAnchorHover
			}
		},
		statusMessage: {
			width: `calc( 100% - ${sizes.menuErrorString} - ${sizes.menuAnchor} )`, 
			boxSizing: "border-box", 
			display: "inline-block",
			overflow: "hidden", 
			textOverflow: "ellipsis",
			whiteSpace: "nowrap", 
			textAlign: "center", 
			padding: "5px", 
			backgroundColor: colors.statusBar
		},
		statusErrorString: {
			boxSizing:"border-box", 
			display: "inline-block",
			textAlign: "right", 
			overflow: "hidden", 
			textOverflow: "ellipsis",
			whiteSpace: "nowrap", 
			width: sizes.menuErrorString, 
			padding: "5px", 
			backgroundColor: colors.statusBar
		}
	} as const;
};
