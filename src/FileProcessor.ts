const acornLoose = require('acorn-loose');

export type Import = {
    source: string;
}

/**
 * Class
 */
export class FileProcessor {

    process(content: string): Import[] {
        let result = [];
        try {
            let tree = acornLoose.parse(content, {
                ecmaVersion: 2020
            });
            tree.body.forEach(stmt => {
                if (stmt.type == 'ImportDeclaration') {
                    result.push({
                        source: stmt.source.value
                    })
                }
            })
        } catch (e) {
            console.log(e);
        }
        return result;
    }

}