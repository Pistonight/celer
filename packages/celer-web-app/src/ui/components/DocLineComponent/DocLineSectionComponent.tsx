import { DocLineSection } from "core/route";
import { useStyles } from "ui/styles";
export interface DocLineSectionProps{
    docLine: DocLineSection
}

export const DocLineSectionComponent: React.FC<DocLineSectionProps> = ({docLine})=> {
	const {sectionNumber, sectionName} = docLine;
	const styles = useStyles();
	return (
		<div className={styles.sectionTitleRoot}>
			<div className={styles.sectionNumberContainer}>
				<span className={styles.sectionNumber}>{sectionNumber}.</span>
			</div>
			<div className={styles.sectionTitleContainer}>
				<span className={styles.sectionTitle}>{sectionName}</span>
			</div>
		</div>
	);
};
