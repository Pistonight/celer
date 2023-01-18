import { MapDisplayModes, MapDisplay } from "core/settings";
import { MapOf } from "data/util";
import { FullRouteSizeThreshold, MediumRouteSizeThreshold} from "./constants";
import { ComputeStyle, StyleMap, MergedClassNameMapOf, AppColors, AppSizes, ComputedStyle, RouteDocMode, ComputeStyleInputs, StyleObject, MergedStyleMapOf } from "./types";

// Object responsible for computing CSS string from input styles
export class StyleEngine<CSArray extends Array<ComputeStyle<StyleMap>>> {
	// Input style compute functions
	private allStyles: CSArray;
	// Memoized class names. These are not expected to change so only compute them once
	private generatedClassNames?: MergedClassNameMapOf<CSArray>;
	// Memoized css strings for map size and route doc modes
	private memoizedCss: MapOf<MapOf<string>> = {};
	// Current colors. Only memoize css for one color.
	private currentColors?: AppColors;

	constructor(computeStyles: CSArray){
		this.allStyles = computeStyles;
	}

	public compute(sizes: AppSizes, colors: AppColors, mapDisplayMode: MapDisplay): ComputedStyle<CSArray> {
		let mainCss = "";
		const alternatives: MapOf<string> = {};
		if(mapDisplayMode === MapDisplayModes.Auto){
			mainCss = this.computeCssMemoized(sizes, colors, MapDisplayModes.Wide, RouteDocMode.Full);
			this.addAlternativeOption(alternatives, sizes, colors, FullRouteSizeThreshold, MapDisplayModes.Wide.mapSize, MapDisplayModes.Half, RouteDocMode.Full);
			this.addAlternativeOption(alternatives, sizes, colors, FullRouteSizeThreshold, MapDisplayModes.Half.mapSize, MapDisplayModes.Narrow, RouteDocMode.Full);
			this.addAlternativeOption(alternatives, sizes, colors, FullRouteSizeThreshold, MapDisplayModes.Narrow.mapSize,MapDisplayModes.Narrow, RouteDocMode.Medium);
			this.addAlternativeOption(alternatives, sizes, colors, MediumRouteSizeThreshold, MapDisplayModes.Narrow.mapSize, MapDisplayModes.Hidden, RouteDocMode.Medium);
			this.addAlternativeOption(alternatives, sizes, colors, MediumRouteSizeThreshold, MapDisplayModes.Hidden.mapSize,  MapDisplayModes.Hidden, RouteDocMode.Small);
		}else{
			mainCss = this.computeCssMemoized(sizes, colors, mapDisplayMode, RouteDocMode.Full);
			this.addAlternativeOption(alternatives, sizes, colors, FullRouteSizeThreshold, mapDisplayMode.mapSize, mapDisplayMode, RouteDocMode.Medium);
			this.addAlternativeOption(alternatives, sizes, colors, MediumRouteSizeThreshold, mapDisplayMode.mapSize, mapDisplayMode, RouteDocMode.Small);
		}

		const joinedCss = this.combineCss(mainCss, alternatives);

		return {
			cssString: joinedCss,
			styles: this.generatedClassNames as object
		} as ComputedStyle<CSArray>;
	}
	private addAlternativeOption(
		alternatives: MapOf<string>,
		sizes: AppSizes,
		colors: AppColors,
		docThreshold: number,
		mapSize: number,
		mapDisplayMode: MapDisplay,
		docMode: RouteDocMode
	): void{
		alternatives[String(this.computeDocModeThreshold(docThreshold, mapSize))]=this.computeCssMemoized(sizes, colors, mapDisplayMode, docMode);
	}

	private computeDocModeThreshold(docThreshold: number, mapSize: number): number{
		return docThreshold / (1 - mapSize);
	}

	private combineCss(mainCss: string, alternatives: MapOf<string>): string {
		const alternativeStrings = Object.entries(alternatives).map(([width, number])=>this.setMaxWidthForCss(width, number)).join("");
		return `${mainCss}${alternativeStrings}`;
	}

	private setMaxWidthForCss(width: string, css: string): string {
		return `@media(max-width:${width}px){${css}}`;
	}

	private computeCssMemoized(sizes: AppSizes, colors: AppColors,  mapDisplayMode: MapDisplay, docMode: RouteDocMode): string{
		// Get doc mode name using enum reverse mapping
		const docModeName = RouteDocMode[docMode];
		const { mapSize } = mapDisplayMode;
		const mapSizeString = `${mapSize * 100}%`;
		if(colors === this.currentColors){
			// Return memoized result if possible
			if(mapSizeString in this.memoizedCss){
				if(docModeName in this.memoizedCss[mapSizeString]){
					return this.memoizedCss[mapSizeString][docModeName];
				}
			}
		}else{
			// Clear memoized result if color has changed
			this.memoizedCss = {};
		}
		const css = this.computeCss({
			sizes: {
				...sizes,
				map: mapSizeString
			},
			colors,
			docMode
		});
		// Memoize result
		if(!(mapSizeString in this.memoizedCss)){
			this.memoizedCss[mapSizeString] = {};
		}
		this.memoizedCss[mapSizeString][docModeName] = css;
		return css;

	}

	private computeCss(inputs: ComputeStyleInputs): string{
		const styleMap = this.computeStyleMap(inputs);
		const classNames = this.getGeneratedClassNames(styleMap);

		const cssString = Object.entries(styleMap as object).map(([n, css])=>{
			const className = classNames[n as keyof MergedClassNameMapOf<CSArray>];

			let styleObj = css as StyleObject;
			let hoverClassString = "";
			if(styleObj.hover){
				const {hover, ...rest} = styleObj;
				hoverClassString = `.${className}:hover${this.cssObjectToString(hover)}`;
				styleObj = rest;
			}
			return `.${className}${this.cssObjectToString(styleObj)}${hoverClassString}`;
		}).join("");

		return cssString;
	}

	private computeStyleMap(inputs: ComputeStyleInputs): MergedStyleMapOf<CSArray>{
		const styleEntries = this.allStyles.reduce((res, computeStyle)=>{
			res.push(Object.entries(computeStyle(inputs)));
			return res;
		}, Array(0)).flat();
		return Object.fromEntries(styleEntries) as MergedStyleMapOf<CSArray>;
	}

	private getGeneratedClassNames(styleMap: MergedStyleMapOf<CSArray>): MergedClassNameMapOf<CSArray> {
		if (!this.generatedClassNames){
			let i = 0;
			this.generatedClassNames = Object.keys(styleMap as object).reduce((res, key)=>{
				res[key] = `g-${key}-${i}`;
				i++;
				return res;
			}, Object.create(null)) as MergedClassNameMapOf<CSArray>;
		}
		return this.generatedClassNames;
	}

	private cssObjectToString(css: object): string {
		return `{${Object.entries(css).map(([k, v]) => `${k.replace(/[A-Z]/g, match => `-${match.toLowerCase()}`)}:${v}`).join(";")}}`;
	}

}
