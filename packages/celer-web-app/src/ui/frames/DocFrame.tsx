
import clsx from "clsx";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { useStyles } from "ui/StyleContext";
import { DocLineComponent } from "ui/components";
import { useAppState } from "core/context";
import { DocLine, DocLineText, DocLineTextWithIcon } from "core/engine";
import { useExpScrollProgressTrackerEnabled } from "core/experiments";
import { InGameCoordinates } from "core/map";

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
		let line=docLines[lineNum];
		if(line.lineType==='DocLineSection'){
			return line.sectionNumber;
		}
	}
	return 0;
}

export const DocFrame: React.FC<DocFrameProps> = ({docLines})=>{
	const [updateHandle, setUpdateHandle] = useState<number|undefined>(undefined);
	const { docScrollToLine , setDocCurrentLine, setDocCurrentSection, setMapCenter} = useAppState();
	const ScrollProgressTrackerEnabled = useExpScrollProgressTrackerEnabled();
	const docFrameRef = useRef<HTMLDivElement>(null);

	// Loading styles
	const styles = useStyles();

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
		// If the current line doesn't work (header line), check the next lines below in order.
		for (let lineNumber=origLineNumber; lineNumber<docLineRefs.length; lineNumber += 1) {
			line = docLines[lineNumber];
			if (line.lineType === "DocLineText" || line.lineType === "DocLineTextWithIcon") {
				setDocCurrentLine(lineNumber);
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
				setDocCurrentLine(lineNumber);
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
