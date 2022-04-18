import React, { useEffect, useState } from "react";
import { AllStyles, StyleContext, StyleContextType } from "ui/StyleContext";
import { DefaultColors, Sizes, StyleEngine, ThemeColorMap } from "ui/styles";
import { useAppState } from "core/context";
import { EmptyObject } from "data/util";

const styleEngine = new StyleEngine(AllStyles);

export const AppStyleProvider: React.FC<EmptyObject> = ({children})=>{
	const { mapDisplayMode, theme } = useAppState();
	const appColors = ThemeColorMap[theme.name] ?? DefaultColors;

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
