import clsx from "clsx";

import { useStyles } from "ui/StyleContext";
import { SplitType } from "core/compiler";
import { useAppSetting, useOldAppSetting, useAppState } from "core/context";
import { DocLineText, DocLineTextWithIcon } from "core/engine";
import { useNewSettings, useExpCollapseNotes } from "core/experiments";
import { InGameCoordinates } from "core/map";
import Icons from "data/image";
import { TypedStringComponent } from "../TypedStringComponent";

export interface DocLineTextProps{
    docLine: DocLineText,
    altLineColor?: boolean,
    altNotesColor?: boolean,
}

export interface DocLineTextWithIconProps{
    docLine: DocLineTextWithIcon,
    altLineColor?: boolean,
    altNotesColor?: boolean,
}

const centerMapToLine = (docLine: DocLineText | DocLineTextWithIcon, setMapCenter: (igc: InGameCoordinates)=>void): void => {
	const centerCoord = docLine.centerCoord;
	if(centerCoord){
		setMapCenter(centerCoord);
	}
};

const LineNumber: React.FC<DocLineTextProps> = ({docLine})=>{
	const {lineNumber} = docLine;
	const styles = useStyles();
	const {setMapCenter} = useAppState();
	return (
		<div className={styles.lineNumber} onClick={()=>centerMapToLine(docLine, setMapCenter)}>
			<span className="code">{lineNumber}</span>
		</div>
	);
};

const LineNumberWithIcon: React.FC<DocLineTextWithIconProps> = ({docLine})=>{
	const {lineNumber} = docLine;
	const styles = useStyles();
	const {setMapCenter} = useAppState();

	return (
		<div className={clsx(styles.lineNumber, styles.lineNumberWithIcon)} onClick={()=>centerMapToLine(docLine, setMapCenter)}>
			<span className="code">{lineNumber}</span>
			<div className={styles.commentFont}>&nbsp;</div>
		</div>
	);
};

const Counter: React.FC<DocLineTextWithIconProps> = ({docLine})=>{
	const {counterValue, splitType} = docLine;
	const styles = useStyles();
	const useNew = useNewSettings();
	const {setting} = useAppSetting();
	const { splitSetting } = useOldAppSetting();
	const splits = useNew ? setting.splitSettings : splitSetting;
	if(splitType === SplitType.None || splitType === SplitType.UserDefined){
		const showSplit = splitType === SplitType.UserDefined && splits[SplitType.UserDefined];
		return (
			<div className={clsx(styles.counterNumber, styles.counterNumberContainer, styles.counterTypeNone)}>
				<span className="code">{showSplit ? "SPLT" : "." }</span>
				<div className={styles.commentFont}>&nbsp;</div>
			</div>
		);
	}
	let counterStyleName = styles.counterTypeNone;
	switch(splitType){
		case SplitType.Shrine:
			counterStyleName = styles.counterShrineColor;
			break;
		case SplitType.Tower:
			counterStyleName = styles.counterTowerColor;
			break;
		case SplitType.Warp:
			counterStyleName = styles.counterWarpColor;
			break;
		case SplitType.Memory:
			counterStyleName = styles.counterMemoryColor;
			break;
		case SplitType.Korok:
			counterStyleName = styles.counterKorokColor;
			break;
		case SplitType.Hinox:
			counterStyleName = styles.counterHinoxColor;
			break;
		case SplitType.Talus:
			counterStyleName = styles.counterTalusColor;
			break;
		case SplitType.Molduga:
			counterStyleName = styles.counterMoldugaColor;
			break;
	}
	return (
		<div className={styles.counterNumberContainer}>
			<div className={clsx(styles.counterNumber, counterStyleName, counterStyleName !== styles.counterTypeNone && styles.counterBorder)}>
				<span className="code">{counterValue}</span>
			</div>
		</div>
	);
};

const NoCounter: React.FC = ()=>{
	const styles = useStyles();
	return (
		<div className={clsx(styles.counterNumber, styles.counterTypeNone)}>
			<span className="code">.</span>
		</div>
	);
};

const StepNumber: React.FC<DocLineTextProps> = ({docLine})=>{
	const {stepNumber} = docLine;
	const styles = useStyles();
	return (
		<div className={styles.stepNumber}>
			{stepNumber ? <span className="code">{stepNumber}</span> : <span className="code">&nbsp;</span>}
		</div>
	);
};

const StepNumberWithIcon: React.FC<DocLineTextWithIconProps> = ({docLine})=>{
	const {stepNumber} = docLine;
	const styles = useStyles();
	return (
		<div className={styles.stepNumber}>
			{stepNumber ? <span className="code">{stepNumber}</span> : <span className="code">&nbsp;</span>}
			<div className={styles.commentFont}>&nbsp;</div>
		</div>
	);
};

const Notes: React.FC<DocLineTextProps | DocLineTextWithIconProps> = ({docLine, altNotesColor})=>{
	const {notes, variables} = docLine;
    const collapseNotes = useExpCollapseNotes();
	const styles = useStyles();

    // If the notes should be collapsed, render as a button if there are notes
    if (collapseNotes) {
        if (!notes) {
            return (
                <div className={clsx(styles.notes, styles.notesCollapsed, styles.notesCollapsedEmpty)}>
                    <span></span>
                </div>               
            );
        }
        return (
            <div className={clsx(styles.notes, styles.notesCollapsed, altNotesColor && styles.notesAlt)}>
                <span>•••</span>
            </div>
        );
    }

    // If there are no notes for this step, return null
	if(!notes){
		return null;
	}

    // Otherwise, return as a standard note block
    return  (
        <div className={clsx(styles.notes, altNotesColor && styles.notesAlt)}>
            <TypedStringComponent content={notes} variables={variables} isNotes/>
        </div>
    );
};

export const DocLineTextComponent: React.FC<DocLineTextProps> = ({docLine,altLineColor,altNotesColor})=> {
	const {text, variables} = docLine;
    const collapseNotes = useExpCollapseNotes();
	const styles = useStyles();

    // If the notes should be collapsed, render the instruction as wider
    if (collapseNotes) {
        return (
            <div className={clsx(styles.lineContainer, altLineColor && styles.lineContainerAlt)}>
                <LineNumber docLine={docLine} />
                <NoCounter />
                <StepNumber docLine={docLine} />
                <span className={clsx(styles.instructionNotesCollapsed, styles.instructionDefaultColor)}>
                    <TypedStringComponent content={text} variables={variables} isNotes={false}/>{"\u200b"}
                </span>
                <Notes docLine={docLine} altNotesColor={altNotesColor} />
            </div>
        );
    }

    // Otherwise, render the instructions at standard width
	return (
		<div className={clsx(styles.lineContainer, altLineColor && styles.lineContainerAlt)}>
			<LineNumber docLine={docLine} />
			<NoCounter />
			<StepNumber docLine={docLine} />
			<span className={clsx(styles.instruction, styles.instructionDefaultColor)}>
				<TypedStringComponent content={text} variables={variables} isNotes={false}/>{"\u200b"}
			</span>
			<Notes docLine={docLine} altNotesColor={altNotesColor} />
		</div>
	);
};

export const DocLineTextWithIconComponent: React.FC<DocLineTextWithIconProps> = ({docLine,altLineColor,altNotesColor})=> {
	const {text, icon, comment, splitType, variables} = docLine;
    const collapseNotes = useExpCollapseNotes();
	const styles = useStyles();

	let textStyleName = styles.instructionDefaultColor;
	switch(splitType){
		case SplitType.Shrine:
			textStyleName = styles.instructionShrineColor;
			break;
		case SplitType.Tower:
			textStyleName = styles.instructionTowerColor;
			break;
		case SplitType.Warp:
			textStyleName = styles.instructionWarpColor;
			break;
		case SplitType.Memory:
			textStyleName = styles.instructionMemoryColor;
			break;
		case SplitType.Korok:
			textStyleName = styles.instructionKorokColor;
			break;
		case SplitType.Hinox:
			textStyleName = styles.instructionHinoxColor;
			break;
		case SplitType.Talus:
			textStyleName = styles.instructionTalusColor;
			break;
		case SplitType.Molduga:
			textStyleName = styles.instructionMoldugaColor;
			break;
	}

    if (collapseNotes) {
        return (
            <div className={clsx(styles.lineContainer, altLineColor && styles.lineContainerAlt)}>
                <LineNumberWithIcon docLine={docLine} />
                <Counter docLine={docLine} />
                <StepNumberWithIcon docLine={docLine}/>
                <div className={clsx(styles.instructionNotesCollapsed, styles.instructionWithIconNotesCollapsed, textStyleName)}>
                    <div className={styles.icon}>
                        <img width={"100%"} height={"auto"} src={Icons[icon]} alt={icon}/>
                    </div>
                    <div className={styles.iconSideText}>
                        <TypedStringComponent content={text} variables={variables} isNotes={false}/>
                        <div className={clsx(styles.commentFont, styles.commentColor)}>
                            {comment && <TypedStringComponent content={comment} variables={variables} isNotes={false}/>}{"\u200b"}
                        </div>
                    </div>
                </div>
                <Notes docLine={docLine} altNotesColor={altNotesColor} />
            </div>
	    );
    }
	return (
		<div className={clsx(styles.lineContainer, altLineColor && styles.lineContainerAlt)}>
			<LineNumberWithIcon docLine={docLine} />
			<Counter docLine={docLine} />
			<StepNumberWithIcon docLine={docLine}/>
			<div className={clsx(styles.instruction, styles.instructionWithIcon, textStyleName)}>
				<div className={styles.icon}>
					<img width={"100%"} height={"auto"} src={Icons[icon]} alt={icon}/>
				</div>
				<div className={styles.iconSideText}>
					<TypedStringComponent content={text} variables={variables} isNotes={false}/>
					<div className={clsx(styles.commentFont, styles.commentColor)}>
						{comment && <TypedStringComponent content={comment} variables={variables} isNotes={false}/>}{"\u200b"}
					</div>
				</div>
			</div>
			<Notes docLine={docLine} altNotesColor={altNotesColor} />
		</div>
	);
};
