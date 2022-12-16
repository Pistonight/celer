import { Params } from "react-router-dom";
import { SourceObject } from "data/libs";

export type ServiceCreator = (params: Params<string>) => DocumentService;

type DocumentServiceCallback = (doc: SourceObject | null, error: string | null, status: string | null) => void;
export interface DocumentService {
    // Start the service, and executes any async tasks to get the document
    start(callback: DocumentServiceCallback): void,
    // Clean up and destroys the service. Any pending tasks must be cancelled
    release(): void,
    // Adds the document to the recent pages list, if applicable
    addToRecentPages(): void,
}
