import { MapOf } from "data/util";

// Sizes
export const Sizes = <const>{
	// Main font size
	font: "14pt",
	// Section number font size,
	sectionNumberFont: "20pt",
	// Section title font
	sectionTitleFont: "24pt",
	// Comment font
	commentFont: "12pt",
	// Status bar height
	statusBar: "2em",
	// Menu anchor width
	menuAnchor: "8em",
	// Menu error display string width
	menuErrorString: "8em",
	// Line number column width
	lineNumber: "2.5em",
	// Counter number column width
	counterNumber: "2.5em",
	// Step number column width
	stepNumber: "1em",
	// Padding for cells in the rendered doc
	cellPadding: "2px",
	// Banner triangle size
	bannerTriangle: "10px",
	// Doc instruction size
	instruction: "12em",
	// Doc instruction icon size
	instructionIcon: "2.5em",
    
};
// Under this width, route will be medium
export const FullRouteSizeThreshold = 760;
// Under this width, route will be small
export const MediumRouteSizeThreshold = 500;

export type AppSizes = typeof Sizes;

// Styles
export type StyleObject = React.CSSProperties & {
    hover?: React.CSSProperties
};
// Maps style key to style object
export type StyleMap = MapOf<StyleObject>;
export interface ComputeStyleInputs {
    sizes: AppSizesWithMap,
    colors: AppColors,
    docMode: RouteDocMode
}
// Component styles are exported in functions that computes the style map
export type ComputeStyle<M extends StyleMap> = (inputs: ComputeStyleInputs)=>M;
// Using this type convertion to extract style map type from exported function
export type StyleMapOf<CS> = CS extends ComputeStyle<infer M> ? M : never;

// Maps class name to generated style class name
type ClassNameMap<M extends StyleMap> = {
    [T in keyof M]: string
}
export type ClassNameMapOf<CS> = CS extends ComputeStyle<infer M> ? ClassNameMap<M> : never;
//https://stackoverflow.com/questions/62366377/how-to-type-generic-merging-function-in-typescript
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends ((k: infer I) => void) ? I : never;
export type MergedStyleMapOf<CSArray> = UnionToIntersection<CSArray extends Array<infer CS> ? StyleMapOf<CS> : never>;
export type MergedClassNameMapOf<CSArray> = UnionToIntersection<CSArray extends Array<infer CS> ? ClassNameMapOf<CS> : never>;

export type ComputedStyle<CSArray> = {
    cssString: string,
    styles: MergedClassNameMapOf<CSArray>
}

// Route Doc Mode
export enum RouteDocMode {
    // Line number, Counter number, Step number, (Icon), Text, (Full Notes | Banner Notes | Auto = Full Notes)
    Full,
    // Counter number, Step number, (Icon), Text, (small font notes | Banner Notes | Auto = small font notes)
    Medium,
    // Counter number, Step number, (Icon), Text, (hidden notes (string will be "Hidden") | Banner Notes | Auto = Banner Notes)
    Small
}

export interface AppSizesWithMap extends AppSizes {
    map: string
}

// Colors
export interface AppColors {
    // Main text color
    text: string;
    // Small text color (e.g contribution)
    subText: string;
    // Menu border color
    menuBorder: string;
    // Menu item hover color
    menuHover: string;
    // Menu background color
    menuBackground: string;
    // Status bar color
    statusBar: string;
    // Menu anchor hover color
    menuAnchorHover: string;

    sectionNumberBackground: string;
    sectionNumberColor: string;
    sectionNumberBorder: string;
    sectionTitleBackground: string;
    sectionTitleColor: string;
    sectionTitleBorder: string;

    bannerNotesBackground: string;
    bannerNotesBorder: string;
    bannerNotesText: string;
    bannerWarningBackground: string;
    bannerWarningBorder: string;
    bannerWarningText: string;
    bannerErrorBackground: string;
    bannerErrorBorder: string;
    bannerErrorText: string;

    lineNumberBackground: string;
    lineNumberBorder: string;
    lineNumberColor: string;

    counterNumberBorder: string;
    counterText: string;

    counterShrineBackground: string;
    counterShrineText: string;
    counterTowerBackground: string;
    counterTowerText: string;
    counterWarpBackground: string;
    counterWarpText: string;
    counterMemoryBackground: string;
    counterMemoryText: string;
    counterKorokBackground: string;
    counterKorokText: string;
    counterHinoxBackground: string;
    counterHinoxText: string;
    counterTalusBackground: string;
    counterTalusText: string;
    counterMoldugaBackground: string;
    counterMoldugaText: string;

    instructionShrineBackground: string;
    instructionShrineText: string;
    instructionTowerBackground: string;
    instructionTowerText: string;
    instructionWarpBackground: string;
    instructionWarpText: string;
    instructionMemoryBackground: string;
    instructionMemoryText: string;
    instructionKorokBackground: string;
    instructionKorokText: string;
    instructionHinoxBackground: string;
    instructionHinoxText: string;
    instructionTalusBackground: string;
    instructionTalusText: string;
    instructionMoldugaBackground: string;
    instructionMoldugaText: string;

    stepNumberBackground: string;
    stepNumberBorder: string;
    stepNumberText: string;

    docTextBackground: string;
    docTextBorder: string;
    docTextColor: string;

    docNotesBackground: string;
    docNotesColor: string;

    docNotesBackgroundAlt: string;
    docNotesColorAlt: string;

    docLineBackground: string;
    docLineBackgroundAlt: string;

    stringItemColor: string;
    stringLocationColor: string;
    stringNpcColor: string;
    stringRuneColor: string;
    stringBossColor: string;
    stringEnemyColor: string;
    stringDirectionColor: string;
    stringLinkColor: string;
    stringVariableColor: string;
    stringImportantColor: string;
    stringGaleColor: string;
    stringFuryColor: string;

    stringItemColorNotes: string;
    stringLocationColorNotes: string;
    stringNpcColorNotes: string;
    stringRuneColorNotes: string;
    stringBossColorNotes: string;
    stringEnemyColorNotes: string;
    stringDirectionColorNotes: string;
    stringLinkColorNotes: string;
    stringVariableColorNotes: string;
    stringImportantColorNotes: string;
    stringGaleColorNotes: string;
    stringFuryColorNotes: string;
    
}
