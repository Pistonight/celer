import { MapCore } from "core/map";
import { SplitType } from "data/assembly";
import { LocalStorageWrapper, MapDisplayMode, MapDisplayModeStorage, SplitSettingStorage, SplitTypeSetting, Theme, ThemeStorage } from "data/settings";
import { Consumer, EmptyObject, emptyObject } from "data/util";
import React, { useContext } from "react";
import { StyleProvider } from "ui/styles";
import { DefaultColors, ThemeColorMap } from "ui/styles/Colors";
import { EngineService } from "./EngineService";

/*
 * Root component for the app. Also acts as a provider for global states
 */
type AppRootProps  = EmptyObject

interface AppRootState {
    mapDisplayMode: MapDisplayMode,
    theme: Theme,
    mapCore: MapCore,
    splitSetting: SplitTypeSetting<boolean>,
    // Updating this value will cause DocFrame to scroll to that line
    docScrollToLine: number,
    // Current line doc is on
    docCurrentLine: number,
    mapCenterGameX: number,
    mapCenterGameY: number,
    mapZoom: number,
}

interface AppRootContextState extends AppRootState {
    setMapDisplayMode: Consumer<MapDisplayMode>,
    setTheme: Consumer<Theme>,
    setSplitSetting: (value: boolean, ...splitType: SplitType[])=>void,
    setDocScrollToLine: Consumer<number>,
    setDocCurrentLine: Consumer<number>
}

const DOC_LINE_POS_KEY="DocLinePos";

const initialState: AppRootState ={
	mapDisplayMode: MapDisplayModeStorage.load(),
	theme: ThemeStorage.load(),
	splitSetting: SplitSettingStorage.load(),
	mapCore: new MapCore(),
	docScrollToLine: LocalStorageWrapper.load(DOC_LINE_POS_KEY, 0),
	docCurrentLine: 0,
	mapCenterGameX: 0,
	mapCenterGameY: 0,
	mapZoom: 3,
};

const AppRootContext = React.createContext<AppRootContextState>(emptyObject());

export class AppRoot extends React.Component<AppRootProps, AppRootState> {
	constructor(props: AppRootProps){
		super(props);
		this.state = initialState;
	}

	private setMapDisplayMode(mode: MapDisplayMode) {
		MapDisplayModeStorage.save(mode);
		this.setState({
			mapDisplayMode: mode
		});
	}

	private setTheme(theme: Theme) {
		ThemeStorage.save(theme);
		this.setState({
			theme
		});
	}

	private setSplitSetting(value: boolean, ...splitType: SplitType[]){
		const newSetting = {
			...this.state.splitSetting,
		};
		splitType.forEach(t=>newSetting[t]=value);
		SplitSettingStorage.save(newSetting);
		this.setState({
			splitSetting: newSetting
		});
	}

	private setDocCurrentLine(docCurrentLine: number): void {
		LocalStorageWrapper.store(DOC_LINE_POS_KEY, docCurrentLine);
		this.setState({
			docCurrentLine
		});
	}

	public render(): JSX.Element {

		const appColors = ThemeColorMap[this.state.theme.name] ?? DefaultColors;

		return <AppRootContext.Provider value={{
			mapDisplayMode: this.state.mapDisplayMode,
			mapCore: this.state.mapCore,
			theme: this.state.theme,
			splitSetting: this.state.splitSetting,
            
			docScrollToLine: this.state.docScrollToLine,
			docCurrentLine: this.state.docCurrentLine,
			mapCenterGameX: this.state.mapCenterGameX,
			mapCenterGameY: this.state.mapCenterGameY,
			mapZoom: this.state.mapZoom,

			setMapDisplayMode: this.setMapDisplayMode.bind(this),
			setTheme: this.setTheme.bind(this),
			setSplitSetting: this.setSplitSetting.bind(this),
			setDocScrollToLine: (docScrollToLine)=>this.setState({docScrollToLine}),
			setDocCurrentLine: this.setDocCurrentLine.bind(this)
		}}>
			<StyleProvider mapDisplayMode={this.state.mapDisplayMode} appColors={appColors}>
				<EngineService mapCore={this.state.mapCore} onRouteReload={()=>{
					// Prevent doc from going back to previous scroll position on reload
					this.setState({docScrollToLine: this.state.docCurrentLine});
				}}>
					{this.props.children}
				</EngineService>
			</StyleProvider>
		</AppRootContext.Provider>;
	}
}

export const useAppRoot = ()=>useContext(AppRootContext);
