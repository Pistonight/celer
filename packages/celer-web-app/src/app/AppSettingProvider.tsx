import React, { useCallback, useEffect, useState } from "react";
import { SplitType } from "core/compiler";
import { SettingContext } from "core/context";
import { MapDisplayModeStorage, SplitSettingStorage, ThemeStorage } from "core/settings";
import { LocalStorageWrapper } from "data/storage";

const ENABLE_SUBSPLITS_KEY="EnableSubsplits";

export const AppSettingProvider: React.FC = ({children})=>{
	// TODO restructure this to a single setting object to have one key in local storage
	const [mapDisplayMode, setMapDisplayMode] = useState(
		()=>MapDisplayModeStorage.load()
	);
	useEffect(()=>{
		MapDisplayModeStorage.save(mapDisplayMode);
	}, [mapDisplayMode]);

	const [theme, setTheme] = useState(
		()=>ThemeStorage.load()
	);
	useEffect(()=>{
		ThemeStorage.save(theme);
	}, [theme]);

	const [splitSetting, setSplitSetting] = useState(()=>SplitSettingStorage.load());
	useEffect(()=>{
		SplitSettingStorage.save(splitSetting);
	}, [splitSetting]);

	const setSplitSettingWithTypes = useCallback((value: boolean, ...splitType: SplitType[])=>{
		const newSetting = {
			...splitSetting,
		};
		splitType.forEach(t=>newSetting[t]=value);
		setSplitSetting(newSetting);
	}, [splitSetting]);

	const [enableSubsplits, setEnableSubsplits] = useState(
		()=>LocalStorageWrapper.load(ENABLE_SUBSPLITS_KEY, false)
	);
	useEffect(()=>{
		LocalStorageWrapper.store(ENABLE_SUBSPLITS_KEY, enableSubsplits);
	}, [enableSubsplits]);

	return (
		<SettingContext.Provider value={{
			mapDisplayMode,
			theme,
			splitSetting,
			enableSubsplits,
			setMapDisplayMode,
			setTheme,
			setSplitSetting: setSplitSettingWithTypes,
			setEnableSubsplits,
		}}>
			{children}
			
		</SettingContext.Provider>
	);
};
