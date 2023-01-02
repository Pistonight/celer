
import { BannerType, Movement, SplitType, TypedString } from "core/compiler";
import { InGameCoordinates } from "core/map";
import { MapOf } from "data/util";

export type DocLine =
    DocLineSection |
    DocLineBanner |
    DocLineText |
    DocLineTextWithIcon;

export interface DocLineSection {
    lineType: "DocLineSection";
    sectionNumber: number;
    sectionName: string;
}

export interface DocLineBanner {
    lineType: "DocLineBanner";
    bannerType: BannerType;
    text: TypedString;
    showTriangle: boolean;
    variables?: MapOf<number>;
}

export interface DocLineText {
    lineType: "DocLineText";
    lineNumber: string,

    stepNumber?: string,

    text: TypedString,
    notes?: TypedString,

    centerCoord?: InGameCoordinates;
    movements: Movement[];
    mapLineColor?: string;

    variables: MapOf<number>;

}

export interface DocLineTextWithIcon extends Omit<DocLineText, "lineType"> {
    lineType: "DocLineTextWithIcon";

    splitType: SplitType;
    comment?: TypedString;
    icon: string;
    counterValue: string;

    hideIconOnMap?: boolean;
}
