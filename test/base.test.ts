import {FileProcessor} from "../src/FileProcessor";

describe('simplest search imports', () => {

    let processor = new FileProcessor();

    it('case 1', () => {

        let imports = processor.process(`
            import * as lib from 'library';
            
            lib.smth();
        `);

        expect(imports.length).toEqual(1);
        expect(imports[0].source).toEqual('library');
    });

    it('case 2', () => {

        let imports = processor.process(`
            import { lib } from 'path1/path2/library';
            
            lib.smth();
        `);

        expect(imports.length).toEqual(1);
        expect(imports[0].source).toEqual('path1/path2/library');
    });

    it('case 3', () => {

        let imports = processor.process(`
           import * as lib from 'library';
           import { lib } from 'path1/path2/library';
            
            lib.smth();
        `);

        expect(imports.length).toEqual(2);
        expect(imports[0].source).toEqual('library');
        expect(imports[1].source).toEqual('path1/path2/library');
    });
})