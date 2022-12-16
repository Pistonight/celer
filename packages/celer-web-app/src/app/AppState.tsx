import React, { useEffect, useState } from "react";
import { AppStateContext } from "core/context";
import { InGameCoordinates } from "core/map";
import { LocalStorageWrapper } from "data/storage";

const DOC_LINE_POS_KEY="DocLinePos";
export const AppStateProvider: React.FC = ({children})=>{
	// set up state
	const [docCurrentLine, setDocCurrentLine] = useState(
		0
	);
	const [docCurrentSection, setDocCurrentSection] = useState(
		0
	);
	useEffect(()=>{
		LocalStorageWrapper.store(DOC_LINE_POS_KEY, docCurrentLine);
	}, [docCurrentLine]);
	const [docScrollToLine, setDocScrollToLine] = useState(()=>LocalStorageWrapper.load(DOC_LINE_POS_KEY, 0));
	const [mapCenter, setMapCenter] = useState<InGameCoordinates | undefined>(undefined);

	return (
		<AppStateContext.Provider value={{
			docScrollToLine,
			docCurrentLine,
			docCurrentSection,
			mapCenter,
			setDocScrollToLine,
			setDocCurrentLine,
			setDocCurrentSection,
			setMapCenter,
		}}>
			{children}
			
		</AppStateContext.Provider>
	);
};
