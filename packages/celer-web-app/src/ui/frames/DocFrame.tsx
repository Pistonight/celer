
import clsx from "clsx";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { useStyles } from "ui/StyleContext";
import { DocLineComponent } from "ui/components";
import { useAppState } from "core/context";
import { DocLine, DocLineText, DocLineTextWithIcon } from "core/engine";
import { useScrollProgressTrackerEnabled } from "core/experiments";
import { InGameCoordinates } from "core/map";
import { ScrollTracker } from "data/storage";

export interface DocFrameProps {
	docLines: DocLine[],
}

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
	// const [scrollPos, setScrollPos] = useState<number>(LocalStorageWrapper.load<number>(SCROLL_POS_KEY, 0));
	const [updateHandle, setUpdateHandle] = useState<number|undefined>(undefined);
	const { docScrollToLine , setDocCurrentLine, setDocCurrentSection, setMapCenter} = useAppState();
	const ScrollProgressTrackerEnabled = useScrollProgressTrackerEnabled();
	const docFrameRef = useRef<HTMLDivElement>(null);

	// Initialize the scroll tracker
	const scrollTracker = new ScrollTracker();
	
	// Loading styles
	const styles = useStyles();

	// Delay for syncing map to current scroll position (ms)
	const SCROLL_DELAY = 500;

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
		const lineNumber = binarySearchForLine(docLineRefs, scrollPos + docLineRefs[0].current.getBoundingClientRect().top);
		setDocCurrentLine(lineNumber);
		const sectionNumber = searchForSection(docLines, lineNumber);
		setDocCurrentSection(sectionNumber);
		const line = docLines[lineNumber];
		console.log("Currently selected line:");
		console.log(line);
		if (line.lineType === "DocLineText" || line.lineType === "DocLineTextWithIcon") {
			centerMapToLine(line, setMapCenter);
		}
	}, [docLineRefs]);
	
	const components:JSX.Element[] = [];
	if(!ScrollProgressTrackerEnabled){
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
						scrollTracker.setScrollPos(target.scrollTop || 0);
						scrollTracker.storeScrollPos();
						// Center the map around the currently selected line
						syncMapToScrollPos(scrollTracker.getScrollPos());
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
