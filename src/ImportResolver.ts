import {FileProcessor} from "./FileProcessor";

type LoaderOptions = {
    baseUrl: string;
    handler: ContentHandler;
}

type ModuleInfo = {
    state: 'loading' | 'ready'
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

    async resolveDependencies(sourceFile) {
        await this.resolveDeps(sourceFile, 0);
    }

    async resolveDeps(initialSourceFile: string, depth: number) {
        const me = this;
        let dependencies = me.getNewDependencies(initialSourceFile).filter(dep => !me._dependencyMap.has(dep))
        dependencies.forEach(dep => me._dependencyMap.set(dep, {
            state: 'loading'
        }))
        await Promise.all(
            dependencies.map(async module => {
                let moduleInfo = me._dependencyMap.get(module);
                try {
                    let content = await me.getContent(module);
                    me._handler(module, content);
                    moduleInfo.state = 'ready';
                    await me.resolveDeps(content, depth + 1);
                } catch (e) {
                }
            })
        )
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

    async getContent(moduleName: string): Promise<string> {
        const me = this;
        const request = new Request(me._baseUrl + moduleName, {
            method: 'GET',
            headers: {
                "Content-Type": "text/html"
            }
        });
        const response = await fetch(request);
        if (response.ok) {
            return response.text();
        } else {
            throw new Error(`Unable to resolve ${moduleName}`);
        }
    }
}