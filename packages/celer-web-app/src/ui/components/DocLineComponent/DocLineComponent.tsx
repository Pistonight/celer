import { DocLine } from "core/route";
import { DocLineBannerComponent } from "./DocLineBannerComponent";
import { DocLineSectionComponent } from "./DocLineSectionComponent";
import { DocLineTextComponent, DocLineTextWithIconComponent } from "./DocLineTextComponent";
export interface DocLineProps{
    docLine: DocLine,
    altLineColor?: boolean,
    altNotesColor?: boolean,
}

export const DocLineComponent: React.FC<DocLineProps> = ({docLine, altLineColor, altNotesColor})=> {
	const lineType = docLine.lineType;
	switch(lineType){
		case "DocLineSection":
			return <DocLineSectionComponent docLine={docLine} />;
		case "DocLineBanner":
			return <DocLineBannerComponent docLine={docLine} />;
		case "DocLineText":
			return <DocLineTextComponent docLine={docLine} altLineColor={altLineColor} altNotesColor={altNotesColor}/>;
		case "DocLineTextWithIcon":
			return <DocLineTextWithIconComponent docLine={docLine} altLineColor={altLineColor} altNotesColor={altNotesColor}/>;
	}
};
