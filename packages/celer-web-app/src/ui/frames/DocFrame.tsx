
import clsx from "clsx";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useStyles } from "ui/StyleContext";
import { DocLineComponent } from "ui/components";
import { useAppState } from "core/context";
import { DocLine, DocLineText, DocLineTextWithIcon } from "core/engine";
import { useProgressTrackerEnabled, useExpEnhancedScrollTrackerEnabled, useExpMapSyncToDocScrollEnabled, useExpNoTrackDocPos } from "core/experiments";
import { InGameCoordinates } from "core/map";
import { LocalStorageWrapper } from "data/storage";

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
	const ProgressTrackerEnabled = useProgressTrackerEnabled();
	const EnhancedScrollTrackerEnabled = useExpEnhancedScrollTrackerEnabled();
	const NoTrackDocPos = useExpNoTrackDocPos();
	const MapSyncToDocScrollEnabled = useExpMapSyncToDocScrollEnabled();

	const docFrameRef = useRef<HTMLDivElement>(null);

	// Initialize scroll position
	let currentScrollPos = 0;

	// Gets scroll position from local storage
	const loadScrollPos = (): void => {
		currentScrollPos = LocalStorageWrapper.load<number>(SCROLL_POS_KEY, 0);
		console.log("Scroll position on startup: ", currentScrollPos);
		
	};

	loadScrollPos();

	// Stores the given scroll position to local storage
	const storeScrollPos = (): void => {
		LocalStorageWrapper.store<number>(SCROLL_POS_KEY, currentScrollPos);
	};

	const [docLineComponents, docLineRefs] = useMemo(()=>{
		//console.log("Create components");
		if(EnhancedScrollTrackerEnabled){
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

	// Only store scroll position in local storage on close
	useEffect(() => {
		if (ProgressTrackerEnabled) {
			console.log("Progress tracker enabled.");
			window.addEventListener("beforeunload", storeScrollPos);
		}
	}, []);

	const styles = useStyles();
	
	const components:JSX.Element[] = [];
	if(!EnhancedScrollTrackerEnabled){
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
				if (ProgressTrackerEnabled) {
					// Track scrolling location
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					const target = e.target as any;
					currentScrollPos = target.scrollTop || 0;
					console.log(currentScrollPos);
				}

				if(!NoTrackDocPos){
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					const target = e.target as any;
					const pos = target.scrollTop || 0;
					if(Math.abs(pos - scrollPos) >= 300){
						console.log(pos);
						setScrollPos(pos);
						LocalStorageWrapper.store(SCROLL_POS_KEY, pos);
					}
				}
			}} onLoad={(e) => {
				if (ProgressTrackerEnabled) {
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					const target = e.target as any;
					target.scrollTo(0, currentScrollPos);
					console.log("Current scroll position: ", currentScrollPos);
					// console.log("Set current scroll position to ", currentScrollPos);
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
