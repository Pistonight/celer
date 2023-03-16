import { Params } from "react-router-dom";
import { SourceObject } from "data/libs";
import { Consumer } from "data/util";

export type DocumentCreator = (params: Params<string>) => Document;
export type DocumentResponse = {
    doc?: SourceObject,
    error?: string,
    status?: string
};

export interface Document {
    // Executes any async tasks to get the document 
    // and return the document through the callback
    load(callback: Consumer<DocumentResponse>): void,
    // Clean up and destroys the service. Any pending tasks must be cancelled
    release(): void,
    // Adds the document to the recent pages list, if applicable
    addToRecentPages(): void,
}
