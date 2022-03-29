import axios from "axios";
import { emptyFunction, MapOf } from "data/util";
import React, { useContext } from "react";
import queryString from "query-string";

type ExperimentFunction = (name: string) => boolean;

const ExperimentsContext = React.createContext<ExperimentFunction>(emptyFunction());

type ExperimentState = {
    experiments: MapOf<boolean>,
    overrides: MapOf<boolean>
}

interface ExperimentProps {
    overrides: MapOf<boolean>
}

export class Experiments extends React.Component<ExperimentProps, ExperimentState> {
	constructor(props: ExperimentProps){
		super(props);
		this.state = {
			experiments: {},
			overrides: {}
		};
	}

	public componentDidMount(): void {
		this.loadLiveExperiments();
		this.loadOverrides();
	}

	private async loadLiveExperiments(): Promise<void>{
		// Load experiments directly from repo. This will allow quick action when need to turn on/off experiments in production
		const configUrl = "https://raw.githubusercontent.com/iTNTPiston/celer-engine/main/experiments.json";
		try{
			const { data } = await axios.get(configUrl);
			this.setState({experiments: data});
		}catch(e){
			console.error(e);
			console.error("Fail to load live experiments");
		}
	}

	private loadOverrides(): void {
		const parsedQueryString = queryString.parse(window.location.search);
		const overrides: MapOf<boolean> = {};
		for(const key in parsedQueryString){
			if (key.startsWith("Exp.")){
				overrides[key.substring(4)] = !!parsedQueryString[key];
			}
		}
		this.setState({overrides});
	}

	private isExperimentEnabled(name: string): boolean {
		if(name in this.props.overrides){
			return this.props.overrides[name] === true;
		}
		if(name in this.state.overrides){
			return this.state.overrides[name] === true;
		}
		if(name in this.state.experiments){
			return this.state.experiments[name] === true;
		}
		return false;
	}

	public render(): JSX.Element {
		return (
			<ExperimentsContext.Provider value={this.isExperimentEnabled.bind(this)}>
				{this.props.children}
			</ExperimentsContext.Provider>
		);
	}
}

export const useExperiment = (name: string)=>useContext(ExperimentsContext)(name);
