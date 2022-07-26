import React, { useContext } from "react";
import { emptyFunction } from "data/util";

type ExperimentFunction = (name: string, defaultValue: boolean) => boolean;

export const AppExperimentsContext = React.createContext<ExperimentFunction>(emptyFunction());
AppExperimentsContext.displayName = "AppExerimentsContext";

export const useAppExperiment = (name: string, defaultValue: boolean)=>useContext(AppExperimentsContext)(name,defaultValue);
