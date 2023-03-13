
import clsx from "clsx";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useStyles } from "ui/StyleContext";
import { DocLineComponent } from "ui/components";
import { useAppSetting, useAppState } from "core/context";
import { DocLine, DocLineText, DocLineTextWithIcon } from "core/engine";
import { useExpScrollProgressTrackerEnabled} from "core/experiments";
import { InGameCoordinates } from "core/map";
import { SplitTypeSetting } from "core/settings";
import { Consumer } from "data/util";

export interface DocFrameProps {
	docLines: DocLine[],
}

// Delay for syncing map to current scroll position (ms)
const SCROLL_DELAY = 500;

const SCROLL_POS_KEY = "Celer.DocScrollPos";

const binarySearchForLine = (docLineRefs: React.RefObject<HTMLDivElement>[], y: number)=>{
	let lo = 0;
	let hi = docLineRefs.length-1;
	while (lo<=hi) {
		const mid = Math.floor((lo+hi)/2);
		const midElement = docLineRefs[mid].current;
		if (midElement) {
			const rect = midElement.getBoundingClientRect();
			if (rect.top < y) {
				lo = mid + 1;
			} else {
				hi = mid - 1;
			}
		} else {
			return 0;
		}
	}
	return lo;
};

const centerMapToLine = (docLine: DocLineText | DocLineTextWithIcon, setMapCenter: (igc: InGameCoordinates)=>void): void => {
	const centerCoord = docLine.centerCoord;
	if(centerCoord){
		setMapCenter(centerCoord);
	}
};

const searchForSection = (docLines: DocLine[], lineNum: number)=>{
	for(lineNum;lineNum>=0;lineNum--){
		const line=docLines[lineNum];
		if(line.lineType==="DocLineSection"){
			return line.sectionNumber;
		}
	}
	return 0;
};

const scrollToLine = (targetLine: number, docLineRefs: React.RefObject<HTMLDivElement>[], setCurrentLine: Consumer<number>) => {
	docLineRefs[targetLine].current?.scrollIntoView();
	setCurrentLine(targetLine);
};

const findSplit = (currentLine: number, docLines: DocLine[], docLineRefs: React.RefObject<HTMLDivElement>[], splitSettings: SplitTypeSetting<boolean>, setCurrentLine: Consumer<number>, up: boolean) => {
	let temp = currentLine;
	if(up){
		if(temp!=0){
			temp--;
		}
	}else{
		if(temp<docLines.length){
			temp++;
		}
	}
	while(temp>0 && temp<docLines.length-1){
		const checkedLine= docLines[temp];
		if(checkedLine.lineType==="DocLineTextWithIcon"){
			if(splitSettings[checkedLine.splitType]){
				break;
			}
		}
		if(up){
			temp--;
		}else{
			temp++;
		}
	}
	scrollToLine(temp, docLineRefs, setCurrentLine);
};

export const DocFrame: React.FC<DocFrameProps> = ({docLines})=>{
	const [updateHandle, setUpdateHandle] = useState<number|undefined>(undefined);
	const {setDocCurrentLine, setDocCurrentSection, setMapCenter, docCurrentLine} = useAppState();
	const ScrollProgressTrackerEnabled = useExpScrollProgressTrackerEnabled();
	const settings = useAppSetting();
	const docFrameRef = useRef<HTMLDivElement>(null);
	// Loading styles
	const styles = useStyles();

	useEffect(() => {
		const keyPressed = (e: KeyboardEvent) => {
			switch(e.key){
				case "ArrowUp":
					e.preventDefault();
					scrollToLine(docCurrentLine-1, docLineRefs, setDocCurrentLine);
					break;
				case "ArrowDown":
					e.preventDefault();
					scrollToLine(docCurrentLine+1, docLineRefs, setDocCurrentLine);
					break;
				case "PageUp":
					e.preventDefault();
					findSplit(docCurrentLine, docLines, docLineRefs, settings.setting.splitSettings, setDocCurrentLine, true);
					break;
				case "PageDown":
					e.preventDefault();
					findSplit(docCurrentLine, docLines, docLineRefs, settings.setting.splitSettings, setDocCurrentLine, false);
					break;
				default:
			}
		};
		if(settings.setting.keyboardControls){
			document.addEventListener("keydown", keyPressed);
		}
		return () => {document.removeEventListener("keydown", keyPressed);};
	},[docCurrentLine, settings]);

	const [docLineComponents, docLineRefs] = useMemo(()=>{
		// If the advanced scroll progress tracker is enabled, set docLineComponents and docLineRefs
		if (ScrollProgressTrackerEnabled) {
			let altLineColor = false;
			let altNoteColor = false;
			const components:JSX.Element[] = [];
			const refs: React.RefObject<HTMLDivElement>[] = [];
			docLines.forEach((docLine, i)=>{
				const r = React.createRef<HTMLDivElement>();
				refs.push(r);
				components.push(
					<div ref={r} key={i}>
						<DocLineComponent docLine={docLine} key={i} altLineColor={altLineColor} altNotesColor={altNoteColor} />
					</div>
				);
				if(docLine.lineType === "DocLineText" || docLine.lineType === "DocLineTextWithIcon"){
					altLineColor = !altLineColor;
					if(docLine.notes){
						altNoteColor = !altNoteColor;
					}
				}
			});
			return [components, refs];
		}
		// Otherwise, initialize them as empty arrays
		return [[],[]];
	}, [docLines]);

	// Center the map around the line corresponding with the current scroll position
	const syncMapToScrollPos = useCallback((scrollPos: number) => {
		if(!docLineRefs[0].current){
			return;
		}
		const origLineNumber = binarySearchForLine(docLineRefs, scrollPos + docLineRefs[0].current.getBoundingClientRect().top);
		let line;
		setDocCurrentLine(origLineNumber-1);
		// If the current line doesn't work (header line), check the next lines below in order.
		for (let lineNumber=origLineNumber; lineNumber<docLineRefs.length; lineNumber += 1) {
			line = docLines[lineNumber];
			if (line.lineType === "DocLineText" || line.lineType === "DocLineTextWithIcon") {
				centerMapToLine(line, setMapCenter);
				const sectionNumber = searchForSection(docLines, lineNumber);
				setDocCurrentSection(sectionNumber);
				return;
			}
		}
		// If end of document reached without finding a valid line, check lines above in order
		for (let lineNumber=origLineNumber-1; lineNumber>0; lineNumber -= 1) {
			line = docLines[lineNumber];
			if (line.lineType === "DocLineText" || line.lineType === "DocLineTextWithIcon") {
				centerMapToLine(line, setMapCenter);
				const sectionNumber = searchForSection(docLines, lineNumber);
				setDocCurrentSection(sectionNumber);
				return;
			}
		}
	}, [docLineRefs]);

	const components:JSX.Element[] = [];

	if (!ScrollProgressTrackerEnabled) {
		let altLineColor = false;
		let altNoteColor = false;
		docLines.forEach((docLine, i)=>{
			components.push(<DocLineComponent docLine={docLine} key={i} altLineColor={altLineColor} altNotesColor={altNoteColor} />);
			if(docLine.lineType === "DocLineText" || docLine.lineType === "DocLineTextWithIcon"){
				altLineColor = !altLineColor;
				if(docLine.notes){
					altNoteColor = !altNoteColor;
				}
			}
		});
		return (
			<div ref={docFrameRef} className={clsx(styles.docFrame)}>
				{components}
			</div>
		);
	}

	return (
		<div ref={docFrameRef} className={clsx(styles.docFrame)}
			// Effects when the document is scrolled
			onScroll={(e) => {
				if (ScrollProgressTrackerEnabled) {
					// Reset any existing timeouts
					if (updateHandle) {
						clearTimeout(updateHandle);
					}
					// Set the scroll position after SCROLL_DELAY ms
					const scrollDelayHandle = setTimeout(() => {
						// Calculate the current scroll position
						// eslint-disable-next-line @typescript-eslint/no-explicit-any
						const target = e.target as any;
						// Center the map around the currently selected line
						syncMapToScrollPos(target.scrollTop || 0);
						// Clear the timeout
						setUpdateHandle(undefined);
					}, SCROLL_DELAY);
					setUpdateHandle(scrollDelayHandle as unknown as number);
				}
			}}>
			{docLineComponents}
		</div>
	);

};
