import React, { useContext } from "react";
import { emptyObject } from "data/util";
import { RouteConfig, RouteMetadata } from "data/bundler";
import { DocLine } from "core/engine";
import { MapIcon, MapLine } from "core/map";

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
