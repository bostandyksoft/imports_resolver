import { FileProcessor } from "./FileProcessor";
type LoaderOptions = {
    baseUrl: string;
    handler: ContentHandler;
};
type ModuleInfo = {
    id: string;
    content?: string;
    state: 'loading' | 'ready';
};
export type Context = {
    /**
     * Map of some scripts, that are laying nearby and there is no reason to load it from server
     */
    neighbours?: object;
    /**
     * HTTP method to load script content
     */
    method?: string;
    /**
     * Content type of request to script content
     */
    contentType?: string;
    [key: string]: any;
};
type ContentHandler = (module: string, content: string) => void;
export declare class ImportResolver {
    _baseUrl: string;
    _handler: ContentHandler;
    _dependencyMap: Map<string, ModuleInfo>;
    _processor: FileProcessor;
    constructor(props: LoaderOptions);
    clearCache(): void;
    resolveDependencies(sourceFile: string, context?: Context): Promise<void>;
    resolveDeps(initialSourceFile: string, depth: number, context?: Context): Promise<void>;
    resolveNeighbours(dependencies: string[], context?: Context): string[];
    getNewDependencies(content: string): string[];
    getReferencesForModule(content: string): string[];
    getContent(moduleName: string, context?: Context): Promise<string>;
    fetchContent(url: string, opts: any): Promise<string>;
}
export {};
//# sourceMappingURL=ImportResolver.d.ts.map