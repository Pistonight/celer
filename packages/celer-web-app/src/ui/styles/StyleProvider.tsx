import { MenuItemStyle } from "components/MenuItem/MenuItem.Style";
import { MapDisplayMode } from "data/settings";
import { emptyObject } from "data/util";
import React, { useContext, useEffect, useState } from "react";
import { deprecatedStyles } from "styles/deprecated";
import { DocLineSectionComponentStyle, DocLineBannerComponentStyle, DocLineTextComponentStyle, TypedStringComponentStyle } from "ui/components";
import { DocFrameStyle, MapFrameStyle } from "ui/frames";
import { Sizes, AppColors, MergedClassNameMapOf } from "./constants";
import { StyleEngine } from "./StyleEngine";

//Styles
const AllStyles = [
	DocFrameStyle,
	MapFrameStyle,
	MenuItemStyle,
	DocLineSectionComponentStyle,
	DocLineBannerComponentStyle,
	DocLineTextComponentStyle,
	TypedStringComponentStyle,
	deprecatedStyles
];

type StyleContextType = MergedClassNameMapOf<typeof AllStyles>;

const StyleContext = React.createContext<StyleContextType>(emptyObject());
const styleEngine = new StyleEngine(AllStyles);

export interface StyleProviderProps {
    mapDisplayMode: MapDisplayMode,
    appColors: AppColors,
}

export const StyleProvider: React.FC<StyleProviderProps> = ({mapDisplayMode, appColors, children})=>{
	const [styles, setStyles] = useState<StyleContextType>(styleEngine.compute(Sizes, appColors, mapDisplayMode).styles);

	useEffect(()=>{
		const { cssString, styles } = styleEngine.compute(Sizes, appColors, mapDisplayMode);
		//Find element
		const tag = document.querySelector("[data-style-engine='true'");
		if(!tag){
			console.error("StyleElement cannot find a style tag with data-style-engine set to true");
			return;
		}
		tag.textContent=cssString;
		setStyles(styles);
	}, [mapDisplayMode, appColors]);

	return <StyleContext.Provider value={styles}>
		{children}
	</StyleContext.Provider>;
};

export const useStyles = ()=>useContext(StyleContext);
