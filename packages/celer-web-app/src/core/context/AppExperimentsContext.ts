import React, { useContext } from "react";
import { emptyFunction } from "data/util";

type ExperimentFunction = (name: string) => boolean;

export const AppExperimentsContext = React.createContext<ExperimentFunction>(emptyFunction());
AppExperimentsContext.displayName = "AppExerimentsContext";

export const useAppExperiment = (name: string)=>useContext(AppExperimentsContext)(name);
