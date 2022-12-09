
import clsx from "clsx";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useStyles } from "ui/StyleContext";
import { DocLineComponent } from "ui/components";
import { useAppState } from "core/context";
import { DocLine, DocLineText, DocLineTextWithIcon } from "core/engine";
import {
	useScrollProgressTrackerEnabled,
	useExpEnhancedScrollTrackerEnabled,
	useExpMapSyncToDocScrollEnabled,
	useExpNoTrackDocPos
} from "core/experiments";
import { InGameCoordinates } from "core/map";
import { LocalStorageWrapper, ScrollTracker } from "data/storage";

export interface DocFrameProps {
	docLines: DocLine[],
}

const SCROLL_POS_KEY="DocFrameScrollPos";

const binarySearchForLine = (docLineRefs: React.RefObject<HTMLDivElement>[], y: number)=>{
	let lo = 0;
	let hi = docLineRefs.length-1;
	while(lo<=hi){
		const mid = Math.floor((lo+hi)/2);
		const midElement = docLineRefs[mid].current;
		if(midElement){
			const rect = midElement.getBoundingClientRect();
			if(rect.top < y){
				lo = mid + 1;
			}else{
				hi = mid - 1;
			}
		}else{
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
	//console.log("Render DocFrame");
	const [scrollPos, setScrollPos] = useState<number>(LocalStorageWrapper.load<number>(SCROLL_POS_KEY, 0));

	// const [docLineComponents, setDocLineComponents] = useState<JSX.Element[]>([]);
	// const [docLineRefs, setDocLineRefs] = useState<React.RefObject<HTMLDivElement>[]>([]);

	const { docScrollToLine , setDocCurrentLine, setMapCenter} = useAppState();
	const ScrollProgressTrackerEnabled = useScrollProgressTrackerEnabled();
	//const EnhancedScrollTrackerEnabled = useExpEnhancedScrollTrackerEnabled();
	//const NoTrackDocPos = useExpNoTrackDocPos();
	//const MapSyncToDocScrollEnabled = useExpMapSyncToDocScrollEnabled();

	const docFrameRef = useRef<HTMLDivElement>(null);

	// Initialize the scroll tracker
	const scrollTracker = new ScrollTracker();
	var scrollProgress = scrollTracker.getScrollPos();

	// Delay for syncing map to current scroll position (ms)
	const SCROLL_DELAY = 1000;

	const [docLineComponents, docLineRefs] = useMemo(()=>{
		//console.log("Create components");
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
			console.log("Doc Line Components:");
			console.log(components);
			console.log("Doc Line Refs:");
			console.log(refs);
			return [components, refs];

		}
		return [[],[]];
	}, [docLines]);



	// Center the map around the line corresponding with the current scroll position
	const syncMapToScrollPos = useCallback((scrollPos: number) => {
		//console.log("Doc line refs");
		//console.log(docLineRefs);
		console.log(docLineRefs.map(ref=>ref.current && ref.current.getBoundingClientRect()));
		if(!docLineRefs[0].current){
			return;
		}
		const lineNumber = binarySearchForLine(docLineRefs, scrollPos + docLineRefs[0].current.getBoundingClientRect().top);
		console.log({scrollPos, lineNumber, line: docLineRefs[lineNumber]});
		// // console.log("Syncing map to scroll position.");
		// // const lineNumber = getLineNumberFromScrollPos(docLineComponents, scrollPos);
		// // const lineNumber = binarySearchForLine();
		// console.log("Line number: " + lineNumber);
		// setDocCurrentLine(lineNumber);
		// const line = docLines[lineNumber];
		// console.log(line);
		// // if (line.lineType !== "DocLineBanner") {
		// // 	console.log(line.lineType);
		// // }
		// if (line.lineType === "DocLineText" || line.lineType === "DocLineTextWithIcon") {
		// 	console.log("AAAAAAAAAAAAAAAAAAAAA")
		// 	centerMapToLine(line, setMapCenter);
		// }
	}, [docLineRefs]);

	// useEffect(()=>{
	// 	if(!NoTrackDocPos){
	// 		if(docFrameRef.current){
	// 			if(docScrollToLine >= 0 && docScrollToLine < docLineRefs.length){
	// 				const line = docLineRefs[docScrollToLine].current;
	// 				if(line){
	// 					docFrameRef.current.scrollTop = line.getBoundingClientRect().top + docFrameRef.current.scrollTop;
	// 				}
	// 			}
	// 		}
	// 	}
	// }, [NoTrackDocPos, docLineRefs, docScrollToLine]);

	// Only store scroll position in local storage on close
	// useEffect(() => {
	// 	if (ScrollProgressTrackerEnabled) {
	// 		console.log("Progress tracker enabled.");
	// 		// window.addEventListener("beforeunload", scrollTracker.storeScrollPos);
	// 	}
	// }, []);

	// Only update the map view to the scrolled position after the user stops scrolling
	// useEffect(() => {
	// 	if (ScrollProgressTrackerEnabled) {
	// 		// console.log("Syncing map.")
	// 		// const timeoutID = setTimeout(() => syncMapToScrollPos(scrollPos), SCROLL_DELAY);
	// 		// return () => clearTimeout(timeoutID);
	// 		// syncMapToScrollPos(scrollPos);
	// 	}
	// }, [scrollProgress]);

	const styles = useStyles();
	
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
			<div ref={docFrameRef} className={clsx(styles.docFrame)}
				>
				{components}
			</div>
		);
	}
	
	return (
		<div ref={docFrameRef} className={clsx(styles.docFrame)} 
			// Effects when the document is loaded
			// onLoad={(e) => {
			// 	if (ScrollProgressTrackerEnabled) {
			// 		// TODO: define target more explicitly
			// 		// eslint-disable-next-line @typescript-eslint/no-explicit-any
			// 		const target = e.target as any;
			// 		target.scrollTo(0, scrollProgress);
			// 		console.log("Loading current scroll position: ", scrollProgress);
			// 	}
			
			// // Effects when the document is scrolled
			// }} 
			onScroll={(e) => {
				if (ScrollProgressTrackerEnabled) {
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					const target = e.target as any;
					scrollProgress = target.scrollTop || 0;
					syncMapToScrollPos(scrollProgress);
					scrollTracker.setScrollPos(target.scrollTop || 0);
				}

				// if(!NoTrackDocPos){
				// 	// eslint-disable-next-line @typescript-eslint/no-explicit-any
				// 	const target = e.target as any;
				// 	const pos = target.scrollTop || 0;
				// 	if(Math.abs(pos - scrollPos) >= 300){
				// 		console.log(pos);
				// 		setScrollPos(pos);
				// 		LocalStorageWrapper.store(SCROLL_POS_KEY, pos);
				// 	}
				// }

			}}>
			{docLineComponents}
		</div>
	);
	
};
