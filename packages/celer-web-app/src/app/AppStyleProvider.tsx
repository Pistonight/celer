import React, { useEffect, useMemo, useState } from "react";
import { AllStyles, StyleContext } from "ui/StyleContext";
import { LoadingFrame } from "ui/frames";
import { DefaultColors, Sizes, StyleEngine, ThemeColorMap } from "ui/styles";
import { useAppSetting, useOldAppSetting } from "core/context";
import { useNewSettings } from "core/experiments";
import { EmptyObject } from "data/util";

const styleEngine = new StyleEngine(AllStyles);

export const AppStyleProvider: React.FC<EmptyObject> = ({children})=>{
	const useNew = useNewSettings();
	const {setting} = useAppSetting();
	const { mapDisplayMode, theme } = useOldAppSetting();
	const map = useNew ? setting.mapDisplay : mapDisplayMode;
	const themeUsed = useNew ? setting.theme : theme;
	const appColors = (themeUsed && ThemeColorMap[themeUsed.name]) ?? DefaultColors;
	const [ready, setReady] = useState(false);
	const {cssString, styles} = useMemo(()=>{
		return styleEngine.compute(Sizes, appColors, map);
	}, [map, appColors]);

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
		return <LoadingFrame>Rendering</LoadingFrame>;
	}

	return <StyleContext.Provider value={styles}>
		{children}
	</StyleContext.Provider>;
};
