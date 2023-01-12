import React, { useEffect, useState } from "react";
import { SettingContext, load, save } from "core/context";

const ENABLE_SUBSPLITS_KEY="EnableSubsplits";

export const AppSettingProvider: React.FC = ({children})=>{
	// TODO restructure this to a single setting object to have one key in local storage

	const [setting, setSetting] =
	useState(load());
	useEffect(() => {
		save(setting);
	}, [setting]);

	return (
		<SettingContext.Provider value={{
			setting,
			setSetting
		}}>
			{children}
		</SettingContext.Provider>
	);
};
