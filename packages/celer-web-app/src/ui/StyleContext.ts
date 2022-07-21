import React, { useContext } from "react";
import { 
	DocLineBannerComponentStyle, 
	DocLineSectionComponentStyle, 
	DocLineTextComponentStyle, 
	MenuItemStyle, 
	TypedStringComponentStyle 
} from "ui/components";
import { 
	DocFrameStyle, 
	MapFrameStyle,
	MenuFrameStyle
} from "ui/frames";
import { emptyObject } from "data/util";
import { deprecatedStyles, MergedClassNameMapOf } from "./styles";
import {  } from "./frames/MenuFrame.Style";

export const AllStyles = [
	DocFrameStyle,
	MapFrameStyle,
	MenuFrameStyle,
	MenuItemStyle,
	DocLineSectionComponentStyle,
	DocLineBannerComponentStyle,
	DocLineTextComponentStyle,
	TypedStringComponentStyle,
	deprecatedStyles
];

export type StyleContextType = MergedClassNameMapOf<typeof AllStyles>;
export const StyleContext = React.createContext<StyleContextType>(emptyObject());
StyleContext.displayName="StyleContext";
export const useStyles = ()=>useContext(StyleContext);
