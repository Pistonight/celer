import { SourceBundle } from "data/bundler";
import { Params } from "react-router-dom";

export type ServiceCreator = (params: Params<string>) => DocumentService;

type DocumentServiceCallback = (doc: SourceBundle|null, error: string|null, status: string|null) => void;
export interface DocumentService {
    // Start the service, executes any async tasks to get the document
    start(callback: DocumentServiceCallback): void,
    // Clean up and destroys the service. Any pending tasks must be cancelled
    release(): void,
}
