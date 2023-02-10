import { FileProcessor } from "./FileProcessor";
type LoaderOptions = {
    baseUrl: string;
    handler: ContentHandler;
};
type ModuleInfo = {
    state: 'loading' | 'ready';
};
type ContentHandler = (module: string, content: string) => void;
export declare class ImportResolver {
    _baseUrl: string;
    _handler: ContentHandler;
    _dependencyMap: Map<string, ModuleInfo>;
    _processor: FileProcessor;
    constructor(props: LoaderOptions);
    resolveDependencies(sourceFile: any): Promise<void>;
    resolveDeps(initialSourceFile: string, depth: number): Promise<void>;
    getNewDependencies(content: string): string[];
    getReferencesForModule(content: string): string[];
    getContent(moduleName: string): Promise<string>;
}
export {};
//# sourceMappingURL=ImportResolver.d.ts.map