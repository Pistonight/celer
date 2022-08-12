import React, { useContext } from "react";
import { DocLine } from "core/engine";
import { MapIcon, MapLine } from "core/map";
import { RouteConfig, RouteMetadata } from "data/bundler";
import { emptyObject } from "data/util";

type DocumentContextState = {
    // these are used when NewDP is on
    metadata: RouteMetadata;
    config: RouteConfig;
    docLines: DocLine[];
    mapIcons: MapIcon[];
    mapLines: MapLine[];
    // Temporary state to store bundle.json
    bundle: string | null
}

export const DocumentContext = React.createContext<DocumentContextState>(emptyObject());

DocumentContext.displayName = "DocumentContext";

export const useDocument = ()=>useContext(DocumentContext);
