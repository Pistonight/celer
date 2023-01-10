
import clsx from "clsx";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { useStyles } from "ui/StyleContext";
import { DocLineComponent } from "ui/components";
import { useAppState } from "core/context";
import { DocLine, DocLineText, DocLineTextWithIcon } from "core/engine";
import {
	useExpScrollProgressTrackerEnabled,
	useExpCenterToPageEnabled,
} from "core/experiments";
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

export const DocFrame: React.FC<DocFrameProps> = ({docLines})=>{
	const [updateHandle, setUpdateHandle] = useState<number|undefined>(undefined);
	const {setDocCurrentLine, setMapCenter} = useAppState();
	const ScrollProgressTrackerEnabled = useExpScrollProgressTrackerEnabled();
	const CenterToPageEnabled = useExpCenterToPageEnabled();
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
				return;
			}
		}
		// If end of document reached without finding a valid line, check lines above in order
		for (let lineNumber=origLineNumber-1; lineNumber>0; lineNumber -= 1) {
			line = docLines[lineNumber];
			if (line.lineType === "DocLineText" || line.lineType === "DocLineTextWithIcon") {
				setDocCurrentLine(lineNumber);
				centerMapToLine(line, setMapCenter);
				return;
			}
		}
	}, [docLineRefs]);

	// Center the map such that all steps visible on the document are visible on the map
	const syncMapToPage = useCallback((scrollPos: number) => {
		if(!docLineRefs[0].current){
			return;
		}
		// Find the top line that is visible on the document
		let topLineNum = binarySearchForLine(docLineRefs, scrollPos + docLineRefs[0].current.getBoundingClientRect().top);
		let lineFound = false;
		let topLine;
		// If the top line is an invalid line (header line), check lines below in order
		for (let lineNumber=topLineNum; lineNumber<docLineRefs.length; lineNumber += 1) {
			topLine = docLines[lineNumber];
			if (topLine.lineType === "DocLineText" || topLine.lineType === "DocLineTextWithIcon") {
				topLineNum = lineNumber;
				lineFound = true;
				break;
			}
		}
		// If scanning down does not lead to a valid line, center the map around the first line above
		if (!lineFound) {
			for (let lineNumber=topLineNum-1; lineNumber>0; lineNumber -= 1) {
				topLine = docLines[lineNumber];
				if (topLine.lineType === "DocLineText" || topLine.lineType === "DocLineTextWithIcon") {
					setDocCurrentLine(lineNumber);
					centerMapToLine(topLine, setMapCenter);
					return;
				}
			}
		}
		// Find the bottom line that is still visible on the document
		// TODO: getting bottom line not correct. I suspect something with getBoundingClientRect()
		let botLineNum = binarySearchForLine(docLineRefs, scrollPos + docLineRefs[0].current.getBoundingClientRect().bottom);
		let botLine;
		lineFound = false;
		for (let lineNumber=botLineNum; lineNumber>topLineNum; lineNumber -= 1) {
			botLine = docLines[lineNumber];
			if (botLine.lineType === "DocLineText" || botLine.lineType === "DocLineTextWithIcon") {
				botLineNum = lineNumber;
				lineFound = true;
				break;
			}
		}
		// If the top and bottom lines are the same, center the map around that line
		if (!lineFound) {
			topLine = docLines[topLineNum];
			if (topLine.lineType === "DocLineText" || topLine.lineType === "DocLineTextWithIcon") {
				setDocCurrentLine(topLineNum);
				centerMapToLine(topLine, setMapCenter);
				return;
			}
		}
		console.log("Top Line Number: ", topLineNum);
		console.log("Bot Line Number: ", botLineNum);
		// Calculate the minimum and maximum X and Z coordinates
		topLine = docLines[topLineNum];
		let lineCoords: InGameCoordinates | undefined;
		if (topLine.lineType === "DocLineText" || topLine.lineType === "DocLineTextWithIcon") {
			lineCoords = topLine.centerCoord;
		}
		if (!lineCoords) {
			return;
		}
		let minX = lineCoords?.ix;
		let maxX = lineCoords?.ix;
		let minZ = lineCoords?.iz;
		let maxZ = lineCoords?.iz;
		for (let lineNum = topLineNum; lineNum<=botLineNum; lineNum += 1) {
			const line = docLines[lineNum];
			if (line.lineType === "DocLineText" || line.lineType === "DocLineTextWithIcon") {
				lineCoords = line.centerCoord;
				if (!lineCoords) {
					continue;
				}
				const x = lineCoords.ix;
				const z = lineCoords.iz;
				minX = Math.min(x, minX);
				maxX = Math.max(x, maxX);
				minZ = Math.min(z, minZ);
				maxZ = Math.max(z, maxZ);
			}
		}
		console.log("Min X: ", minX);
		console.log("Max X: ", maxX);
		console.log("Min Z: ", minZ);
		console.log("Max Z: ", maxZ);
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
						// Center the map around the page if that experiment is enabled
						if (CenterToPageEnabled) {
							syncMapToPage(target.scrollTop || 0);
						} else {
							// Center the map around the currently selected line
							syncMapToScrollPos(target.scrollTop || 0);
						}
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
