export interface CelerPreset {
    hasMember(): boolean,
    getDocumentation(): string,
    getPrimaryClass(): string;
    registerEnums(register: (name: string, description: string, subclass?: string, isSubNamespace?: boolean)=>void): void;
}
