import react, {useEffect, useMemo, useState} from "react";
import { useStyles } from "ui/StyleContext";
import { Map } from "ui/components";
import { Coord } from "core/compiler";
import { useDocument } from "core/context";
import { inGameCoord, InGameCoordinates, MapIcon, MapLine, NewMapIcon, NewMapLine } from "core/map";
import { useAppState } from "core/context";
import { useCurrentBranch } from "core/experiments";

type MapFrameProps = {
	manualCenter: InGameCoordinates|undefined;
}

const updateCoord = ({x,z}: Coord): InGameCoordinates => {
	return inGameCoord(x,z);
};

const checkVisible = (item: { visible: any; }) => {
	return item.visible;
}

const updateMapLines = (lines: MapLine[]): NewMapLine[] => lines.map(({color, section, visible, vertices})=>({color, section, visible, vertices: vertices.map(updateCoord)})).filter(checkVisible);

const updateIcon = (icons: MapIcon[]): NewMapIcon[] => icons.map(({iconName, section, visible, coord})=>({iconName, section, visible, coord: updateCoord(coord)})).filter(checkVisible);
export const MapFrame: React.FC<MapFrameProps> = ({manualCenter})=>{
	const { mapLines, mapIcons } = useDocument();
	const styles = useStyles();
	const currentBranchEnabled=useCurrentBranch();
	const [lineVis, setLineVis] = useState(mapLines);
	const [iconVis, setIconVis] = useState(mapIcons);
	const [prevSection, setPrevSection] = useState(0);

	const { docCurrentSection } = useAppState();

	//Show only current section effect
	useEffect(() => {
		//Currently set to true, do not actually merge this until integrated with settings dialog
		console.log("section is", docCurrentSection);
		if (docCurrentSection != prevSection) {
			if (currentBranchEnabled) {
				setIconVis(mapIcons.map(({ iconName, section, coord, type }) => ({ iconName, section, visible: section === docCurrentSection, coord, type })));
				setLineVis(mapLines.map(({ color, section, vertices }) => ({ color, section, visible: section === docCurrentSection, vertices })));
			} else {
				setIconVis(mapIcons.map(({ iconName, section, coord, type }) => ({ iconName, section, visible: true, coord, type })));
				setLineVis(mapLines.map(({ color, section, vertices }) => ({ color, section, visible: true, vertices })));
			}
			setPrevSection(docCurrentSection);
		}
	}, [docCurrentSection, currentBranchEnabled]);

	const filteredIcons = useMemo(() => updateIcon(iconVis), [iconVis])
	const filteredLines = useMemo(() => updateMapLines(lineVis), [lineVis])
	
	return (
		<div id="mapframe" className={styles.mapFrame}>
			<Map manualCenter={manualCenter} icons={filteredIcons} lines={filteredLines} />
		</div>
	);
};
