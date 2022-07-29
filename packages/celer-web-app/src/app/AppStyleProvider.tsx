import React, { useEffect, useMemo, useState } from "react";
import { AllStyles, StyleContext, StyleContextType } from "ui/StyleContext";
import { DefaultColors, Sizes, StyleEngine, ThemeColorMap } from "ui/styles";
import { useAppState } from "core/context";
import { EmptyObject } from "data/util";
import { LoadingFrame } from "ui/frames/LoadingFrame";

const styleEngine = new StyleEngine(AllStyles);

export const AppStyleProvider: React.FC<EmptyObject> = ({children})=>{
	const { mapDisplayMode, theme } = useAppState();
	const appColors = (theme && ThemeColorMap[theme.name]) ?? DefaultColors;

	const [ready, setReady] = useState(false);
	const {cssString, styles} = useMemo(()=>{
		return styleEngine.compute(Sizes, appColors, mapDisplayMode);
	}, [mapDisplayMode, appColors]);

	useEffect(()=>{
		//Find element
		const tag = document.querySelector("[data-style-engine='true'");
		if(!tag){
			console.error("StyleElement cannot find a style tag with data-style-engine set to true");
			return;
		}
		tag.textContent=cssString;
		setReady(true);
	}, [cssString]);

	if(!ready){
		return <LoadingFrame>Loading Theme</LoadingFrame>
	}

	return <StyleContext.Provider value={styles}>
		{children}
	</StyleContext.Provider>;
};
