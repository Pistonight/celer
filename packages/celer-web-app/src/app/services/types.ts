import { Params } from "react-router-dom";
import { SourceObject } from "data/libs";
import { Consumer } from "data/util";

export type ServiceCreator = (params: Params<string>) => DocumentService;
export type ServiceResponse = {
    doc?: SourceObject,
    error?: string,
    status?: string
};

export interface DocumentService {
    // Start the service, executes any async tasks to get the document 
    // and return the document through the callback
    start(callback: Consumer<ServiceResponse>): void,
    // Clean up and destroys the service. Any pending tasks must be cancelled
    release(): void,
    // Adds the document to the recent pages list, if applicable
    addToRecentPages(): void,
}
