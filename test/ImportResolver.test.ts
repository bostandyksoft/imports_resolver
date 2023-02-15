import {Context, ImportResolver} from "../src/ImportResolver";

describe('Simple test for ImportResolver', () => {

    let imports = new Map<string, string>();

    type FetchInfo = {
        url: string,
        opts: any
    }

    let queue = new Array<FetchInfo>();

    jest.spyOn(ImportResolver.prototype, 'fetchContent').mockImplementation((url, opts) => {
        queue.push({
            url: url,
            opts: opts
        });
        return new Promise<string>(resolve => {
            resolve('success');
        });
    });

    let importResolver = new ImportResolver()

    it('neighbour resolve', () => {
        let context = {
            neighbours: {
                'n1': 'neighbour1',
                'n2': 'neighbour2'
            }
        } as Context;
        let dependencies = ['library', 'n1', 'n2'];

        importResolver.resolveNeighbours(dependencies, context);

        expect(dependencies.length).toEqual(1);
        expect(dependencies[0]).toEqual('library');

        expect(!!context.neighbours).toEqual(false);
        expect(imports.size).toEqual(2);
        expect('neighbour1').toEqual(imports.get('n1'));
        expect('neighbour2').toEqual(imports.get('n2'));
        imports.clear();
    });

    it('default behavior', async () => {
        importResolver.clearCache();
        await importResolver.resolveDependencies(`
            import {lib} from 'lib'
        `, {
            baseUri: 'localhost/',
            handler: (module, content) => {
                imports.set(module, content);
            }
        })

        expect(queue.length).toEqual(1);
        expect(queue[0].url).toEqual('localhost/lib');
        expect(queue[0].opts).toEqual({
            method: 'GET',
            headers: {
                "Content-Type": "text/html"
            }
        });

        queue = [];
    });

    it('post with body', async () => {
        importResolver.clearCache();
        await importResolver.resolveDependencies(`
            import {lib} from 'lib'
        `, {
            baseUri: 'localhost/',
            handler: (module, content) => {
                imports.set(module, content);
            },
            method: 'POST',
            contentType: 'application/json',
            someInfo: 1,
            someField: 2
        })

        expect(queue.length).toEqual(1);
        expect(queue[0].url).toEqual('localhost/lib');
        expect(queue[0].opts).toEqual({
            method: 'POST',
            body: JSON.stringify({
                someInfo: 1,
                someField: 2
            }),
            headers: {
                "Content-Type": "application/json"
            }
        });

        queue = [];
    });

});