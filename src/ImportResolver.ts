import {FileProcessor} from "./FileProcessor";

type LoaderOptions = {
    baseUrl: string;
    handler: ContentHandler;
}

type ModuleInfo = {
    id: string,
    content?: string,
    state: 'loading' | 'ready'
}

export type Context = {
    /**
     * Map of some scripts, that are laying nearby and there is no reason to load it from server
     */
    neighbours?: object,
    /**
     * HTTP method to load script content
     */
    method?: string,
    /**
     * Content type of request to script content
     */
    contentType?: string,
    [key: string]: any
}


type ContentHandler = (module: string, content: string) => void;

export class ImportResolver {

    _baseUrl: string;
    _handler: ContentHandler;
    _dependencyMap: Map<string, ModuleInfo>;
    _processor: FileProcessor;

    constructor(props: LoaderOptions) {
        this._baseUrl = props.baseUrl;
        this._handler = props.handler;
        this._dependencyMap = new Map<string, ModuleInfo>();
        this._processor = new FileProcessor();
    }

    clearCache() {
        this._dependencyMap.clear();
    }

    async resolveDependencies(sourceFile: string, context?: Context) {
        await this.resolveDeps(sourceFile, 0, context);
    }

    async resolveDeps(initialSourceFile: string, depth: number, context?: Context) {
        const me = this;
        let dependencies = me.getNewDependencies(initialSourceFile).filter(dep => !me._dependencyMap.has(dep))
        this.resolveNeighbours(dependencies, context);
        dependencies.forEach(dep => me._dependencyMap.set(dep, {
            id: dep,
            state: 'loading'
        }));
        await Promise.all(
            dependencies.map(async module => {
                let moduleInfo = me._dependencyMap.get(module);
                try {
                    let content = await me.getContent(module, context);
                    me._handler(module, content);
                    moduleInfo.state = 'ready';
                    await me.resolveDeps(content, depth + 1, context);
                } catch (e) {
                }
            })
        )
    }

    resolveNeighbours(dependencies: string[], context?: Context) {
        let neighbours = context?.neighbours;
        if (neighbours) {
            for (let len = dependencies.length - 1, i = len; i >= 0; i--) {
                let dep = dependencies[i];
                for (let key in neighbours) {
                    if (neighbours.hasOwnProperty(key)) {
                        if (dep.toLowerCase() == key.toLowerCase()) {
                            this._handler(key, neighbours[key]);
                            dependencies.splice(i, 1);
                        }
                    }
                }
            }
            delete context.neighbours;
        }
        return dependencies;
    }

    getNewDependencies(content: string) {
        const me = this;
        const refs = me.getReferencesForModule(content);

        return refs.filter(f => !f.startsWith(".")).filter(m => !me._dependencyMap.has(m))
    }

    getReferencesForModule(content: string): string[] {
        const imports = this._processor.process(content)
        const libMap = new Map<string, string>()

        const references = imports
            .filter(f => !f.source.endsWith(".d.ts"))
            .filter(d => !libMap.has(d.source))

        return references.map(r => {
            return r.source;
        })
    }

    async getContent(moduleName: string, context?: Context): Promise<string> {
        const me = this;
        let opts = {
            method: context?.method || 'GET',
            headers: {
                "Content-Type": context?.contentType || "text/html"
            }
        }
        if (opts.method.toUpperCase() !== 'GET' && context) {
            let body = {...context};
            delete body.method;
            delete body.contentType;

            opts = {...opts, ...{body: JSON.stringify(body)}}
        }
        return me.fetchContent(me._baseUrl + moduleName, opts);

    }

    async fetchContent(url: string, opts: any): Promise<string> {
        const request = new Request(url, opts);
        const response = await fetch(request);
        if (response.ok) {
            return response.text();
        } else {
            throw new Error(`Unable to load content from ${url}`);
        }
    }
}