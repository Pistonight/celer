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
    // Get the document asynchronously.
    // Further updates to the document can be send to the callback
    load(callback: Consumer<DocumentResponse>): Promise<DocumentResponse>,
    // Clean up and destroys the service. Any pending tasks must be cancelled
    release(): void,
    // DEPRECATED Get the document path (the part after #/ in the url, for example, gh/username/repo)
    // Remove with useExpUseNewRecentPath
    getPath(): string,
}
