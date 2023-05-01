import clsx from "clsx";
import { useStyles } from "ui/StyleContext";
import { BannerType } from "core/compiler";
import { DocLineBanner, DocLineText, DocLineTextWithIcon } from "core/engine";
import { TypedStringComponent } from "../TypedStringComponent";

export interface DocLineBannerProps{
	docLine: DocLineBanner
}

export interface NoteBannerProps {
	docLine: DocLineText | DocLineTextWithIcon,
	altNotesColor: boolean | undefined
}

export const DocLineBannerComponent: React.FC<DocLineBannerProps> = ({docLine})=> {
	const {text, bannerType, showTriangle, variables} = docLine;
	const styles = useStyles();

	let containerColorStyle;
	let triangleColorStyle;
	switch(bannerType){
		case BannerType.Notes:
			containerColorStyle = styles.bannerContainerColorNotes;
			triangleColorStyle = styles.bannerTriangleColorNotes;
			break;
		case BannerType.Warning:
			containerColorStyle = styles.bannerContainerColorWarning;
			triangleColorStyle = styles.bannerTriangleColorWarning;
			break;
		case BannerType.Error:
			containerColorStyle = styles.bannerContainerColorError;
			triangleColorStyle = styles.bannerTriangleColorError;
	}

	return (
		<div className={clsx(showTriangle && styles.bannerRootWithTriangle)}>
			{showTriangle && <div className={clsx(styles.bannerTriangle, triangleColorStyle)} />}
			<div className={clsx(styles.bannerContainer, showTriangle && styles.bannerContainerWithTriangle, containerColorStyle)}>
				<p className={clsx(styles.bannerText, showTriangle && styles.bannerTextWithTriangle)} >
					<TypedStringComponent content={text} variables={variables || {}} isNotes={false}/>
				</p>
			</div>
		</div>
	);
};

export const NoteBannerComponent: React.FC<NoteBannerProps> = ({docLine, altNotesColor}) => {
	const {notes, variables} = docLine;
	const styles = useStyles();

	const containerColorStyle = altNotesColor ? styles.notesAlt : styles.bannerContainerColorNotes;
	const triangleColorStyle = styles.bannerTriangleColorNotes;

	// If notes are empty, return nothing
	if (!notes) {
		return null;
	}
    
	return (
        <div className={clsx(styles.bannerContainer, containerColorStyle)}>
            <p className={styles.bannerText} >
                <TypedStringComponent content={notes} variables={variables || {}} isNotes={false}/>
            </p>
        </div>
	);
};
