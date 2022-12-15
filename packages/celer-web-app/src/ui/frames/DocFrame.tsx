
import clsx from "clsx";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useStyles } from "ui/StyleContext";
import { DocLineComponent } from "ui/components";
import { useAppState } from "core/context";
import { DocLine, DocLineText, DocLineTextWithIcon } from "core/engine";
import {
	useExpEnhancedScrollTrackerEnabled,
	useExpMapSyncToDocScrollEnabled,
	useExpNoTrackDocPos,
	useExpScrollProgressTrackerEnabled
} from "core/experiments";
import { InGameCoordinates } from "core/map";
import { LocalStorageWrapper, ScrollTracker } from "data/storage";

export interface DocFrameProps {
	docLines: DocLine[],
}

const SCROLL_POS_KEY = "DocFrameScrollPos";

// Delay for syncing map to current scroll position (ms)
const SCROLL_DELAY = 500;

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

export const DocFrame: React.FC<DocFrameProps> = ({docLines})=>{
	const [scrollPos, setScrollPos] = useState<number>(LocalStorageWrapper.load<number>(SCROLL_POS_KEY, 0));
	const [updateHandle, setUpdateHandle] = useState<number|undefined>(undefined);
	const { docScrollToLine , setDocCurrentLine, setMapCenter} = useAppState();
	const EnhancedScrollTrackerEnabled = useExpEnhancedScrollTrackerEnabled();
	const MapSyncToDocScrollEnabled = useExpMapSyncToDocScrollEnabled();
	const NoTrackDocPos = useExpNoTrackDocPos();
	const ScrollProgressTrackerEnabled = useExpScrollProgressTrackerEnabled();

	const docFrameRef = useRef<HTMLDivElement>(null);

	// Initialize the scroll tracker
	const scrollTracker = new ScrollTracker();
	
	// Loading styles
	const styles = useStyles();

	const [docLineComponents, docLineRefs] = useMemo(()=>{
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
		if (EnhancedScrollTrackerEnabled) {
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

	useEffect(()=>{
		if(!NoTrackDocPos){
			if(docFrameRef.current){
				if(docScrollToLine >= 0 && docScrollToLine < docLineRefs.length){
					const line = docLineRefs[docScrollToLine].current;
					if(line){
						docFrameRef.current.scrollTop = line.getBoundingClientRect().top + docFrameRef.current.scrollTop;
					}
				}
			}
		}
	}, [NoTrackDocPos, docLineRefs, docScrollToLine]);

	// Center the map around the line corresponding with the current scroll position
	const syncMapToScrollPos = useCallback((scrollPos: number) => {
		if(!docLineRefs[0].current){
			return;
		}
		const lineNumber = binarySearchForLine(docLineRefs, scrollPos + docLineRefs[0].current.getBoundingClientRect().top);
		setDocCurrentLine(lineNumber);
		const line = docLines[lineNumber];
		console.log("Currently selected line:");
		console.log(line);
		if (line.lineType === "DocLineText" || line.lineType === "DocLineTextWithIcon") {
			centerMapToLine(line, setMapCenter);
		}
	}, [docLineRefs]);
	
	const components:JSX.Element[] = [];
	if (ScrollProgressTrackerEnabled) {
		console.log("Scroll Progress Tracker is Enabled");
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
	}
	if (!EnhancedScrollTrackerEnabled) {
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
			<div ref={docFrameRef} className={clsx(styles.docFrame)} onScroll={(e)=>{
				if(!NoTrackDocPos){
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					const target = e.target as any;
					const pos = target.scrollTop || 0;
					if(Math.abs(pos - scrollPos) >= 300){
						setScrollPos(pos);
						LocalStorageWrapper.store(SCROLL_POS_KEY, pos);
					}
				}
			}}>
				{components}
			</div>
		);
	}
	return (
		<div ref={docFrameRef} className={clsx(styles.docFrame)} 
			onScroll={()=>{
				const i = binarySearchForLine(docLineRefs, 0);
				setDocCurrentLine(i);
				const docLine = docLines[i];
				if(docLine.lineType === "DocLineText" || docLine.lineType === "DocLineTextWithIcon"){
					if(MapSyncToDocScrollEnabled){
						centerMapToLine(docLine, setMapCenter);
					}
				}
			}}>
			{docLineComponents}
		</div>
	);
	
};
