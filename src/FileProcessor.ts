import {Syntax, parse} from 'esprima-next';

export type Import = {
    source: string;
}

export class FileProcessor {

    process(content: string): Import[] {
        let result = [];
        let tree = parse(content, {
            sourceType: 'module'
        });

        tree.body.forEach(stmt => {
            if (stmt.type == Syntax.ImportDeclaration) {
                result.push({
                    source: stmt.source.value
                })
            }
        })
        return result;
    }

}